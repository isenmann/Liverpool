using Liverpool.Interfaces;
using Liverpool.Models;
using Liverpool.Models.Dtos;
using Microsoft.AspNetCore.SignalR;
using System;
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
                            Points = p.Points,
                            PlayersTurn = p.Turn
                        }).ToList(),
                        PlayersRanked = allPlayersInTheGame.Select(p => new PlayerRankedDto
                        {
                            Name = p.User.Name,
                            Points = p.Points
                        }).OrderByDescending(p => p.Points).ToList(),
                        PlayersKnocked = allPlayersInTheGame.Where(p => p.PlayerKnocked).Select(k => k.User.Name).ToList(),
                        DiscardPile = game.DiscardPile.LastOrDefault(),
                        RoundFinished = game.RoundFinished,
                        GameFinished = game.GameFinished,
                        Mantra = game.Mantra,
                        Round = game.Round,
                        KeepingCard = game.AskToKeepCardPile.LastOrDefault(),
                        PlayerAskedForKeepingCard = allPlayersInTheGame.Any(p => p.PlayerAskedToKeepCard)
                    };

                    gameDto.MyCards = game.Players.FirstOrDefault(x => x.User.ConnectionId == player.User.ConnectionId).Deck;
                    for (int i = 0; i < gameDto.MyCards.Count; i++)
                    {
                        gameDto.MyCards[i].Index = i;
                    }
                    gameDto.Player = gameDto.Players.FirstOrDefault(x => x.Name == player.User.Name);
                    foreach (var dropCards in gameDto.Player.DroppedCards)
                    {
                        for (int i = 0; i < dropCards.Count; i++)
                        {
                            dropCards[i].Index = i;
                        }
                    }
                    
                    gameDto.Players.Remove(gameDto.Players.FirstOrDefault(x => x.Name == player.User.Name));
                    foreach (var opponent in gameDto.Players)
                    {
                        foreach (var dropCards in opponent.DroppedCards)
                        {
                            for (int i = 0; i < dropCards.Count; i++)
                            {
                                dropCards[i].Index = i;
                            }
                        }
                    }
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

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerAskedToKeepCard))
            {
                return;
            }

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerKnocked))
            {
                return;
            }

            // the drop areas of the player are not empty
            if (!player.DroppedCards.All(droppedList => droppedList.Count > 0 && 
                droppedList.All(cards => cards.DisplayName == "empty")))
            {
                if (player.DroppedCards.All(d => d.Count > 0) && !game.DroppedCardsAreCorrect(player))
                {
                    return;
                }

                if (player.DroppedCards.All(d => d.Count > 0) && game.DroppedCardsAreCorrect(player))
                {
                    player.HasDroppedCards = true;
                }
            }
            
            // if it's the last round and the player discard the last one to the discard pile, deny it
            if (game.Round == 8 && 
                player.Deck.Count == 1 && 
                player.Deck[0].DisplayName == card)
            {
                return;
            }

            game.DiscardPile.Add(new Card(card));
            player.Deck.Remove(player.Deck.First(c => c.DisplayName == card));

            if (!game.PlayerWonTheRound(player))
            {
                game.NextTurn();
            }

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

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerKnocked))
            {
                return;
            }

            player.CurrentAllowedMove = MoveType.DropOrDiscardCards;
            game.CheckIfDeckHasEnoughCards();

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
            if (card.DisplayName == "empty")
            {
                return;
            }

            if (card.DisplayName == cardName)
            {
                player.Deck.Add(card);
                game.DiscardPile.Remove(card);

                // if someone knocked then reset it, because the active player has advantage
                foreach (var p in _liverpoolGameService.GetAllPlayersFromGame(gameName))
                {
                    p.FeedbackOnKnock = null;
                    p.PlayerKnocked = false;
                }

                await GameUpdated(gameName);
            }
        }

        public async Task DropCardAtPlayer(string gameName, string cardName, string playerNameToDrop, string dropAreaName)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);
            var playerToDrop = _liverpoolGameService.GetAllPlayersFromGame(gameName).First(p => p.User.Name == playerNameToDrop);

            if (!player.Turn)
            {
                return;
            }

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerAskedToKeepCard))
            {
                return;
            }

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerKnocked))
            {
                return;
            }

            if (player.CurrentAllowedMove != MoveType.DropOrDiscardCards)
            {
                return;
            }

            if (player.User.Name == playerToDrop.User.Name && !player.HasDroppedCards)
            {
                game.DropCardAtOwnArea(player, cardName, dropAreaName);
                // if all cards are dropped, but no cards anymore on the player's hand, next player's turn
                if (player.Deck.Count == 0 && game.Round != 8)
                {
                    if (game.DroppedCardsAreCorrect(player))
                    {
                        player.HasDroppedCards = true;
                        game.NextTurn();
                    }
                }

                if (player.Deck.Count == 0 && game.Round == 8)
                {
                    if (game.DroppedCardsAreCorrect(player) && game.PlayerWonTheRound(player))
                    {
                        game.SetGameFinished();
                    }
                }

                await GameUpdated(gameName);
            }
            else if (game.DropCardAtPlayerArea(player, cardName, playerToDrop, dropAreaName))
            {
                await GameUpdated(gameName);
            }
        }

        public async Task TakeBackPlayersCard(string gameName, string cardName, string index)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);
            var indexOfDroppedCardList = int.Parse(index);

            if (!player.Turn)
            {
                return;
            }

            if (player.CurrentAllowedMove != MoveType.DropOrDiscardCards)
            {
                return;
            }

            if (!player.HasDroppedCards)
            {
                var droppedCards = player.DroppedCards[indexOfDroppedCardList];
                droppedCards.Remove(droppedCards.First(c => c.DisplayName == cardName));

                if (droppedCards.Count == 0)
                {
                    droppedCards.Add(new Card("empty"));
                }
                
                var card = new Card(cardName);
                player.Deck.Add(card);

                await GameUpdated(gameName);
            }
        }

        public async Task SortPlayerCards(string gameName, int oldIndex, int newIndex)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            var cardToMove = player.Deck[oldIndex];
            var newCard = new Card(cardToMove.DisplayName)
            {
                Index = newIndex
            };
            player.Deck.RemoveAll(c => c.Index == oldIndex);
            player.Deck.Insert(newIndex, newCard);

            await GameUpdated(gameName);
        }

        public async Task NextRound(string gameName)
        {
            var game = _liverpoolGameService.GetGame(gameName);

            game.NextRound();

            await GameUpdated(gameName);
        }

        public async Task Knock(string gameName)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            if (player.Turn)
            {
                return;
            }

            // Knocking only allowed if the active player hasn't draw a card
            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Single(p => p.Turn).CurrentAllowedMove == MoveType.DropOrDiscardCards)
            {
                return;
            }

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerAskedToKeepCard))
            {
                return;
            }

            // Knock is only allowed if a card is on the discard pile
            var card = game.DiscardPile.Last();
            if (card.DisplayName == "empty")
            {
                return;
            }

            player.PlayerKnocked = true;
            player.FeedbackOnKnock = false;

            await GameUpdated(gameName);
        }

        public async Task KnockFeedback(string gameName, bool allow)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            player.FeedbackOnKnock = allow;

            var allPlayers = _liverpoolGameService.GetAllPlayersFromGame(gameName).ToList();
            var feedbackMissing = allPlayers.Any(p => p.FeedbackOnKnock == null);
            if (!feedbackMissing)
            {
                var indexOfPlayerInTurn = allPlayers.IndexOf(allPlayers.First(p => p.Turn == true));
                var index = indexOfPlayerInTurn;

                do
                {
                    index++;
                    index %= allPlayers.Count;
                    // if the player knocked or denied the knock from another player, 
                    // then he has to take the card
                    if (allPlayers[index].PlayerKnocked || !allPlayers[index].FeedbackOnKnock.Value)
                    {
                        // take the price for the knock, which is an additional card from draw pile
                        game.CheckIfDeckHasEnoughCards();
                        allPlayers[index].Deck.AddRange(game.Deck.GetAndRemove(0, 1));
                        
                        var card = game.DiscardPile.Last();
                        allPlayers[index].Deck.Add(card);
                        game.DiscardPile.Remove(card);
                        break;
                    }
                } while (index != indexOfPlayerInTurn);

                foreach (var p in _liverpoolGameService.GetAllPlayersFromGame(gameName))
                {
                    p.FeedbackOnKnock = null;
                    p.PlayerKnocked = false;
                }

                await GameUpdated(gameName);
            }
        }

        public async Task AskToKeepCard(string gameName, string card)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            if (!player.Turn)
            {
                return;
            }

            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Any(p => p.PlayerKnocked))
            {
                return;
            }

            // Asking to keep card only allowed if the active player has draw a card
            if (_liverpoolGameService.GetAllPlayersFromGame(gameName).Single(p => p.Turn).CurrentAllowedMove == MoveType.DrawCard)
            {
                return;
            }

            if (!player.DroppedCards.All(droppedList => droppedList.Count > 0 &&
                droppedList.All(cards => cards.DisplayName == "empty")))
            {
                if (player.DroppedCards.All(d => d.Count > 0) && !game.DroppedCardsAreCorrect(player))
                {
                    return;
                }
            }

            player.PlayerAskedToKeepCard = true;
            player.FeedbackOnKeepingCard = true;
            player.Deck.Remove(player.Deck.First(c => c.DisplayName == card));
            game.AskToKeepCardPile.Add(new Card(card));

            await GameUpdated(gameName);
        }

        public async Task KeepCardFeedback(string gameName, bool allow)
        {
            var game = _liverpoolGameService.GetGame(gameName);
            var player = _liverpoolGameService.GetPlayerFromGame(gameName, Context.ConnectionId);

            player.FeedbackOnKeepingCard = allow;

            var allPlayers = _liverpoolGameService.GetAllPlayersFromGame(gameName).ToList();
            var feedbackMissing = allPlayers.Any(p => p.FeedbackOnKeepingCard == null);
            if (!feedbackMissing)
            {
                var indexOfPlayerInTurn = allPlayers.IndexOf(allPlayers.First(p => p.Turn == true));
                var index = indexOfPlayerInTurn;
                var cardTakenByAnotherPlayer = false;

                var playerAfterCurrentPlayerDenied = true;

                do
                {
                    index++;
                    index %= allPlayers.Count;
                    // if a player denied the keep request from another player, 
                    // then he has to take the card
                    if (!allPlayers[index].FeedbackOnKeepingCard.Value)
                    {
                        // take the price for denying it, which is an additional card from draw pile
                        if (!playerAfterCurrentPlayerDenied)
                        {
                            game.CheckIfDeckHasEnoughCards();
                            allPlayers[index].Deck.AddRange(game.Deck.GetAndRemove(0, 1));
                        }

                        var card = game.AskToKeepCardPile.Last();
                        allPlayers[index].Deck.Add(card);
                        game.AskToKeepCardPile.Remove(card);
                        cardTakenByAnotherPlayer = true;
                        break;
                    }

                    playerAfterCurrentPlayerDenied = false;
                } while (index != indexOfPlayerInTurn);

                // if everybody agrees then the player can keep the card
                if (!cardTakenByAnotherPlayer)
                {
                    var card = game.AskToKeepCardPile.Last();
                    allPlayers.First(p => p.Turn && p.PlayerAskedToKeepCard).Deck.Add(card);
                    game.AskToKeepCardPile.Remove(card);
                }

                foreach (var p in _liverpoolGameService.GetAllPlayersFromGame(gameName))
                {
                    p.FeedbackOnKeepingCard = null;
                    p.PlayerAskedToKeepCard = false;
                }

                game.NextTurn();

                await GameUpdated(gameName);
            }
        }
    }
}
