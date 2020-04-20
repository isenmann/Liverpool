﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Liverpool.Models.Dtos
{
    public class PlayerDto
    {
        public string Name { get; set; }
        public int CountofCards { get; set; }
        public List<Card> DroppedCards { get; set; }
        public int Points { get; set; }
    }
}
