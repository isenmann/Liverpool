using Liverpool.Models;
using System.Collections.Generic;

namespace Liverpool.Interfaces
{
    public interface ILiverpoolGameService
    {
        string RemoveUser(string connectionId);
        bool AddUser(string connectionId);
        bool ReconnectUser(string connectionId, string userName);
        bool SetUserName(string connectionId, string userName);
        IEnumerable<User> GetAllUsers();
        IEnumerable<User> GetAllUsersFromGame(string name);
        IEnumerable<Player> GetAllPlayersFromGame(string name);
        Player GetPlayerFromGame(string name, string connectionId);
        IEnumerable<Game> GetAllNotStartedGames();
        bool CreateGame(string name, string connectionId);
        bool JoinGame(string name, string connectionId);
        bool StartGame(string name, string connectionId);
        Game GetGame(string gameName);
        IEnumerable<Game> GetAllGames();
        void DeleteGame(string gameName);
    }
}
