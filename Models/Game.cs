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

        public void NextTurn()
        {
            var index = Players.IndexOf(Players.First(p => p.Turn == true));
            index++;
            if (index >= Players.Count)
            {
                index = 0;
            }

            Players.ForEach(p => p.Turn = false);
            Players.ForEach(p => p.CurrentAllowedMove = MoveType.DrawCard);
            Players[index].Turn = true;
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

        public bool CheckDroppedCards(User user)
        {
            // SETS: Books of 3 or more cards sharing the same rank, i.e., 8♥ 8♣ 8♠.
            // RUNS: 4 or more cards of the same suit in sequence, i.e., 3♥ 4♥ 5♥ 6♥.
            var player = Players.Where(p => p.User.ConnectionId == user.ConnectionId).Single();
            if (player == null)
            {
                return false;
            }

            if (Round == 1)
            {
                // First - 2 sets
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                return setsAvailable >= 2;
            }
            else if (Round == 2)
            {
                // Second - 1 set & 1 run
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 1)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                return runsAvailable >= 1;
            }
            else if (Round == 3)
            {
                // Third - 2 runs
                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                return runsAvailable >= 2;
            }
            else if (Round == 4)
            {
                // Fourth - 3 sets
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                return setsAvailable >= 3;
            }
            else if (Round == 5)
            {
                // Fifth - 2 sets & 1 run
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 2)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                return runsAvailable >= 1;
            }
            else if (Round == 6)
            {
                // Sixth - 1 set & 2 runs
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 1)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                return runsAvailable >= 2;
            }
            else if (Round == 7)
            {
                // Seventh - 3 runs
                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                return runsAvailable >= 3;
            }
            else if (Round == 8)
            {
                // Eight - 3 sets & 1 run with no remaining cards in hand, no final discard
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 3)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                return runsAvailable >= 1;
            }

            return false;
        }

        private int NumberOfSetsAvailable(List<Card> deck)
        {
            var allSetsInDeck = deck.GroupBy(v => v.Value).Where(c => c.Count() >= 3).Select(g => new Tuple<int, int>(g.Key, g.Count()));
            var numberOfDoubleSets = allSetsInDeck.Where(t => t.Item2 >= 6).Count();

            return allSetsInDeck.Count() + numberOfDoubleSets;
        }

        private int NumberOfRunsAvailable(List<Card> deck)
        {
            var numberOfRuns = 0;
            var allPossibleRunsInDeck = deck.GroupBy(suit => suit.Suit).Where(c => c.Count() >= 4).Select(element => element.ToList()).ToList();

            foreach (var possibleRun in allPossibleRunsInDeck)
            {
                var isRun = possibleRun.OrderBy(c => c.Value).Zip(possibleRun.Skip(1), (l, r) => l.Value + 1 == r.Value).All(t => t);
                if (isRun) 
                {
                    numberOfRuns++;
                }
            }

            return numberOfRuns;
        }
    }
}
