using Liverpool.Interfaces;
using Liverpool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Liverpool.Services
{
    public class LiverpoolGameService : ILiverpoolGameService
    {
        private readonly List<User> _users = new List<User>();
        private readonly List<Game> _currentGames = new List<Game>();

        public bool AddUser(string connectionId)
        {
            var user = _users.FirstOrDefault(p => p.ConnectionId == connectionId);
            if (user == null)
            {
                _users.Add(new User { ConnectionId = connectionId, Name = connectionId });
                return true;
            }

            return false;
        }

        public Game GetGame(string gameName)
        {
            return _currentGames.FirstOrDefault(g => g.Name == gameName);
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _users;
        }

        public IEnumerable<User> GetAllUsersFromGame(string gameName)
        {
            return _currentGames.FirstOrDefault(g => g.Name == gameName).Players.Select(p => p.User);
        }

        public IEnumerable<Player> GetAllPlayersFromGame(string gameName)
        {
            return _currentGames.FirstOrDefault(g => g.Name == gameName).Players;
        }

        public Player GetPlayerFromGame(string gameName, string connectionId)
        {
            return _currentGames.FirstOrDefault(g => g.Name == gameName).Players.FirstOrDefault(p => p.User.ConnectionId == connectionId);
        }

        public string RemoveUser(string connectionId)
        {
            var user = _users.FirstOrDefault(p => p.ConnectionId == connectionId);
            if (user != null)
            {
                _users.Remove(user);
                return user.Name;
            }

            return string.Empty;
        }

        public bool SetUserName(string connectionId, string userName)
        {
            var user = _users.FirstOrDefault(u => u.ConnectionId == connectionId);
            if (user != null)
            {
                while (_users.Any(u => u.Name == userName))
                {
                    Random rnd = new Random();
                    userName += rnd.Next(1, 100);
                }

                user.Name = userName;
                return true;
            }

            return false;
        }

        public IEnumerable<Game> GetAllNotStartedGames()
        {
            return _currentGames.Where(g => !g.GameStarted);
        }

        public bool CreateGame(string name, string connectionId)
        {
            var user = _users.FirstOrDefault(u => u.ConnectionId == connectionId);

            while (_currentGames.Any(g => g.Name == name))
            {
                Random rnd = new Random();
                name += rnd.Next(1, 100);
            }

            var player = new Player(user);

            var game = new Game {
                Name = name,
                Players = new List<Player> { player }, 
                GameStarted = false,
                Deck = DeckCreator.CreateCards().ToList(),
                Creator = player
            };

            _currentGames.Add(game);

            return true;
        }

        public bool JoinGame(string name, string connectionId)
        {
            var user = _users.FirstOrDefault(u => u.ConnectionId == connectionId);
            var game = _currentGames.FirstOrDefault(g => g.Name == name);
            if (game != null && user != null)
            {
                if (game.GameStarted)
                {
                    return false;
                }

                game.Players.Add(new Player(user));
                return true;
            }

            return false;
        }

        public bool StartGame(string name, string connectionId)
        {
            var user = _users.FirstOrDefault(u => u.ConnectionId == connectionId);
            var game = _currentGames.FirstOrDefault(g => g.Name == name);
            if (game != null && user != null)
            {
                if (game.GameStarted)
                {
                    return false;
                }

                return game.StartGame();
            }

            return false;
        }
    }
}
