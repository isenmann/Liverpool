import React, { Fragment } from 'react';
import DropArea from './DropArea';

function DropAreaForDroppingCards({ direction, player, dropZoneRefs }) {
    const content = [];
    let className = 'd-flex col justify-content-center';

    if (direction === 'vertical') {
        let height = '';
        if (player.droppedCards.length === 2) height = 'h-50';
        if (player.droppedCards.length === 3) height = 'h-33';
        if (player.droppedCards.length === 4) height = 'h-25';
        className = `${height} d-flex w-100 justify-content-center`;
    }

    for (let i = 0; i < player.droppedCards.length; i++) {
        const dropId = `${player.name}_card_dropped_${i}`;
        const zoneKey = `${player.name}:${i}`;

        content.push(
            <div key={dropId + 'Div'} className={className}>
                <DropArea
                    key={dropId}
                    id={dropId}
                    disableDrop={false}
                    cards={player.droppedCards[i]}
                    direction={direction}
                    zoneRef={dropZoneRefs
                        ? el => {
                            if (!dropZoneRefs.current[zoneKey]) {
                                dropZoneRefs.current[zoneKey] = { current: null };
                            }
                            dropZoneRefs.current[zoneKey].current = el;
                        }
                        : undefined
                    }
                />
            </div>
        );
    }

    return <Fragment>{content}</Fragment>;
}

export default DropAreaForDroppingCards;
