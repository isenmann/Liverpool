using Liverpool.Models;
using System.Collections.Generic;

namespace Liverpool
{
    public class Player
    {
        public User User { get; set; }
        public List<Card> Deck { get; set; }
        public List<Card> DroppedCards { get; set; }
        public int Points { get; set; }
        public bool Turn { get; set; }
        public MoveType CurrentAllowedMove { get; set; } = MoveType.DrawCard;
        public bool PlayerKnocked { get; set; }
        public bool? FeedbackOnKnock { get; set; }
        public bool? FeedbackOnKeepingCard { get; set; }
        public bool PlayerAskedToKeepCard { get; set; }
        public Player(User user)
        {
            User = user;
        }
    }
}
