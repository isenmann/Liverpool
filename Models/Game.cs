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
        public List<Card> DiscardPile { get; set; }
        public bool GameStarted { get; set; }
        public Player Creator { get; set; }

        public bool StartGame()
        {
            if (Players.Count < 3)
            {
                return false;
            }

            GameStarted = true;

            InitializeNewGame();

            return true;
        }

        private void InitializeNewGame()
        {
            foreach (var player in Players)
            {
                player.Deck = Deck.GetAndRemove(0, 10);
                player.DroppedCards = new List<Card>();
            }

            DiscardPile = new List<Card>();
        }
    }
}
