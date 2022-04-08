import React, {Fragment} from 'react';
import {FormattedMessage} from "react-intl";

function PlayerKnock ({playersKnocked, playersTurn, sendPositiveKnockFunction, sendNegativeKnockFunction}) {
    return (
        <Fragment>
            <div className="d-flex bg-danger justify-content-center">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col"><FormattedMessage id="game.knocked" /></th>
                    </tr>
                    </thead>
                    <tbody>
                    {playersKnocked.map((player) => (
                        <tr key={player + "knockTable"}>
                            <td>{player}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={sendPositiveKnockFunction}>
                    <FormattedMessage id="game.allow" />
                </button>
                {playersTurn === false &&
                    <button onClick={sendNegativeKnockFunction}>
                        <FormattedMessage id="game.deny" />
                    </button>
                }
            </div>
        </Fragment>
    )
}

export default PlayerKnock;