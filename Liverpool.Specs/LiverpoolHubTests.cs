using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FakeItEasy;
using Liverpool.Hubs;
using Liverpool.Interfaces;
using Liverpool.Models;
using Liverpool.Services;
using Microsoft.AspNetCore.SignalR;
using NUnit.Framework;

namespace Liverpool.Specs
{
    [TestFixture]
    public class LiverpoolHubTests
    {
        private LiverpoolHub _sut;
        private ILiverpoolGameService _gameService;
        private HubCallerContext _hubContext;
        private IHubCallerClients _hubClients;
        private IClientProxy _clientProxy;

        [SetUp]
        public void Setup()
        {
            _gameService = A.Fake<ILiverpoolGameService>(x => x.Strict());
            _hubContext = A.Fake<HubCallerContext>(x => x.Strict());
            _hubClients = A.Fake<IHubCallerClients>(x => x.Strict());
            _clientProxy = A.Fake<IClientProxy>(x => x.Strict());
            A.CallTo(() => _hubClients.All).Returns(_clientProxy);
            A.CallTo(() => _hubClients.Client(A<string>._)).Returns(_clientProxy);
            A.CallTo(() => _hubClients.Clients(A<List<string>>._)).Returns(_clientProxy);
            _sut = new LiverpoolHub(_gameService);
            _sut.Context = _hubContext;
            _sut.Clients = _hubClients;
        }

        [Test]
        public async Task ReconnectUserFailedAndNoGameUpdatedIsCalled()
        {
            A.CallTo(() => _gameService.ReconnectUser(A<string>._, A<string>._)).Returns(false);
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            await _sut.ReconnectUser("someGameName", "userName");
            
            A.CallTo(() => _gameService.ReconnectUser("someFakeConnectionId", "userName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetGame("someGameName")).MustNotHaveHappened();
            A.CallTo(() => _gameService.GetAllPlayersFromGame("someGameName")).MustNotHaveHappened();
        }

        [Test]
        public async Task ReconnectUserSucceededAndGameUpdatedIsCalled()
        {
            A.CallTo(() => _gameService.ReconnectUser(A<string>._, A<string>._)).Returns(true);
            A.CallTo(() => _gameService.GetGame(A<string>._)).Returns(new Game());
            A.CallTo(() => _gameService.GetAllPlayersFromGame(A<string>._)).Returns(new List<Player>());
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            await _sut.ReconnectUser("someGameName", "userName");

            A.CallTo(() => _gameService.ReconnectUser("someFakeConnectionId", "userName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetGame("someGameName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllPlayersFromGame("someGameName")).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task SetUserNameSucceededAndGameUpdatedIsCalled()
        {
            A.CallTo(() => _gameService.SetUserName(A<string>._, A<string>._)).Returns(true);
            A.CallTo(() => _gameService.GetAllUsers()).Returns(new List<User>());
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.All.SendCoreAsync("UserSetName", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.SetUserName("userName");

            A.CallTo(() => _gameService.SetUserName("someFakeConnectionId", "userName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllUsers()).MustHaveHappenedOnceExactly();
            A.CallTo(() => _hubClients.All.SendCoreAsync("UserSetName", A<object?[]>._, CancellationToken.None)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task SetUserNameFailedAndGameUpdatedIsNotCalled()
        {
            A.CallTo(() => _gameService.SetUserName(A<string>._, A<string>._)).Returns(false);
            A.CallTo(() => _gameService.GetAllUsers()).Returns(new List<User>());
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.All.SendCoreAsync("UserSetName", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.SetUserName("userName");

            A.CallTo(() => _gameService.SetUserName("someFakeConnectionId", "userName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllUsers()).MustNotHaveHappened();
            A.CallTo(() => _hubClients.All.SendCoreAsync("UserSetName", A<object?[]>._, CancellationToken.None)).MustNotHaveHappened();
        }
    }
}