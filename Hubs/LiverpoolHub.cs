using Liverpool.Interfaces;
using Liverpool.Models.Dtos;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Liverpool.Hubs
{
    public class LiverpoolHub : Hub
    {
        private readonly ILiverpoolGameService _liverpoolGameService;

        public LiverpoolHub(ILiverpoolGameService liverpoolGameService)
        {
            _liverpoolGameService = liverpoolGameService ?? throw new ArgumentNullException(nameof(liverpoolGameService));
        }

        public override async Task OnConnectedAsync()
        {
            var success = _liverpoolGameService.AddUser(Context.ConnectionId);
            if (success)
            {
                var users = _liverpoolGameService.GetAllUsers();
                await Clients.All.SendAsync("UserConnected", users.Select(u => u.Name));
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var name = _liverpoolGameService.RemoveUser(Context.ConnectionId);
            if (!string.IsNullOrWhiteSpace(name))
            {
                var users = _liverpoolGameService.GetAllUsers();
                await Clients.All.SendAsync("UserDisconnected", name, users.Select(u => u.Name));
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SetUserName(string userName)
        {
            var success = _liverpoolGameService.SetUserName(Context.ConnectionId, userName);

            if (success) 
            {
                var users = _liverpoolGameService.GetAllUsers();
                await Clients.All.SendAsync("UserSetName", users.Select(u => u.Name)); 
            }
        }

        public async Task GetAllUsers()
        {
            var users = _liverpoolGameService.GetAllUsers();
            await Clients.Client(Context.ConnectionId).SendAsync("AllUsers", users.Select(u => u.Name));
        }

        public async Task CreateGame(string gameName)
        {
            var created = _liverpoolGameService.CreateGame(gameName, Context.ConnectionId);
            if (created)
            {
                var games = _liverpoolGameService.GetAllNotStartedGames();
                var response = games.Select(g => new GameDto
                {
                    GameStarted = g.GameStarted,
                    Name = g.Name,
                    Players = g.Players.Select(p => p.User.Name).ToList()
                });
                await Clients.All.SendAsync("GameCreated", response);
            }
        }

        public async Task JoinGame(string gameName)
        {
            var joined = _liverpoolGameService.JoinGame(gameName, Context.ConnectionId);
            if (joined)
            {
                var games = _liverpoolGameService.GetAllNotStartedGames();
                var response = games.Select(g => new GameDto
                {
                    GameStarted = g.GameStarted,
                    Name = g.Name,
                    Players = g.Players.Select(p => p.User.Name).ToList()
                });
                await Clients.All.SendAsync("UserJoinedGame", response);
            }
        }

        public async Task GetAllNotStartedGames()
        {
            var games = _liverpoolGameService.GetAllNotStartedGames();
            var response = games.Select(g => new GameDto
            {
                GameStarted = g.GameStarted,
                Name = g.Name,
                Players = g.Players.Select(p => p.User.Name).ToList()
            });
            await Clients.Client(Context.ConnectionId).SendAsync("AllNotStartedGames", response);
        }
    }
}
