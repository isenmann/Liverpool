import React from 'react';
import { motion } from 'framer-motion';

function PlayerName({ player }) {
    const active = player.playersTurn;

    return (
        <motion.div
            animate={{
                background: active ? '#1a5c1a' : 'rgba(0,0,0,0)',
                borderColor: active ? '#d4a843' : 'rgba(0,0,0,0)',
                boxShadow: active
                    ? ['0 0 8px rgba(30,122,30,0.55)', '0 0 20px rgba(30,122,30,0.9)', '0 0 8px rgba(30,122,30,0.55)']
                    : '0 0 0px transparent',
            }}
            transition={{
                background:   { duration: 0.25 },
                borderColor:  { duration: 0.25 },
                boxShadow:    { repeat: active ? Infinity : 0, duration: 1.5 },
            }}
            style={{
                display: 'inline-block',
                textAlign: 'center',
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid transparent',
            }}
        >
            <span style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: active ? 700 : 400,
                color: active ? '#d4a843' : 'var(--text-muted)',
                fontSize: '0.85rem',
            }}>
                {player.name}
            </span>
        </motion.div>
    );
}

export default PlayerName;
