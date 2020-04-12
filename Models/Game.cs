using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Liverpool.Models
{
    public class Game
    {
        public string Name { get; set; }
        public List<Player> Players { get; set; }
        public List<Card> Deck { get; set; }
        public bool GameStarted { get; set; }

        public bool StartGame()
        {
            GameStarted = true;
            return true;
        }
    }
}
