using System;

namespace Liverpool
{
    public class Card
    {
        public string DisplayName { get; set; }
        public Suit Suit { get; set; }
        public int Value { get; set; }
        public Card(string displayName)
        {
            string value = displayName.Substring(0, 1);
            string suitCharacter = displayName.Substring(1, 1);

            foreach (Suit suit in Enum.GetValues(typeof(Suit)))
            {
                if (Enum.GetName(typeof(Suit), suit).StartsWith(suitCharacter))
                {
                    Suit = suit;
                    break;
                }
            }

            if (value == "J")
            {
                Value = 11;
            }
            else if (value == "Q")
            {
                Value = 12;
            }
            else if (value == "K")
            {
                Value = 13;
            }
            else if (value == "A")
            {
                Value = 1;
            }
            else
            {
                if (int.TryParse(value, out int cardValue))
                {
                    Value = cardValue;
                }
            }

            DisplayName = displayName;
        }

        public Card() { }
    }
}
