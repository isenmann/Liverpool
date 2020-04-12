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
        IEnumerable<Game> GetAllNotStartedGames();
        bool CreateGame(string name, string connectionId);
        bool JoinGame(string name, string connectionId);
    }
}
