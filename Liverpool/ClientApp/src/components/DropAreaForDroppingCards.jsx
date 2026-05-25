import React from 'react';
import DropArea from './DropArea';

function DropAreaForDroppingCards({ direction, player, dropZoneRefs }) {
    const isVertical = direction === 'vertical';

    return (
        <div style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            height: isVertical ? '100%' : undefined,
            width: isVertical ? undefined : '100%',
        }}>
            {player.droppedCards.map((cards, i) => {
                const dropId = `${player.name}_card_dropped_${i}`;
                const zoneKey = `${player.name}:${i}`;

                return (
                    <div key={dropId + 'Cell'} style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <DropArea
                            id={dropId}
                            disableDrop={false}
                            cards={cards}
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
            })}
        </div>
    );
}

export default DropAreaForDroppingCards;
