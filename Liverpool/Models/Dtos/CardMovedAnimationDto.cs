namespace Liverpool.Models.Dtos;

public class CardMovedAnimationDto
{
    public string PlayerName { get; set; }
    public string FromArea   { get; set; }  // "hand:{playerName}" | "drawPile" | "discardPile"
    public string ToArea     { get; set; }  // "hand:{playerName}" | "discardPile" | "dropZone:{playerName}:{listIndex}"
    public string CardName   { get; set; }  // null when opponent draws from draw pile (face-down)
}
