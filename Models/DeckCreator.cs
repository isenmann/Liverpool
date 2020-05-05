using System;
using System.Collections.Generic;
using System.Linq;

namespace Liverpool
{
    public class DeckCreator
    {
        public static List<Card> CreateCards()
        {
            List<Card> cards = new List<Card>();
            for (int i = 1; i <= 13; i++)
            {
                foreach (Suit suit in Enum.GetValues(typeof(Suit)))
                {
                    cards.Add(new Card()
                    {
                        Suit = suit,
                        Value = i,
                        DisplayName = GetShortName(i, suit)
                    });
                }

                foreach (Suit suit in Enum.GetValues(typeof(Suit)))
                {
                    cards.Add(new Card()
                    {
                        Suit = suit,
                        Value = i,
                        DisplayName = GetShortName(i, suit)
                    });
                }
            }
            return Shuffle(cards);
        }

        public static List<Card> Shuffle(List<Card> cards)
        {
            //Shuffle the existing cards using Fisher-Yates Modern
            Random r = new Random(DateTime.Now.Millisecond);
            for (int n = cards.Count - 1; n > 0; --n)
            {
                //Step 2: Randomly pick a card which has not been shuffled
                int k = r.Next(n + 1);

                //Step 3: Swap the selected item with the last "unselected" card in the collection
                Card temp = cards[n];
                cards[n] = cards[k];
                cards[k] = temp;
            }

            return new List<Card>(cards);
        }

        private static string GetShortName(int value, Suit suit)
        {
            string valueDisplay = "";
            if (value >= 2 && value <= 10)
            {
                valueDisplay = value.ToString();
            }
            else if (value == 11)
            {
                valueDisplay = "J";
            }
            else if (value == 12)
            {
                valueDisplay = "Q";
            }
            else if (value == 13)
            {
                valueDisplay = "K";
            }
            else if (value == 1)
            {
                valueDisplay = "A";
            }

            return valueDisplay + Enum.GetName(typeof(Suit), suit)[0];
        }
    }
}
