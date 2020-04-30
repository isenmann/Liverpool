import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ name, cardType, className, index, myKey }) => (
    <Draggable key={myKey} draggableId={myKey} index={index}>
    {provided => {
      return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <img className={className} src={process.env.PUBLIC_URL + '/images/' + name + '.png'} />
        </div>
      );
    }}
    </Draggable>
);
export default Card