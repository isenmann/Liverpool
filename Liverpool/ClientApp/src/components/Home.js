import React from 'react';
import { motion } from 'framer-motion';
import CardNotDraggable from './CardNotDraggable';
import { FormattedMessage } from 'react-intl';

const CARDS = ['AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH'];

function Home() {
    return (
        <div style={{
            flex: 1,
            padding: '32px 48px',
            maxWidth: 900,
            margin: '0 auto',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--gold-400)',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    marginBottom: 4,
                }}>
                    <FormattedMessage id="welcome" />
                </h1>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(44,24,16,0.6)',
                    color: 'var(--text-muted)',
                    fontFamily: "'Lato', sans-serif",
                    fontSize: '0.8rem',
                    padding: '2px 10px',
                    borderRadius: 20,
                    border: '1px solid rgba(212,168,67,0.3)',
                    marginBottom: 28,
                }}>
                    v1.8.3
                </div>
            </motion.div>

            {/* Animated card fan */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, paddingLeft: 40 }}
            >
                {CARDS.map((name, i) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 40, rotate: (i - 6) * 2 }}
                        animate={{ opacity: 1, y: 0, rotate: (i - 6) * 2 }}
                        whileHover={{ y: -18, rotate: 0, scale: 1.12, zIndex: 10 }}
                        transition={{
                            opacity: { delay: 0.1 + i * 0.04, duration: 0.4 },
                            y: { delay: 0.1 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                            rotate: { delay: 0.1 + i * 0.04, duration: 0.45 },
                        }}
                        style={{ marginLeft: i === 0 ? 0 : 'var(--card-overlap-h)', cursor: 'pointer' }}
                    >
                        <CardNotDraggable className="card_dropped d-block" name={name} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(212,168,67,0.2)',
                    borderRadius: 12,
                    padding: '20px 24px',
                    marginBottom: 24,
                }}
            >
                <ul style={{
                    color: 'var(--text-primary)',
                    fontFamily: "'Lato', sans-serif",
                    lineHeight: 2,
                    paddingLeft: 20,
                    margin: 0,
                }}>
                    <li><FormattedMessage id="welcome.start.1" /></li>
                    <li><FormattedMessage id="welcome.start.2" /></li>
                    <li><FormattedMessage id="welcome.start.3" /></li>
                    <li><FormattedMessage id="welcome.start.4" /></li>
                    <li><FormattedMessage id="welcome.start.5" /></li>
                </ul>
            </motion.div>

            {/* Attribution */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{ color: 'var(--text-muted)', fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', lineHeight: 1.8 }}
            >
                <FormattedMessage id="welcome.thanks" /><br />
                <b style={{ color: 'var(--text-primary)' }}>Vectorized Playing Cards 3.1</b><br />
                <a href="https://totalnonsense.com/open-source-vector-playing-cards" rel="noopener noreferrer" target="_blank" style={{ color: 'var(--gold-400)' }}>
                    https://totalnonsense.com/open-source-vector-playing-cards
                </a><br />
                Copyright 2011,2020 - Chris Aguilar - conjurenation at gmail dot com<br />
                Licensed under: LGPL 3.0 -{' '}
                <a href="https://www.gnu.org/licenses/lgpl-3.0.html" rel="noopener noreferrer" target="_blank" style={{ color: 'var(--gold-400)' }}>
                    https://www.gnu.org/licenses/lgpl-3.0.html
                </a>
            </motion.div>
        </div>
    );
}

export default Home;
