import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
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

function DropArea({ id, cards, direction, disableDrop, isDealing, zoneRef }) {
    const isDropZone = id.includes('_card_dropped_');
    const isHand = id === 'playersCard';
    const isDrawPile = id === 'drawPile';
    const isKeepZone = id === 'playerCardForAskingToKeep';

    const isAllEmpty = cards && Array.isArray(cards) && cards.every(c => c.displayName === 'empty');

    return (
        <Droppable droppableId={id} isDropDisabled={disableDrop} direction={direction}>
            {(provided, snapshot) => (
                <div className="my-auto">
                    <motion.div
                        animate={{
                            boxShadow: snapshot.isDraggingOver
                                ? '0 0 0 2px var(--gold-400)'
                                : '0 0 0 0px transparent',
                        }}
                        transition={{ duration: 0.15 }}
                        style={{ borderRadius: 8, padding: 2 }}
                    >
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
                                    <motion.div
                                        style={EMPTY_ZONE_STYLE}
                                        animate={{ borderColor: ['rgba(212,168,67,0.2)', 'rgba(212,168,67,0.6)', 'rgba(212,168,67,0.2)'] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                ) : cards.map((card) => (
                                    <Cards
                                        myKey={id + card.displayName + card.index}
                                        key={id + card.displayName + card.index}
                                        className="card_dropped overlap-h-65 d-block"
                                        name={card.displayName}
                                        index={card.index}
                                    />
                                )))}
                                {isHand && cards && cards.map((card, i) => (
                                    <motion.div
                                        key={id + card.displayName + card.index}
                                        initial={isDealing ? { opacity: 0, y: -200, rotate: -10 } : false}
                                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                                        transition={isDealing
                                            ? { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                                            : { duration: 0.2 }
                                        }
                                    >
                                        <Cards
                                            myKey={id + card.displayName + card.index}
                                            className="card overlap-h-20 d-block"
                                            name={card.displayName}
                                            index={card.index}
                                        />
                                    </motion.div>
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
                                    <motion.div
                                        style={{ ...EMPTY_ZONE_STYLE, width: 'var(--card-w-sm)', margin: '4px auto' }}
                                        animate={{ borderColor: ['rgba(212,168,67,0.2)', 'rgba(212,168,67,0.6)', 'rgba(212,168,67,0.2)'] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
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
                    </motion.div>
                </div>
            )}
        </Droppable>
    );
}

export default DropArea;
