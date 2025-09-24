using System.Collections.Generic;
using JetBrains.Annotations;

namespace Liverpool.Models.Dtos;

[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class PlayerDto
{
    public string Name { get; set; }
    public int CountofCards { get; set; }
    public List<List<Card>> DroppedCards { get; set; }
    public int Points { get; set; }
    public bool PlayersTurn { get; set; }
    public int Position { get; internal set; }
}

public class PlayerRankedDto
{
    public string Name { get; set; }
    public int Points { get; set; }
}