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

        //private static List<Game> _currentGames = new List<Game>();

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

        public IEnumerable<User> GetAllUsers()
        {
            return _users;
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
    }
}
