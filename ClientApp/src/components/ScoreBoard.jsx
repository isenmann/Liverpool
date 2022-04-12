import React from 'react';
import {FormattedMessage} from "react-intl";

function ScoreBoard({playersRanked}) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col"><FormattedMessage id="game.name" /></th>
                <th scope="col"><FormattedMessage id="game.points" /></th>
            </tr>
            </thead>
            <tbody>
            {playersRanked.map((player) => (
                <tr key={player.name + "Ranked"}>
                    <td>{player.name}</td>
                    <td>{player.points}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ScoreBoard;