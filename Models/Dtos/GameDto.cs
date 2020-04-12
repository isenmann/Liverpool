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
        public List<string> Players { get; set; }
    }
}
