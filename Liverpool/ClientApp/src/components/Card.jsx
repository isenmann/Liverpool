import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';

function Card({ name, className, index, myKey, isDealing, animateIn, isInDropZone, wrapperClassName }) {
    return (
        <Draggable key={myKey} draggableId={myKey} index={index}>
            {(provided, snapshot) => {
                // Append visual lift to DnD's position transform — does not affect drop-target calculations
                const baseTransform = provided.draggableProps.style?.transform;
                const transform = snapshot.isDragging
                    ? (baseTransform ? `${baseTransform} scale(1.08) rotate(3deg)` : baseTransform)
                    : (isInDropZone ? undefined : baseTransform);

                let wrapperClass = 'card-draggable';
                if (isInDropZone) wrapperClass += ' no-hover';
                if (wrapperClassName) wrapperClass += ' ' + wrapperClassName;

                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={wrapperClass}
                        style={{
                            ...provided.draggableProps.style,
                            transform,
                            lineHeight: 0,
                            boxShadow: 'none',
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                            zIndex: snapshot.isDragging ? 9999 : undefined,
                        }}
                    >
                        <motion.img
                            initial={animateIn ? { opacity: 0, y: -28, scale: 0.82 } : false}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.38,
                                ease: [0.22, 1, 0.36, 1],
                                delay: isDealing ? index * 0.06 : 0,
                            }}
                            alt=""
                            className={className}
                            src={process.env.PUBLIC_URL + '/images/' + name + '.png'}
                            draggable={false}
                            style={{
                                display: 'block',
                                borderRadius: 'var(--card-radius)',
                                verticalAlign: 'top',
                                boxShadow: snapshot.isDragging
                                    ? '0 24px 48px rgba(0,0,0,0.85), 0 8px 16px rgba(0,0,0,0.6)'
                                    : 'var(--shadow-card)',
                            }}
                        />
                    </div>
                );
            }}
        </Draggable>
    );
}

export default Card;
