import React, { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedCardFlyover({ animDto, fromRef, toRef, onComplete }) {
    const [fromRect, setFromRect] = useState(null);
    const [toRect, setToRect] = useState(null);

    useLayoutEffect(() => {
        if (fromRef?.current && toRef?.current) {
            setFromRect(fromRef.current.getBoundingClientRect());
            setToRect(toRef.current.getBoundingClientRect());
        } else {
            // Refs not available — skip animation and apply game update immediately
            onComplete?.();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!fromRect || !toRect) return null;

    const cardWidth = Math.max(fromRect.width, 80);

    return (
        <motion.div
            initial={{
                position: 'fixed',
                top: fromRect.top,
                left: fromRect.left,
                width: cardWidth,
                zIndex: 9999,
                pointerEvents: 'none',
                rotate: 0,
            }}
            animate={{
                top: toRect.top,
                left: toRect.left,
                width: toRect.width > 0 ? toRect.width : cardWidth,
                rotate: [0, -5, 0],
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={onComplete}
            style={{ position: 'fixed' }}
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
