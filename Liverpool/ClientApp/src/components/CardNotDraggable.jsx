import React from 'react';
import { motion } from 'framer-motion';

function CardNotDraggable({ name, className, layoutId }) {
    return (
        <motion.div
            layoutId={layoutId}
            style={{ borderRadius: 'var(--card-radius)', display: 'inline-block' }}
        >
            <img
                alt=""
                className={className}
                src={process.env.PUBLIC_URL + '/images/' + name + '.png'}
                draggable={false}
                style={{ display: 'block', borderRadius: 'var(--card-radius)' }}
            />
        </motion.div>
    );
}

export default CardNotDraggable;
