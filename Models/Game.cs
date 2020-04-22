using System;
using System.Collections.Generic;
using System.Linq;

namespace Liverpool.Models
{
    public class Game
    {
        public string Name { get; set; }
        public List<Player> Players { get; set; }
        public List<Card> Deck { get; set; }
        public List<Card> DiscardPile { get; set; }
        public bool GameStarted { get; set; }
        public bool GameFinished { get; set; }
        public Player Creator { get; set; }
        public int Round { get; set; }
        public int StartPlayer { get; set; }
        
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

            Random rnd = new Random();
            StartPlayer = rnd.Next(0, Players.Count);

            Players[StartPlayer].Turn = true;

            DiscardPile = new List<Card>();
            DiscardPile.AddRange(Deck.GetAndRemove(0, 1));
            Round = 1;
        }

        public void NextRound()
        {
            if (Round == 8)
            {
                GameFinished = true;
                foreach (var player in Players)
                {
                    foreach (var card in player.Deck)
                    {
                        player.Points += card.Value;
                    }
                }
                return;
            }

            Round++;
            StartPlayer++;
            if (StartPlayer >= Players.Count)
            {
                StartPlayer = 0;
            }
            Deck = DeckCreator.CreateCards().ToList();

            foreach (var player in Players)
            {
                foreach (var card in player.Deck)
                {
                    player.Points += card.Value;
                }

                if (Round <= 5)
                {
                    player.Deck = Deck.GetAndRemove(0, 10);
                }
                else if (Round == 6)
                {
                    player.Deck = Deck.GetAndRemove(0, 11);
                }
                else if (Round == 7)
                {
                    player.Deck = Deck.GetAndRemove(0, 12);
                }
                else if (Round == 8)
                {
                    player.Deck = Deck.GetAndRemove(0, 13);
                }
                player.DroppedCards = new List<Card>();
                player.Turn = false;
            }

            Players[StartPlayer].Turn = true;
            DiscardPile = new List<Card>();
            DiscardPile.AddRange(Deck.GetAndRemove(0, 1));
        }
    }
}
