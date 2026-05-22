import React from 'react';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';

function Card({ name, className, index, myKey }) {
    return (
        <Draggable key={myKey} draggableId={myKey} index={index}>
            {(provided, snapshot) => (
                <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    whileHover={snapshot.isDragging ? {} : {
                        y: -10,
                        scale: 1.06,
                        zIndex: 10,
                        transition: { type: 'spring', stiffness: 400, damping: 20 },
                    }}
                    animate={{
                        boxShadow: snapshot.isDragging
                            ? '0 20px 40px rgba(0,0,0,0.8)'
                            : 'var(--shadow-card)',
                    }}
                    style={{
                        ...provided.draggableProps.style,
                        borderRadius: 'var(--card-radius)',
                        display: 'inline-block',
                        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                    }}
                >
                    <img
                        alt=""
                        className={className}
                        src={process.env.PUBLIC_URL + '/images/' + name + '.png'}
                        draggable={false}
                        style={{ display: 'block', borderRadius: 'var(--card-radius)' }}
                    />
                </motion.div>
            )}
        </Draggable>
    );
}

export default Card;
