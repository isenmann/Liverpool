import React, {Fragment} from 'react';
import DropAreaForDroppingCards from "./DropAreaForDroppingCards";
import DropArea from "./DropArea";
import {FormattedMessage} from "react-intl";

function Player({player, knockFunction, myCards}) {
    return (
        <Fragment>
            <div className="col-12 my-auto w-100">
                <div className="d-flex justify-content-center">
                    {player.playersTurn === true &&
                        <b style={{ backgroundColor: 'green' }}><FormattedMessage id="game.you" /></b>
                    }
                    {player.playersTurn === false &&
                    <Fragment>
                        <FormattedMessage id="game.you" />
                        <div>
                            <button onClick={knockFunction}>
                                <FormattedMessage id="game.knock" />
                            </button>
                        </div>
                    </Fragment>
                    }
                </div>
            </div>
            <div className="col-12 my-auto w-100 justify-content-center">
                {/* Dropped cards of player */}
                <div className="d-flex justify-content-center">
                    <DropAreaForDroppingCards key={player.name} player={player}
                                                direction="horizontal"/>
                </div>
            </div>
            <div className="col-12 my-auto w-100">
                {/* Player's cards*/}
                <div className="d-flex justify-content-center">
                    {myCards != null &&
                    <DropArea id="playersCard" disableDrop={false}
                                cards={myCards} direction="horizontal"/>
                    }
                </div>
            </div>
        </Fragment>
    )
}

export default Player;