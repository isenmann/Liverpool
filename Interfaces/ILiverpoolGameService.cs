using Liverpool.Models;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Liverpool.Interfaces
{
    public interface ILiverpoolGameService
    {
        string RemoveUser(string connectionId);
        bool AddUser(string connectionId);
        bool SetUserName(string connectionId, string userName);
        IEnumerable<User> GetAllUsers();
        IEnumerable<User> GetAllUsersFromGame(string gameName);
        IEnumerable<Player> GetAllPlayersFromGame(string gameName);
        IEnumerable<Game> GetAllNotStartedGames();
        bool CreateGame(string name, string connectionId);
        bool JoinGame(string name, string connectionId);
        bool StartGame(string name, string connectionId);
        Game GetGame(string gameName);
    }
}
