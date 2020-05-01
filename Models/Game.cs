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
        public bool RoundFinished { get; set; }
        public string Mantra
        {
            get
            {
                if (Round == 1)
                {
                    return "2 Pässe";
                }
                if (Round == 2)
                {
                    return "1 Pass, 1 Straße";
                }
                if (Round == 3)
                {
                    return "2 Straßen";
                }
                if (Round == 4)
                {
                    return "3 Pässe";
                }
                if (Round == 5)
                {
                    return "2 Pässe, 1 Straße";
                }
                if (Round == 6)
                {
                    return "1 Pass, 2 Straßen";
                }
                if (Round == 7)
                {
                    return "3 Straßen";
                }
                if (Round == 8)
                {
                    return "3 Pässe, 1 Straße";
                }

                return string.Empty;
            }
        }

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
                for (int i = 0; i < player.Deck.Count; i++)
                {
                    player.Deck[i].Index = i;
                }
                player.DroppedCards = new List<Card>();
            }

            Random rnd = new Random();
            StartPlayer = rnd.Next(0, Players.Count);

            Players[StartPlayer].Turn = true;

            DiscardPile = new List<Card>
            {
                new Card("empty")
            };
            DiscardPile.AddRange(Deck.GetAndRemove(0, 1));
            Round = 1;
        }

        internal void SetGameFinished()
        {
            GameFinished = true;
            foreach (var player in Players)
            {
                foreach (var card in player.Deck)
                {
                    player.Points += card.Value;
                }
            }
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
            //if (Round == 8)
            //{
            //    GameFinished = true;
            //    foreach (var player in Players)
            //    {
            //        foreach (var card in player.Deck)
            //        {
            //            player.Points += card.Value;
            //        }
            //    }
            //    return;
            //}

            Round++;
            StartPlayer++;
            if (StartPlayer >= Players.Count)
            {
                StartPlayer = 0;
            }
            Deck = DeckCreator.CreateCards().ToList();

            // if the player is the only one who dropped his cards, he gets -50 points
            var playerWhoWonRound = Players.FirstOrDefault(p => p.Deck.Count == 0);
            if (Players.Count(p => p.DroppedCards.Count > 0) == 1)
            {
                playerWhoWonRound.Points -= 50;
            }

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

                for (int i = 0; i < player.Deck.Count; i++)
                {
                    player.Deck[i].Index = i;
                }

                player.DroppedCards = new List<Card>();
                player.Turn = false;
                player.CurrentAllowedMove = MoveType.DrawCard;
            }

            Players[StartPlayer].Turn = true;
            DiscardPile = new List<Card>
            {
                new Card("empty")
            };
            DiscardPile.AddRange(Deck.GetAndRemove(0, 1));
            RoundFinished = false;
        }

        private bool DropCards(Player player)
        {
            // SETS: Books of 3 or more cards sharing the same rank, i.e., 8♥ 8♣ 8♠.
            // RUNS: 4 or more cards of the same suit in sequence, i.e., 3♥ 4♥ 5♥ 6♥.
            if (Round == 1)
            {
                // First - 2 sets
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable >= 2)
                {
                    return DropSets(player, 2);
                }

                return false;
            }

            if (Round == 2)
            {
                // Second - 1 set & 1 run
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 1)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                if (runsAvailable >= 1)
                {
                    DropSets(player, 1);
                    return DropRuns(player, 1);
                }

                return false;
            }

            if (Round == 3)
            {
                // Third - 2 runs
                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                if (runsAvailable >= 2)
                {
                    return DropRuns(player, 2);
                }

                return false;
            }

            if (Round == 4)
            {
                // Fourth - 3 sets
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable >= 3)
                {
                    return DropSets(player, 3);
                }

                return false;
            }

            if (Round == 5)
            {
                // Fifth - 2 sets & 1 run
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 2)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                if (runsAvailable >= 1)
                {
                    DropSets(player, 2);
                    return DropRuns(player, 1);
                }

                return false;
            }

            if (Round == 6)
            {
                // Sixth - 1 set & 2 runs
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 1)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                if (runsAvailable >= 2)
                {
                    DropSets(player, 1);
                    return DropRuns(player, 2);
                }

                return false;
            }

            if (Round == 7)
            {
                // Seventh - 3 runs
                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                if (runsAvailable >= 3)
                {
                    return DropRuns(player, 3);
                }

                return false;
            }

            if (Round == 8)
            {
                // Eight - 3 sets & 1 run with no remaining cards in hand, no final discard
                var setsAvailable = NumberOfSetsAvailable(player.Deck);
                if (setsAvailable < 3)
                {
                    return false;
                }

                var runsAvailable = NumberOfRunsAvailable(player.Deck);
                if (runsAvailable >= 1)
                {
                    DropSets(player, 3);
                    return DropRuns(player, 1);
                }

                return false;
            }

            return false;
        }

        public bool CheckPlayersDropForRoundEight(Player player)
        {
            if (Round != 8)
            {
                return false;
            }

            var setsAvailable = NumberOfSetsAvailable(player.Deck);
            var runsAvailable = NumberOfRunsAvailable(player.Deck);
            if (setsAvailable != 3)
            {
                return false;
            }

            if (runsAvailable != 1)
            {
                return false;
            }

            if (runsAvailable + setsAvailable != player.Deck.Count)
            {
                return false;
            }

            return true;
        }

        internal bool PlayerWonTheRound(Player player)
        {
            if (player.Deck.Count == 0 &&
                player.DroppedCards.Count > 0)
            {
                RoundFinished = true;
            }
            else
            {
                RoundFinished = false;
            }

            return RoundFinished;
        }

        private bool DropRuns(Player player, int numberOfRunsToDrop)
        {
            var allPossibleRunsInDeck = player.Deck.GroupBy(suit => suit.Suit).Where(c => c.Count() >= 4).Select(element => element.ToList()).OrderByDescending(r => r.Count).ToList();
            var allRunsInDeck = new List<List<Card>>();

            foreach (var possibleRun in allPossibleRunsInDeck)
            {
                var isRun = possibleRun.OrderBy(c => c.Value).Zip(possibleRun.Skip(1), (l, r) => l.Value + 1 == r.Value).All(t => t);
                if (isRun)
                {
                    allRunsInDeck.Add(new List<Card>(possibleRun.OrderBy(v => v.Value)));
                }
            }

            if (allRunsInDeck.Count >= numberOfRunsToDrop)
            {
                for (var i = 0; i < numberOfRunsToDrop; i++)
                {
                    player.DroppedCards.AddRange(allRunsInDeck[i]);
                    player.Deck.RemoveAll(c => allRunsInDeck[i].Contains(c));
                }

                return true;
            }

            return false;
        }

        private bool DropSets(Player player, int numberOfSetsToDrop)
        {
            var allSetsInDeck = player.Deck.GroupBy(v => v.Value).Where(c => c.Count() >= 3).Select(element => element.ToList()).OrderByDescending(s => s.Count).ToList();
            if (allSetsInDeck.Count == 1 && allSetsInDeck[0].Count >= 6 && numberOfSetsToDrop == 2)
            {
                 player.DroppedCards.AddRange(player.Deck.Where(c => allSetsInDeck[0].Contains(c)));
                 player.Deck.RemoveAll(c => allSetsInDeck[0].Contains(c));

                 return true;
            }

            if (allSetsInDeck.Count >= numberOfSetsToDrop)
            {
                for (var i = 0; i < numberOfSetsToDrop; i++)
                {
                    player.DroppedCards.AddRange(allSetsInDeck[i]);
                    player.Deck.RemoveAll(c => allSetsInDeck[i].Contains(c));
                }

                return true;
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

        internal bool DropCardAtPlayerArea(Player player, string cardName, Player playerToDrop)
        {
            if (player.DroppedCards.Count == 0)
            {
                return false;
            }

            var card = new Card(cardName);

            var possibleToSet = AddCardToSet(card, playerToDrop.DroppedCards);
            var possibleToRun = AddCardToRow(card, playerToDrop.DroppedCards);

            if (possibleToSet || possibleToRun)
            {
                player.Deck.Remove(player.Deck.Find(c => c.DisplayName == card.DisplayName));
            }

            return possibleToRun || possibleToSet;
        }

        private bool AddCardToSet(Card card, List<Card> sets)
        {
            var originalDeck = sets.GroupBy(v => v.Value).Where(c => c.Count() >= 3).Select(element => element.ToList()).OrderByDescending(s => s.Count).ToList();
            var deckToTest = new List<Card>(sets)
            {
                card
            };

            var allSetsInDeckToTest = deckToTest.GroupBy(v => v.Value).Where(c => c.Count() >= 3).Select(element => element.ToList()).OrderByDescending(s => s.Count).ToList();

            if (originalDeck.Count != allSetsInDeckToTest.Count)
            {
                return false;
            }

            var possible = false;

            for (int i = 0; i < originalDeck.Count; i++)
            {
                if (originalDeck[i].Count != allSetsInDeckToTest[i].Count)
                {
                    possible = true;
                }
            }

            if (possible)
            {
                sets.Clear();
                foreach (var cards in allSetsInDeckToTest)
                {
                    sets.AddRange(cards);
                }
            }

            return possible;
        }

        private bool AddCardToRow(Card card, List<Card> runs)
        {
            var originalDeck = runs.GroupBy(suit => suit.Suit).Where(c => c.Count() >= 4).Select(element => element.ToList()).OrderByDescending(r => r.Count).ToList();
            var allRunsInOriginalDeck = new List<List<Card>>();

            foreach (var possibleRun in originalDeck)
            {
                var isRun = possibleRun.OrderBy(c => c.Value).Zip(possibleRun.Skip(1), (l, r) => l.Value + 1 == r.Value).All(t => t);
                if (isRun)
                {
                    allRunsInOriginalDeck.Add(new List<Card>(possibleRun.OrderBy(v => v.Value)));
                }
            }

            var deckToTest = new List<Card>(runs)
            {
                card
            };

            var testDeck = deckToTest.GroupBy(suit => suit.Suit).Where(c => c.Count() >= 4).Select(element => element.ToList()).OrderByDescending(r => r.Count).ToList();
            var allRunsInTestDeck = new List<List<Card>>();

            foreach (var possibleRun in testDeck)
            {
                var isRun = possibleRun.OrderBy(c => c.Value).Zip(possibleRun.Skip(1), (l, r) => l.Value + 1 == r.Value).All(t => t);
                if (isRun)
                {
                    allRunsInTestDeck.Add(new List<Card>(possibleRun.OrderBy(v => v.Value)));
                }
            }

            if (allRunsInOriginalDeck.Count != allRunsInTestDeck.Count)
            {
                return false;
            }

            var possible = false;

            for (int i = 0; i < allRunsInOriginalDeck.Count; i++)
            {
                if (allRunsInOriginalDeck[i].Count != allRunsInTestDeck[i].Count)
                {
                    possible = true;
                }
            }

            if (possible)
            {
                runs.Clear();
                foreach (var cards in allRunsInTestDeck)
                {
                    runs.AddRange(cards);
                }
            }

            return possible;
        }

        public bool DropValidCards(Player player)
        {
            return DropCards(player);
        }
    }
}
