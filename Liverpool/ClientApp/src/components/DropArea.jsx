import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Cards from './Card';

const EMPTY_ZONE_STYLE = {
    width: 'var(--card-w-sm)',
    height: 'calc(var(--card-w-sm) * 1.4)',
    border: '2px dashed rgba(212,168,67,0.4)',
    borderRadius: 'var(--card-radius)',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

function DropArea({ id, cards, direction, disableDrop, isDealing, animateIn, zoneRef }) {
    const isDropZone = id.includes('_card_dropped_');
    const isHand = id === 'playersCard';
    const isDrawPile = id === 'drawPile';
    const isKeepZone = id === 'playerCardForAskingToKeep';

    const isAllEmpty = cards && Array.isArray(cards) && cards.every(c => c.displayName === 'empty');

    return (
        <Droppable droppableId={id} isDropDisabled={disableDrop} direction={direction}>
            {(provided, snapshot) => (
                <div className="my-auto">
                    {/* Gold ring + glow on drag-over — boxShadow only, no transforms */}
                    <div>
                        {direction === 'horizontal' ? (
                            <div
                                className="d-flex"
                                {...provided.droppableProps}
                                ref={el => {
                                    provided.innerRef(el);
                                    if (zoneRef) zoneRef(el);
                                }}
                            >
                                {isDrawPile && (
                                    <Cards
                                        myKey={id + 'back0'}
                                        className="card d-block"
                                        name="back"
                                        index={0}
                                    />
                                )}
                                {isKeepZone && cards && (
                                    <Cards
                                        myKey={id + cards.displayName + cards.index}
                                        className="card d-block"
                                        name={cards.displayName}
                                        index={0}
                                    />
                                )}
                                {isDropZone && cards && (isAllEmpty ? (
                                    <div style={EMPTY_ZONE_STYLE} />
                                ) : cards.map((card) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card_dropped overlap-h-65 d-block"
                                        name={card.displayName}
                                        index={card.index}
                                    />
                                )))}
                                {isHand && cards && cards.map((card) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card overlap-h-20 d-block"
                                        name={card.displayName}
                                        index={card.index}
                                        isDealing={isDealing}
                                        animateIn={animateIn}
                                    />
                                ))}
                                {!isDrawPile && !isKeepZone && !isDropZone && !isHand && cards && cards.map((card) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card overlap-h-20 d-block"
                                        name={card.displayName}
                                        index={card.index}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        ) : (
                            <div
                                {...provided.droppableProps}
                                ref={el => {
                                    provided.innerRef(el);
                                    if (zoneRef) zoneRef(el);
                                }}
                            >
                                {isDropZone && cards && (isAllEmpty ? (
                                    <div style={{ ...EMPTY_ZONE_STYLE, width: 'var(--card-w-sm)', margin: '4px auto' }} />
                                ) : cards.map((card) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card_dropped overlap-v-105 d-block"
                                        name={card.displayName}
                                        index={card.index}
                                    />
                                )))}
                                {!isDropZone && cards && cards.map((card) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card overlap-v-20 d-block"
                                        name={card.displayName}
                                        index={card.index}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Droppable>
    );
}

export default DropArea;
