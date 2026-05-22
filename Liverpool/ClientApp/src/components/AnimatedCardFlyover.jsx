import React, { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CARD_W = 90;
const CARD_H = CARD_W * 1.4; // matches playing-card aspect ratio

function AnimatedCardFlyover({ animDto, fromRef, toRef, onComplete }) {
    const [pos, setPos] = useState(null);

    useLayoutEffect(() => {
        if (fromRef?.current && toRef?.current) {
            const from = fromRef.current.getBoundingClientRect();
            const to   = toRef.current.getBoundingClientRect();
            // Fly from/to the CENTER of each zone so it doesn't matter how
            // wide the zone's bounding-rect is (e.g. a full hand of cards).
            setPos({
                fromLeft: from.left + from.width  / 2 - CARD_W / 2,
                fromTop:  from.top  + from.height / 2 - CARD_H / 2,
                toLeft:   to.left   + to.width    / 2 - CARD_W / 2,
                toTop:    to.top    + to.height   / 2 - CARD_H / 2,
            });
        } else {
            onComplete?.();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!pos) return null;

    return (
        <motion.div
            style={{ position: 'fixed', width: CARD_W, zIndex: 9999, pointerEvents: 'none' }}
            initial={{ top: pos.fromTop, left: pos.fromLeft, rotate: 0 }}
            animate={{ top: pos.toTop,   left: pos.toLeft,   rotate: [0, -6, 0] }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={onComplete}
        >
            <img
                alt=""
                src={`${process.env.PUBLIC_URL}/images/${animDto.cardName ?? 'back'}.png`}
                style={{
                    width: '100%',
                    borderRadius: 'var(--card-radius)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.8)',
                    display: 'block',
                }}
                draggable={false}
            />
        </motion.div>
    );
}

export default AnimatedCardFlyover;
