import React from 'react';
import { motion } from 'framer-motion';
import CardNotDraggable from './CardNotDraggable';
import { FormattedMessage } from 'react-intl';

function KeepingCardQuestion({ cardName, positiveKeepFeedbackFunction, negativeKeepFeedbackFunction }) {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
                border: '1px solid var(--gold-400)',
                borderRadius: 10,
                padding: '12px 16px',
                textAlign: 'center',
                background: 'rgba(44,24,16,0.7)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
            }}
        >
            <div style={{
                color: 'var(--gold-400)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: 8,
            }}>
                <FormattedMessage id="game.keepingCardQuestion" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <CardNotDraggable className="card d-block" name={cardName} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-casino"
                    style={{ fontSize: '0.8rem', padding: '5px 14px', zIndex: 9999 }}
                    onClick={positiveKeepFeedbackFunction}
                >
                    <FormattedMessage id="game.allow" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-casino"
                    style={{ fontSize: '0.8rem', padding: '5px 14px', zIndex: 9999 }}
                    onClick={negativeKeepFeedbackFunction}
                >
                    <FormattedMessage id="game.deny" />
                </motion.button>
            </div>
        </motion.div>
    );
}

export default KeepingCardQuestion;
