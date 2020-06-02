using Liverpool.Interfaces;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Liverpool.BackgroundServices
{
    public class CleanupGamesBackgroundService : BackgroundService, ICleanupGamesBackgroundService
    {
        private readonly ILiverpoolGameService _liverpoolGameService;

        public CleanupGamesBackgroundService(ILiverpoolGameService liverpoolGameService)
        {
            _liverpoolGameService = liverpoolGameService ?? throw new ArgumentNullException(nameof(liverpoolGameService));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var gamesToDelete = _liverpoolGameService.GetAllGames().Where(g => g.GameFinished || g.Players.Count == 0).ToList();
                foreach (var game in gamesToDelete)
                {
                    _liverpoolGameService.DeleteGame(game.Name);
                }

                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }
    }
}
