import React, { Fragment, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DropAreaForDroppingCards from './DropAreaForDroppingCards';
import DropArea from './DropArea';
import { FormattedMessage } from 'react-intl';

function Player({ player, knockFunction, myCards, handRef }) {
    const currCount = myCards?.length ?? 0;
    const prevCountRef = useRef(currCount);

    // Derived during this render, before useLayoutEffect updates the ref.
    // This means a card that mounts in this render already sees animateIn=true.
    const addedCount = Math.max(0, currCount - prevCountRef.current);
    const hasNewCards = addedCount > 0;
    const isDealing = addedCount > 3; // full deal (round start): stagger cards

    useLayoutEffect(() => {
        prevCountRef.current = currCount;
    });

    return (
        <Fragment>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <AnimatePresence mode="wait">
                    {player.playersTurn === true ? (
                        <motion.div
                            key="your-turn"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                color: 'var(--gold-400)',
                                fontSize: '1.1rem',
                                padding: '4px 16px',
                                borderRadius: 6,
                                background: 'var(--felt-600)',
                                border: '1px solid var(--gold-400)',
                                boxShadow: '0 0 12px rgba(30,122,30,0.5)',
                            }}
                        >
                            <FormattedMessage id="game.you" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="not-your-turn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            <span style={{ color: 'var(--text-muted)', fontFamily: "'Lato', sans-serif" }}>
                                <FormattedMessage id="game.you" />
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-casino"
                                style={{ fontSize: '0.8rem', padding: '4px 14px', zIndex: 9999 }}
                                onClick={knockFunction}
                            >
                                <FormattedMessage id="game.knock" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dropped cards */}
            <div style={{ width: '100%' }}>
                <DropAreaForDroppingCards player={player} direction="horizontal" />
            </div>

            {/* Hand cards */}
            <div ref={handRef} style={{ display: 'flex', justifyContent: 'center' }}>
                {myCards != null && (
                    <DropArea
                        id="playersCard"
                        disableDrop={false}
                        cards={myCards}
                        direction="horizontal"
                        isDealing={isDealing}
                        animateIn={hasNewCards}
                    />
                )}
            </div>
        </Fragment>
    );
}

export default Player;
