import React from 'react';
import { motion } from 'framer-motion';
import CardNotDraggable from './CardNotDraggable';
import DropArea from './DropArea';
import { FormattedMessage } from 'react-intl';

function KeepingCard({ keepingCard, askedForKeepingCard }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                border: '1px solid rgba(212,168,67,0.4)',
                borderRadius: 10,
                padding: '10px 14px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.25)',
                width: 'fit-content',
                justifySelf: 'end',
            }}
        >
            <div style={{
                color: 'var(--gold-400)',
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: 8,
            }}>
                <FormattedMessage id="game.keepingCard" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {askedForKeepingCard ? (
                    <CardNotDraggable className="card d-block" name={keepingCard.displayName} />
                ) : (
                    <DropArea
                        id="playerCardForAskingToKeep"
                        disableDrop={false}
                        cards={keepingCard}
                        direction="horizontal"
                    />
                )}
            </div>
        </motion.div>
    );
}

export default KeepingCard;
