using System.Collections.Generic;
using System.Threading;
using System.Linq;
using System.Threading.Tasks;
using FakeItEasy;
using Liverpool.Hubs;
using Liverpool.Interfaces;
using Liverpool.Models;
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

        [Test]
        public async Task GetAllUsersSucceededAndAllUsersIsCalled()
        {
            A.CallTo(() => _gameService.GetAllUsers()).Returns(new List<User>());
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("AllUsers", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.GetAllUsers();

            A.CallTo(() => _gameService.GetAllUsers()).MustHaveHappenedOnceExactly();
            A.CallTo(() => _hubClients.All.SendCoreAsync("AllUsers", A<object?[]>._, CancellationToken.None)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task CreateGameSucceededAndGameCreatedIsCalled()
        {
            A.CallTo(() => _gameService.CreateGame(A<string>._, A<string>._)).Returns(true);
            A.CallTo(() => _gameService.GetAllNotStartedGames()).Returns(new List<Game> { new Game() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("GameCreated", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.CreateGame("someGameName");

            A.CallTo(() => _gameService.CreateGame("someGameName", _hubContext.ConnectionId)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllNotStartedGames()).MustHaveHappenedOnceExactly();
            A.CallTo(() => _hubClients.All.SendCoreAsync("GameCreated", A<object?[]>._, CancellationToken.None)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task CreateGameFailedAndGameCreatedIsNotCalled()
        {
            A.CallTo(() => _gameService.CreateGame(A<string>._, A<string>._)).Returns(false);
            A.CallTo(() => _gameService.GetAllNotStartedGames()).Returns(new List<Game> { new Game() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("GameCreated", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.CreateGame("someGameName");

            A.CallTo(() => _gameService.CreateGame("someGameName", _hubContext.ConnectionId)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllNotStartedGames()).MustNotHaveHappened();
            A.CallTo(() => _hubClients.All.SendCoreAsync("GameCreated", A<object?[]>._, CancellationToken.None)).MustNotHaveHappened();
        }

        [Test]
        public async Task JoinGameSucceededAndUserJoinedGameIsCalled()
        {
            A.CallTo(() => _gameService.JoinGame(A<string>._, A<string>._)).Returns(true);
            A.CallTo(() => _gameService.GetAllNotStartedGames()).Returns(new List<Game> { new Game() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("UserJoinedGame", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.JoinGame("someGameName");

            A.CallTo(() => _gameService.JoinGame("someGameName", _hubContext.ConnectionId)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllNotStartedGames()).MustHaveHappenedOnceExactly();
            A.CallTo(() => _hubClients.All.SendCoreAsync("UserJoinedGame", A<object?[]>._, CancellationToken.None)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task JoinGameFailedAndUserJoinedGameIsNotCalled()
        {
            A.CallTo(() => _gameService.JoinGame(A<string>._, A<string>._)).Returns(false);
            A.CallTo(() => _gameService.GetAllNotStartedGames()).Returns(new List<Game> { new Game() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("UserJoinedGame", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.JoinGame("someGameName");

            A.CallTo(() => _gameService.JoinGame("someGameName", _hubContext.ConnectionId)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllNotStartedGames()).MustNotHaveHappened();
            A.CallTo(() => _hubClients.All.SendCoreAsync("UserJoinedGame", A<object?[]>._, CancellationToken.None)).MustNotHaveHappened();
        }

        [Test]
        public async Task StartGameSucceededAndGameStartedIsCalled()
        {
            A.CallTo(() => _gameService.StartGame(A<string>._, A<string>._)).Returns(true);
            A.CallTo(() => _gameService.GetAllUsersFromGame("someGameName")).Returns(new List<User> { new User() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("GameStarted", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);
            A.CallTo(() => _gameService.GetGame(A<string>._)).Returns(new Game());
            A.CallTo(() => _gameService.GetAllPlayersFromGame(A<string>._)).Returns(new List<Player>());

            await _sut.StartGame("someGameName");

            A.CallTo(() => _gameService.StartGame("someGameName", _hubContext.ConnectionId)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllUsersFromGame("someGameName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _hubClients.All.SendCoreAsync("GameStarted", A<object?[]>._, CancellationToken.None)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetGame("someGameName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllPlayersFromGame("someGameName")).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task StartGameFailedAndGameStartedIsNotCalled()
        {
            A.CallTo(() => _gameService.StartGame(A<string>._, A<string>._)).Returns(false);
            A.CallTo(() => _gameService.GetAllUsersFromGame("someGameName")).Returns(new List<User> { new User() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("GameStarted", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);
            A.CallTo(() => _gameService.GetGame(A<string>._)).Returns(new Game());
            A.CallTo(() => _gameService.GetAllPlayersFromGame(A<string>._)).Returns(new List<Player>());

            await _sut.StartGame("someGameName");

            A.CallTo(() => _gameService.StartGame("someGameName", _hubContext.ConnectionId)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllUsersFromGame("someGameName")).MustNotHaveHappened();
            A.CallTo(() => _hubClients.All.SendCoreAsync("GameStarted", A<object?[]>._, CancellationToken.None)).MustNotHaveHappened();
            A.CallTo(() => _gameService.GetGame("someGameName")).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllPlayersFromGame("someGameName")).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task GetAllNotStartedGamesSucceededAndAllNotStartedGamesIsCalled()
        {
            A.CallTo(() => _gameService.GetAllNotStartedGames()).Returns(new List<Game> { new Game() });
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("AllNotStartedGames", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.GetAllNotStartedGames();

            A.CallTo(() => _gameService.GetAllNotStartedGames()).MustHaveHappenedOnceExactly();
            A.CallTo(() => _hubClients.All.SendCoreAsync("AllNotStartedGames", A<object?[]>._, CancellationToken.None)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task DiscardCardFailedBecauseOfWrongMoveAndGameUpdatedIsNotCalled()
        {
            var players = new List<Player>
            {
                new Player(new User
                {
                    Name = "Player1",
                    ConnectionId = "Player1ConnectionId"
                }),
                new Player(new User
                {
                    Name = "Player2",
                    ConnectionId = "Player2ConnectionId"
                }),
                new Player(new User
                {
                    Name = "Player3",
                    ConnectionId = "Player3ConnectionId"
                })
            };

            var game = new Game
            {
                Players = players,
                Name = "someGameName",
                GameStarted = false,
                Deck = DeckCreator.CreateCards(),
                Creator = players[0]
            };
            
            game.StartGame();

            A.CallTo(() => _gameService.GetGame(game.Name)).Returns(game);
            A.CallTo(() => _gameService.GetPlayerFromGame(game.Name, A<string>._)).Returns(game.Players.First(p => p.Turn));
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");

            await _sut.DiscardCard(game.Name, game.Players.First(p => p.Turn).Deck[0].DisplayName, game.Players.First(p => p.Turn).Deck[0].Index);

            A.CallTo(() => _gameService.GetAllPlayersFromGame("someGameName")).MustNotHaveHappened();
        }

        [Test]
        public async Task DiscardCardFailedBecauseOfKnockAndGameUpdatedIsNotCalled()
        {
            var players = new List<Player>
            {
                new Player(new User
                {
                    Name = "Player1",
                    ConnectionId = "Player1ConnectionId"
                }),
                new Player(new User
                {
                    Name = "Player2",
                    ConnectionId = "Player2ConnectionId"
                }),
                new Player(new User
                {
                    Name = "Player3",
                    ConnectionId = "Player3ConnectionId"
                })
            };

            var game = new Game
            {
                Players = players,
                Name = "someGameName",
                GameStarted = false,
                Deck = DeckCreator.CreateCards(),
                Creator = players[0]
            };

            game.StartGame();
            game.Players.First(p => p.Turn).CurrentAllowedMove = MoveType.DropOrDiscardCards;
            game.Players.First(p => !p.Turn).PlayerAskedToKeepCard = true;

            A.CallTo(() => _gameService.GetGame(game.Name)).Returns(game);
            A.CallTo(() => _gameService.GetPlayerFromGame(game.Name, A<string>._)).Returns(game.Players.First(p => p.Turn));
            A.CallTo(() => _gameService.GetAllPlayersFromGame(game.Name)).Returns(game.Players);
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");

            await _sut.DiscardCard(game.Name, game.Players.First(p => p.Turn).Deck[0].DisplayName, game.Players.First(p => p.Turn).Deck[0].Index);

            A.CallTo(() => _gameService.GetAllPlayersFromGame(game.Name)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetGame(game.Name)).MustHaveHappenedOnceExactly();
            A.CallTo(() => _gameService.GetAllPlayersFromGame(game.Name)).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task DiscardCardSucceededAndGameUpdatedIsCalled()
        {
            var players = new List<Player>
            {
                new Player(new User
                {
                    Name = "Player1",
                    ConnectionId = "Player1ConnectionId"
                }),
                new Player(new User
                {
                    Name = "Player2",
                    ConnectionId = "Player2ConnectionId"
                }),
                new Player(new User
                {
                    Name = "Player3",
                    ConnectionId = "Player3ConnectionId"
                })
            };

            var game = new Game
            {
                Players = players,
                Name = "someGameName",
                GameStarted = false,
                Deck = DeckCreator.CreateCards(),
                Creator = players[0]
            };

            game.StartGame();
            game.Players.First(p => p.Turn).CurrentAllowedMove = MoveType.DropOrDiscardCards;

            A.CallTo(() => _gameService.GetGame(game.Name)).Returns(game);
            A.CallTo(() => _gameService.GetPlayerFromGame(game.Name, A<string>._)).Returns(game.Players.First(p => p.Turn));
            A.CallTo(() => _gameService.GetAllPlayersFromGame(game.Name)).Returns(game.Players);
            A.CallTo(() => _hubContext.ConnectionId).Returns("someFakeConnectionId");
            A.CallTo(() => _hubClients.Client(_hubContext.ConnectionId).SendCoreAsync("GameUpdate", A<object?[]>._, CancellationToken.None)).Returns(Task.CompletedTask);

            await _sut.DiscardCard(game.Name, game.Players.First(p => p.Turn).Deck[0].DisplayName, game.Players.First(p => p.Turn).Deck[0].Index);

            A.CallTo(() => _gameService.GetGame(game.Name)).MustHaveHappenedTwiceExactly();
            A.CallTo(() => _gameService.GetAllPlayersFromGame(game.Name)).MustHaveHappenedANumberOfTimesMatching(c => c ==3);
            A.CallTo(() => _hubClients.All.SendCoreAsync("GameUpdate", A<object?[]>._, CancellationToken.None)).MustHaveHappenedANumberOfTimesMatching(c => c == 3);
        }
    }
}