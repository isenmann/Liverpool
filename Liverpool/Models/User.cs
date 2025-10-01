namespace Liverpool.Models;

public class User
{
    public User()
    {
    }

    public User(string name, string connectionId)
    {
        Name = name;
        ConnectionId = connectionId;
    }

    public string ConnectionId { get; set; }
    public string Name { get; set; }
}