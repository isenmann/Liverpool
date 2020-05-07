import React from 'react'
import { Droppable }  from 'react-beautiful-dnd';
import Cards from './Card'

const DropArea = ({ id, cards, direction, disableDrop }) => (

    <Droppable droppableId={id} isDropDisabled={disableDrop} direction={direction}>
      {provided => {
        return (
            <div className="my-auto">
            {direction === "horizontal"
             ? <div className="d-flex" {...provided.droppableProps} ref={provided.innerRef}>
                 {id === "drawPile" 
                    ? <Cards myKey={id + "back0"} key="back" className="card d-block" name="back" index={0} />
                    : id === "playerCardForAskingToKeep"
                        ? <Cards myKey={id + cards.displayName + cards.index} key={id + cards.displayName + cards.index} className="card d-block" name={cards.displayName} index={0} />
                                : id.includes("_card_dropped_")
                                    ? cards.map((card) => (
                                        <Cards myKey={id + card.displayName + card.index} key={id + card.displayName + card.index} className="card_dropped overlap-h-65 d-block" name={card.displayName} index={card.index} />
                                        ))
                                    : cards.map((card) => (
                                        <Cards myKey={id + card.displayName + card.index} key={id+card.displayName+card.index} className="card overlap-h-20 d-block" name={card.displayName} index={card.index} />
                                        ))
                 }
                {provided.placeholder}
              </div>
             : <div {...provided.droppableProps} ref={provided.innerRef}>
                    {id.includes("_card_dropped_")
                        ?
                        cards.map((card) => (
                            <Cards myKey={id + card.displayName + card.index} key={id + card.displayName + card.index} className="card_dropped overlap-v-105 d-block" name={card.displayName} index={card.index} />
                        ))
                        :
                        cards.map((card) => (
                            <Cards myKey={id + card.displayName + card.index} key={id+card.displayName+card.index} className="card overlap-v-20 d-block" name={card.displayName} index={card.index} />
                        ))
                    }
                {provided.placeholder}
              </div>
            }
          </div>
        );
      }}
    </Droppable>
);
export default DropArea
