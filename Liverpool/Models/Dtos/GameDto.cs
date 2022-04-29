using System.Collections.Generic;

namespace Liverpool.Models.Dtos
{
    public class GameDto
    {
        public string Name { get; set; }
        public bool GameStarted { get; set; } = false;
        public List<PlayerDto> Players { get; set; }
        public List<PlayerRankedDto> PlayersRanked { get; set; }
        public PlayerDto Player { get; set; }
        public List<Card> MyCards { get; internal set; }
        public Card DiscardPile { get; internal set; }
        public bool RoundFinished { get; internal set; }
        public string Mantra { get; set; }
        public int Round { get; internal set; }
        public List<string> PlayersKnocked { get; set; }
        public bool GameFinished { get; internal set; }
        public bool PlayerAskedForKeepingCard { get; set; }
        public Card KeepingCard { get; set; }
    }
}
