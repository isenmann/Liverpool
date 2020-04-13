using System.Collections.Generic;

namespace Liverpool
{
    public static class Extensions
    {
        public static void Enqueue(this Queue<Card> cards, Queue<Card> newCards)
        {
            foreach (var card in newCards)
            {
                cards.Enqueue(card);
            }
        }

        public static List<T> GetAndRemove<T>(this List<T> list, int start, int end)
        {
            lock (list)
            {
                List<T> values = list.GetRange(start, end);
                list.RemoveRange(start, end);
                return values;
            }
        }
    }
}
