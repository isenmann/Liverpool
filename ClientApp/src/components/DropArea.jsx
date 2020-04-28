import React from 'react'
import { Droppable }  from 'react-beautiful-dnd';
import ItemTypes from './ItemTypes'
import Cards from './Card'

const DropArea = ({ id, gameName, discard, ownDrop, dropAreaOfPlayer, cards, direction, disableDrop }) => (

    <Droppable droppableId={id} isDropDisabled={disableDrop} direction={direction}>
      {provided => {
        return (
          <div>
            {direction == "horizontal"
             ? <div class="d-flex" {...provided.droppableProps} ref={provided.innerRef}>
                 {id == "drawPile" 
                    ? <Cards key="back" className="card d-block" cardType={ItemTypes.CARD} name="back" index="0" cardOnly={false} />
                    : cards.map((card) => (
                      <Cards key={card.displayName+card.index} className="card overlap-h-20 d-block" cardType={ItemTypes.CARD} name={card.displayName} index={card.index} cardOnly={false} />
                     ))
                 }
                {provided.placeholder}
              </div>
            : <div {...provided.droppableProps} ref={provided.innerRef}>
                {cards.map((card) => (
                    <Cards key={card.displayName+card.index} className="card overlap-v-20 d-block" cardType={ItemTypes.CARD} name={card.displayName} index={card.index} cardOnly={false} />
                ))}
                {provided.placeholder}
              </div>
            }
          </div>
        );
      }}
    </Droppable>
);
export default DropArea
