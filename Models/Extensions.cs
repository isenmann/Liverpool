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

        public static IEnumerable<IEnumerable<Card>> GroupConsecutive(this IEnumerable<Card> list)
        {
            var group = new List<Card>();
            foreach (var card in list)
            {
                if (group.Count == 0 || card.Value - group[group.Count - 1].Value <= 1)
                {
                    group.Add(card);
                }
                else
                {
                    yield return group;
                    group = new List<Card> { card };
                }
            }
            yield return group;
        }
    }
}
