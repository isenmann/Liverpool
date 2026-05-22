import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PlayerName({ player }) {
    return (
        <div style={{ position: 'relative', textAlign: 'center', padding: '4px 12px', display: 'inline-block' }}>
            <AnimatePresence>
                {player.playersTurn && (
                    <motion.div
                        key="turn-glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [1, 0.6, 1],
                            scale: 1,
                            boxShadow: [
                                '0 0 8px rgba(30,122,30,0.6)',
                                '0 0 20px rgba(30,122,30,0.9)',
                                '0 0 8px rgba(30,122,30,0.6)',
                            ],
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            opacity: { repeat: Infinity, duration: 1.5 },
                            scale: { duration: 0.2 },
                            boxShadow: { repeat: Infinity, duration: 1.5 },
                        }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 6,
                            background: 'var(--felt-600)',
                            border: '1px solid var(--gold-400)',
                            zIndex: -1,
                        }}
                    />
                )}
            </AnimatePresence>
            <span style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: player.playersTurn ? 700 : 400,
                color: player.playersTurn ? 'var(--gold-400)' : 'var(--text-muted)',
                fontSize: '0.85rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {player.name}
            </span>
        </div>
    );
}

export default PlayerName;
