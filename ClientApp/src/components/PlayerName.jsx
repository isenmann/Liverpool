import React from 'react';

function PlayerName({ player }) {
    return (
        <div className="text-center">
            {player.playersTurn === true &&
                <b style={{backgroundColor: 'green'}}>{player.name}</b>
            }
            {player.playersTurn === false &&
                player.name
            }
        </div>
    )
}

export default PlayerName;