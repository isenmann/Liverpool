using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
