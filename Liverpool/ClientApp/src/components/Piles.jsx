import React from 'react';
import DropArea from "./DropArea";
import {FormattedMessage} from "react-intl";

function Piles({game, clickFunction}) {
    return (
        <div>
            <div className="d-flex justify-content-center">
                <b><FormattedMessage id="game.round" /> {game.round} (<FormattedMessage id={game.mantra} />)</b>
            </div>
            <div className="d-flex justify-content-center">
                <DropArea id="discardPile" disableDrop={false} cards={[game.discardPile]} direction="horizontal"/>
                <DropArea id="drawPile" disableDrop={true} direction="horizontal"/>
                {game.roundFinished && game.gameFinished === false &&
                <div className="d-flex justify-content-center">
                    <button onClick={clickFunction}>
                        <FormattedMessage id="game.nextRound" />
                    </button>
                </div>
                }
            </div>
        </div>
    )
}

export default Piles;