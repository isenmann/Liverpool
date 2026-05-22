import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DropArea from './DropArea';
import { FormattedMessage } from 'react-intl';

function Piles({ game, clickFunction, discardPileRef, drawPileRef }) {
    const prevDiscardRef = useRef(game.discardPile?.displayName);
    const [discardFlash, setDiscardFlash] = useState(false);

    useEffect(() => {
        const curr = game.discardPile?.displayName;
        if (curr && curr !== 'empty' && curr !== prevDiscardRef.current) {
            setDiscardFlash(true);
            setTimeout(() => setDiscardFlash(false), 350);
        }
        prevDiscardRef.current = curr;
    }, [game.discardPile]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                color: 'var(--gold-400)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: 6,
            }}>
                <FormattedMessage id="game.round" /> {game.round} (<FormattedMessage id={game.mantra} />)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'flex-start' }}>
                <motion.div
                    ref={discardPileRef}
                    animate={{ scale: discardFlash ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <DropArea
                        id="discardPile"
                        disableDrop={false}
                        cards={[game.discardPile]}
                        direction="horizontal"
                    />
                </motion.div>

                <div ref={drawPileRef}>
                    <DropArea id="drawPile" disableDrop={true} direction="horizontal" />
                </div>

                {game.roundFinished && game.gameFinished === false && (
                    <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-casino"
                        style={{ zIndex: 9999, alignSelf: 'center' }}
                        onClick={clickFunction}
                    >
                        <FormattedMessage id="game.nextRound" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}

export default Piles;
