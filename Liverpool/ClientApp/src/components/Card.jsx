import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

function Card ({ name, className, index, myKey }) {
    return (
      <Draggable key={myKey} draggableId={myKey} index={index}>
      {provided => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <img alt="" className={className} src={process.env.PUBLIC_URL + '/images/' + name + '.png'} />
          </div>
        );
      }}
      </Draggable>
    );
};

export default Card