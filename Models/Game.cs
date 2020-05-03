﻿using System;
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
        public List<Card> AskToKeepCardPile { get; set; }
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
                player.DroppedCards = new List<List<Card>>
                {
                    new List<Card>
                {
                    new Card("empty")
                },
                    new List<Card>
                {
                    new Card("empty")
                }
                };
            }

            Random rnd = new Random();
            StartPlayer = rnd.Next(0, Players.Count);

            Players[StartPlayer].Turn = true;

            DiscardPile = new List<Card>
            {
                new Card("empty")
            };
            DiscardPile.AddRange(Deck.GetAndRemove(0, 1));

            AskToKeepCardPile = new List<Card>
            {
                new Card("empty")
            };

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

                player.DroppedCards.Clear();

                if (Round == 2)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 10);
                }
                if (Round == 3)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 10);
                }
                if (Round == 4)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 10);
                }
                if (Round == 5)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 10);
                }
                if (Round == 6)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 11);
                }
                if (Round == 7)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 12);
                }
                if (Round == 8)
                {
                    player.DroppedCards = new List<List<Card>>
                    {
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    },
                        new List<Card>
                    {
                        new Card("empty")
                    }
                    };
                    player.Deck = Deck.GetAndRemove(0, 13);
                }

                for (int i = 0; i < player.Deck.Count; i++)
                {
                    player.Deck[i].Index = i;
                }

                player.Turn = false;
                player.CurrentAllowedMove = MoveType.DrawCard;
                player.PlayerAskedToKeepCard = false;
                player.FeedbackOnKeepingCard = null;
                player.PlayerKnocked = false;
                player.FeedbackOnKnock = null;
            }

            Players[StartPlayer].Turn = true;
            DiscardPile = new List<Card>
            {
                new Card("empty")
            };
            AskToKeepCardPile = new List<Card>
            {
                new Card("empty")
            };
            DiscardPile.AddRange(Deck.GetAndRemove(0, 1));
            RoundFinished = false;
        }

        //public bool CheckPlayersDropForRoundEight(Player player)
        //{
        //    if (Round != 8)
        //    {
        //        return false;
        //    }

        //    var setsAvailable = NumberOfSetsAvailable(player.Deck);
        //    var runsAvailable = NumberOfRunsAvailable(player.Deck);
        //    if (setsAvailable != 3)
        //    {
        //        return false;
        //    }

        //    if (runsAvailable != 1)
        //    {
        //        return false;
        //    }

        //    if (runsAvailable + setsAvailable != player.Deck.Count)
        //    {
        //        return false;
        //    }

        //    return true;
        //}

        internal bool DroppedCardsAreCorrect(Player player)
        {
            // SETS: Books of 3 or more cards sharing the same rank, i.e., 8♥ 8♣ 8♠.
            // RUNS: 4 or more cards of the same suit in sequence, i.e., 3♥ 4♥ 5♥ 6♥.
            if (Round == 1)
            {
                // First - 2 sets
                if (CheckIfDeckIsSet(player.DroppedCards[0]))
                {
                    return CheckIfDeckIsSet(player.DroppedCards[1]);
                }

                return false;
            }

            if (Round == 2)
            {
                // Second - 1 set & 1 run
                var isSet = CheckIfDeckIsSet(player.DroppedCards[0]);
                isSet |= CheckIfDeckIsSet(player.DroppedCards[1]);

                if (isSet)
                {
                    var isRun = CheckIfDeckIsRun(player.DroppedCards[0]);
                    isRun |= CheckIfDeckIsRun(player.DroppedCards[1]);

                    return isRun;
                }

                return false;
            }

            if (Round == 3)
            {
                // Third - 2 runs
                if (CheckIfDeckIsRun(player.DroppedCards[0]))
                {
                    return CheckIfDeckIsRun(player.DroppedCards[1]);
                }

                return false;
            }

            if (Round == 4)
            {
                // Fourth - 3 sets
                if (CheckIfDeckIsSet(player.DroppedCards[0]) &&
                    CheckIfDeckIsSet(player.DroppedCards[1]) &&
                    CheckIfDeckIsSet(player.DroppedCards[2]))
                {
                    return true;
                }

                return false;
            }

            if (Round == 5)
            {
                // Fifth - 2 sets & 1 run
                var isRun = CheckIfDeckIsRun(player.DroppedCards[0]);
                isRun |= CheckIfDeckIsRun(player.DroppedCards[1]);
                isRun |= CheckIfDeckIsRun(player.DroppedCards[2]);

                if (isRun)
                {
                    int count = 0;
                    foreach (var cards in player.DroppedCards)
                    {
                        if (CheckIfDeckIsSet(cards))
                        {
                            count++;
                        }
                    }

                    if (count == 2)
                    {
                        return true;
                    }
                }

                return false;
            }

            if (Round == 6)
            {
                // Sixth - 1 set & 2 runs
                var isSet = CheckIfDeckIsSet(player.DroppedCards[0]);
                isSet |= CheckIfDeckIsSet(player.DroppedCards[1]);
                isSet |= CheckIfDeckIsSet(player.DroppedCards[2]);

                if (isSet)
                {
                    int count = 0;
                    foreach (var cards in player.DroppedCards)
                    {
                        if (CheckIfDeckIsRun(cards))
                        {
                            count++;
                        }
                    }

                    if (count == 2)
                    {
                        return true;
                    }
                }

                return false;
            }

            if (Round == 7)
            {
                // Seventh - 3 runs
                if (CheckIfDeckIsRun(player.DroppedCards[0]) &&
                    CheckIfDeckIsRun(player.DroppedCards[1]) &&
                    CheckIfDeckIsSet(player.DroppedCards[2]))
                {
                    return true;
                }

                return false;
            }

            if (Round == 8)
            {
                // Eight - 3 sets & 1 run with no remaining cards in hand, no final discard
                var isRun = CheckIfDeckIsRun(player.DroppedCards[0]);
                isRun |= CheckIfDeckIsRun(player.DroppedCards[1]);
                isRun |= CheckIfDeckIsRun(player.DroppedCards[2]);
                isRun |= CheckIfDeckIsRun(player.DroppedCards[3]);

                if (isRun)
                {
                    int count = 0;
                    foreach (var cards in player.DroppedCards)
                    {
                        if (CheckIfDeckIsSet(cards))
                        {
                            count++;
                        }
                    }

                    if (count == 3)
                    {
                        return true;
                    }
                }

                return false;
            }

            return false;
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

        internal bool DropCardAtPlayerArea(Player player, string cardName, Player playerToDrop, string dropAreaName)
        {
            // no own dropped cards and want to drop at another player, deny it
            if (player.User.ConnectionId != playerToDrop.User.ConnectionId && player.DroppedCards.Any(droppedList => droppedList.Any(card => card.DisplayName == "empty")))
            {
                return false;
            }

            // find list index in dropAreaName
            var listIndex = int.Parse(dropAreaName.Substring(dropAreaName.Length - 1));

            // not allowed to drop at another player if there is no dropped card already 
            if (player.User.ConnectionId != playerToDrop.User.ConnectionId && playerToDrop.DroppedCards[listIndex].Any(c => c.DisplayName == "empty"))
            {
                return false;
            }

            var card = new Card(cardName);
            var isRun = false;
            var isSet = false;

            // if there are already dropped cards
            if (!playerToDrop.DroppedCards[listIndex].Any(c => c.DisplayName == "empty") &&
                playerToDrop.DroppedCards[listIndex].Count() > 0)
            {
                // check if the card match the run or set
                isSet = CheckIfDeckIsSetAfterAddingCard(card, playerToDrop.DroppedCards[listIndex]);
                isRun = CheckIfDeckIsRunAfterAddingCard(card, playerToDrop.DroppedCards[listIndex]);
                if (isSet || isRun)
                {
                    // if yes, add it and remove it from player's deck
                    playerToDrop.DroppedCards[listIndex].Add(card);
                    player.Deck.Remove(player.Deck.Find(c => c.DisplayName == card.DisplayName));
                }
            }
            else
            {
                playerToDrop.DroppedCards[listIndex].Add(card);
                playerToDrop.DroppedCards[listIndex].RemoveAll(c => c.DisplayName == "empty");
                player.Deck.Remove(player.Deck.Find(c => c.DisplayName == card.DisplayName));
            }

            return isRun || isSet;
        }

        internal void DropCardAtOwnArea(Player player, string cardName, string dropAreaName)
        {
            // find list index in dropAreaName
            var listIndex = int.Parse(dropAreaName.Substring(dropAreaName.Length - 1));
            var card = new Card(cardName);

            player.DroppedCards[listIndex].Add(card);
            player.DroppedCards[listIndex].RemoveAll(c => c.DisplayName == "empty");
            player.Deck.Remove(player.Deck.Find(c => c.DisplayName == card.DisplayName));
        }

        private bool CheckIfDeckIsSet(List<Card> set)
        {
            // deck is not a set
            if (set.Count < 3)
            {
                return false;
            }

            if (!set.All(c => c.Value == set.First().Value))
            {
                return false;
            }

            return true;
        }

        private bool CheckIfDeckIsRun(List<Card> run)
        {
            // deck itself is not a run because there are more than one suit available
            var deck = run.GroupBy(suit => suit.Suit).Select(element => element.ToList());
            if (deck.Count() == 0 || deck.Count() > 1)
            {
                return false;
            }

            // there must be only one suit available with more than or equal to 4 cards of a suit
            deck = run.GroupBy(suit => suit.Suit).Where(c => c.Count() >= 4).Select(element => element.ToList());
            if (deck.Count() != 1)
            {
                return false;
            }

            // look how many consecutive lists are available (only one should be available 
            // or two if there is an "overflow" from King to Ace
            var consecutiveDecks = deck.ToList()[0].OrderBy(c => c.Value).GroupConsecutive().ToList();
            if (consecutiveDecks.Count > 2)
            {
                return false;
            }

            // check if it is an "overflow" from King to Ace, if not return false
            if (consecutiveDecks.Count == 2 && (consecutiveDecks.First().First().Value != 1 || consecutiveDecks.Last().Last().Value != 13))
            {
                return false;
            }

            return true;
        }

        private bool CheckIfDeckIsSetAfterAddingCard(Card card, List<Card> sets)
        {
            // deck itself is not a set
            if (!CheckIfDeckIsSet(sets))
            {
                return false;
            }

            // add card to the set
            var deckToTest = new List<Card>(sets)
            {
                card
            };

            return CheckIfDeckIsSet(deckToTest);
        }

        private bool CheckIfDeckIsRunAfterAddingCard(Card card, List<Card> runs)
        {
            if (!CheckIfDeckIsRun(runs))
            {
                return false;
            }

            // add card to the run
            var deckToTest = new List<Card>(runs)
            {
                card
            };

            return CheckIfDeckIsRun(deckToTest);
        }
    }
}
