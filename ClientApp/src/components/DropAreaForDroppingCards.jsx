import React, { Fragment } from 'react';
import DropArea from './DropArea';

function DropAreaForDroppingCards({direction, player}) {
    var content = [];
    var height = "";
    let className = "d-flex col justify-content-center";

    if (direction === "vertical") {
        if (player.droppedCards.length === 2) {
            height = "h-50";
        }
        if (player.droppedCards.length === 3) {
            height = "h-33";
        }
        if (player.droppedCards.length === 4) {
            height = "h-25";
        }

        className = height + " d-flex w-100 justify-content-center";
    }

    for (var i = 0; i < player.droppedCards.length; i++) {
        var dropId = player.name + "_card_dropped_" + i;
        content.push(
            <div key={dropId + "Div"} className={className}>
                <DropArea key={dropId} id={dropId} disableDrop={false} cards={player.droppedCards[i]} direction={direction} />
            </div>
        );
    }

    return <Fragment>{content}</Fragment>
}

export default DropAreaForDroppingCards;