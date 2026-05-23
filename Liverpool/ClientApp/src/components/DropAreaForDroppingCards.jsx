import React from 'react';
import DropArea from './DropArea';

function DropAreaForDroppingCards({ direction, player, dropZoneRefs }) {
    const content = [];

    for (let i = 0; i < player.droppedCards.length; i++) {
        const dropId = `${player.name}_card_dropped_${i}`;
        const zoneKey = `${player.name}:${i}`;

        content.push(
            <div key={dropId + 'Div'} style={{ display: 'flex', justifyContent: 'center' }}>
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

    if (direction === 'vertical') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {content}
            </div>
        );
    }

    // Horizontal (top player): keep inline flow with Bootstrap flex
    return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {content}
        </div>
    );
}

export default DropAreaForDroppingCards;
