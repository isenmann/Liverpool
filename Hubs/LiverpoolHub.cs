using Liverpool.Interfaces;
using Liverpool.Models;
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
                    Players = g.Players.Select(p => new PlayerDto
                    {
                        Name = p.User.Name,
                        CountofCards = p.Deck != null ? p.Deck.Count : 0, 
                        DroppedCards = p.DroppedCards,
                        Points = p.Points
                    }).ToList()
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
                    Players = g.Players.Select(p => new PlayerDto
                    {
                        Name = p.User.Name,
                        CountofCards = p.Deck != null ? p.Deck.Count : 0,
                        DroppedCards = p.DroppedCards,
                        Points = p.Points
                    }).ToList()
                });
                await Clients.All.SendAsync("UserJoinedGame", response);
            }
        }

        public async Task StartGame(string gameName)
        {
            var started = _liverpoolGameService.StartGame(gameName, Context.ConnectionId);
            if (started)
            {
                var usersOfGame = _liverpoolGameService.GetAllUsersFromGame(gameName);
                await Clients.Clients(usersOfGame.Select(u => u.ConnectionId).ToList()).SendAsync("GameStarted", gameName);
            }

            await GameUpdated(gameName);
        }

        public async Task GetAllNotStartedGames()
        {
            var games = _liverpoolGameService.GetAllNotStartedGames();
            var response = games.Select(g => new GameDto
            {
                GameStarted = g.GameStarted,
                Name = g.Name,
                Players = g.Players.Select(p => new PlayerDto
                {
                    Name = p.User.Name,
                    CountofCards = p.Deck != null ? p.Deck.Count : 0,
                    DroppedCards = p.DroppedCards,
                    Points = p.Points
                }).ToList()
            });
            await Clients.Client(Context.ConnectionId).SendAsync("AllNotStartedGames", response);
        }

        private async Task GameUpdated(string gameName)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var allPlayersInTheGame = _liverpoolGameService.GetAllPlayersFromGame(gameName);
            
            if (game.GameStarted)
            {
                foreach (var player in allPlayersInTheGame)
                {
                    var gameDto = new GameDto
                    {
                        GameStarted = game.GameStarted,
                        Name = game.Name,
                        Players = allPlayersInTheGame.Select(p => new PlayerDto
                        {
                            Name = p.User.Name,
                            CountofCards = p.Deck != null ? p.Deck.Count : 0,
                            DroppedCards = p.DroppedCards,
                            Points = p.Points
                        }).ToList(),
                        DiscardPile = game.DiscardPile.LastOrDefault()
                    };

                    gameDto.MyCards = game.Players.FirstOrDefault(x => x.User.ConnectionId == player.User.ConnectionId).Deck;
                    gameDto.Player = gameDto.Players.FirstOrDefault(x => x.Name == player.User.Name);
                    gameDto.Players.Remove(gameDto.Players.FirstOrDefault(x => x.Name == player.User.Name));
                    await Clients.Client(player.User.ConnectionId).SendAsync("GameUpdate", gameDto);
                }
            }
        }

        public async Task DiscardCard(string gameName, string card)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            // if it's not player's turn, do nothing
            if (!player.Turn)
            {
                return;
            }

            if (player.CurrentAllowedMove != MoveType.DropOrDiscardCards)
            {
                return;
            }

            game.NextTurn();

            game.DiscardPile.Add(new Card(card));
            player.Deck.RemoveAll(c => c.DisplayName == card);

            await GameUpdated(gameName);
        }

        public async Task DrawCardFromDrawPile(string gameName)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            // if it's not player's turn, do nothing
            if (!player.Turn)
            {
                return;
            }

            if (player.CurrentAllowedMove != MoveType.DrawCard)
            {
                return;
            }

            player.CurrentAllowedMove = MoveType.DropOrDiscardCards;

            player.Deck.AddRange(game.Deck.GetAndRemove(0, 1));
            
            await GameUpdated(gameName);
        }

        public async Task DrawCardFromDiscardPile(string gameName, string cardName)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            // if it's not player's turn, do nothing
            if (!player.Turn)
            {
                return;
            }

            if (player.CurrentAllowedMove != MoveType.DrawCard)
            {
                return;
            }

            player.CurrentAllowedMove = MoveType.DropOrDiscardCards;

            var card = game.DiscardPile.Last();
            if (card.DisplayName == cardName)
            {
                player.Deck.Add(card);
                game.DiscardPile.Remove(card);

                await GameUpdated(gameName);
            }
        }

        public async Task DropCard(string gameName, string card)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            // if it's not player's turn, do nothing
            if (!player.Turn)
            {
                return;
            }

            if (player.CurrentAllowedMove != MoveType.DropOrDiscardCards)
            {
                return;
            }

            player.Deck.RemoveAll(c => c.DisplayName == card);
            player.DroppedCards.Add(new Card(card));

            await GameUpdated(gameName);
        }
    }
}
