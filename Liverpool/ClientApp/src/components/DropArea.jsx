import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
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
    transition: 'border 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
};

const EMPTY_ZONE_HOVER_STYLE = {
    border: '3px solid rgba(212,168,67,0.9)',
    boxShadow: '0 0 18px rgba(212,168,67,0.65), inset 0 0 10px rgba(212,168,67,0.15)',
    background: 'rgba(212,168,67,0.07)',
};

function DropArea({ id, cards, direction, disableDrop, isDealing, animateIn, zoneRef }) {
    const isDropZone = id.includes('_card_dropped_');
    const isHand = id === 'playersCard';
    const isDrawPile = id === 'drawPile';
    const isKeepZone = id === 'playerCardForAskingToKeep';
    const isDiscardPile = id === 'discardPile';

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
                                style={{
                                    transition: 'box-shadow 0.15s ease',
                                    ...((snapshot.isDraggingOver && ((isDropZone && !isAllEmpty) || isDiscardPile || isKeepZone)) && {
                                        boxShadow: '0 0 0 3px rgba(212,168,67,0.9), 0 0 18px rgba(212,168,67,0.65)',
                                        borderRadius: 'var(--card-radius)',
                                    }),
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
                                        isInDropZone
                                    />
                                )}
                                {isDropZone && cards && (isAllEmpty ? (
                                    <div style={snapshot.isDraggingOver ? { ...EMPTY_ZONE_STYLE, ...EMPTY_ZONE_HOVER_STYLE } : EMPTY_ZONE_STYLE} />
                                ) : cards.map((card, i) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card_dropped d-block"
                                        name={card.displayName}
                                        index={card.index}
                                        isInDropZone
                                        wrapperClassName={i > 0 ? 'overlap-h-65' : undefined}
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
                                        className="card d-block"
                                        name={card.displayName}
                                        index={card.index}
                                        isInDropZone
                                    />
                                ))}
                                {isHand
                                    ? provided.placeholder
                                    : <span style={{ position: 'absolute', overflow: 'hidden', width: 0, height: 0, pointerEvents: 'none' }}>{provided.placeholder}</span>
                                }
                            </div>
                        ) : (
                            <div
                                {...provided.droppableProps}
                                ref={el => {
                                    provided.innerRef(el);
                                    if (zoneRef) zoneRef(el);
                                }}
                                style={{
                                    width: 'var(--card-w-sm)',
                                    transition: 'box-shadow 0.15s ease',
                                    ...(isDropZone && !isAllEmpty && snapshot.isDraggingOver && {
                                        boxShadow: '0 0 0 3px rgba(212,168,67,0.9), 0 0 18px rgba(212,168,67,0.65)',
                                        borderRadius: 'var(--card-radius)',
                                    }),
                                }}
                            >
                                {isDropZone && cards && (isAllEmpty ? (
                                    <div style={snapshot.isDraggingOver
                                        ? { ...EMPTY_ZONE_STYLE, ...EMPTY_ZONE_HOVER_STYLE, width: 'var(--card-w-sm)', margin: '4px auto' }
                                        : { ...EMPTY_ZONE_STYLE, width: 'var(--card-w-sm)', margin: '4px auto' }
                                    } />
                                ) : cards.map((card, i) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card_dropped d-block"
                                        name={card.displayName}
                                        index={card.index}
                                        isInDropZone
                                        wrapperClassName={i > 0 ? 'overlap-v-105' : undefined}
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
                                {isHand
                                    ? provided.placeholder
                                    : <span style={{ position: 'absolute', overflow: 'hidden', width: 0, height: 0, pointerEvents: 'none' }}>{provided.placeholder}</span>
                                }
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Droppable>
    );
}

export default DropArea;
