import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormattedMessage } from 'react-intl';

function PlayerKnock({ playersKnocked, playersTurn, sendPositiveKnockFunction, sendNegativeKnockFunction }) {
    return (
        <AnimatePresence>
            {playersKnocked.length > 0 && (
                <motion.div
                    key="knock-panel"
                    initial={{ y: -30, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -30, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{
                        background: 'linear-gradient(135deg, #7a0000, #c0392b)',
                        border: '1px solid var(--gold-400)',
                        borderRadius: 10,
                        padding: '12px 16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    }}
                >
                    <div style={{
                        color: 'var(--gold-300)',
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        marginBottom: 6,
                        textAlign: 'center',
                    }}>
                        <FormattedMessage id="game.knocked" />
                    </div>
                    {playersKnocked.map((player) => (
                        <div key={player + 'knockRow'} style={{
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            padding: '2px 0',
                        }}>
                            {player}
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-casino"
                            style={{ fontSize: '0.8rem', padding: '5px 14px', zIndex: 9999 }}
                            onClick={sendPositiveKnockFunction}
                        >
                            <FormattedMessage id="game.allow" />
                        </motion.button>
                        {playersTurn === false && (
                            <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-casino"
                                style={{ fontSize: '0.8rem', padding: '5px 14px', zIndex: 9999 }}
                                onClick={sendNegativeKnockFunction}
                            >
                                <FormattedMessage id="game.deny" />
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PlayerKnock;
