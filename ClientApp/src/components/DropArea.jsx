import React from 'react'
import { Droppable }  from 'react-beautiful-dnd';
import ItemTypes from './ItemTypes'
import Cards from './Card'

const DropArea = ({ id, cards, direction, disableDrop }) => (

    <Droppable droppableId={id} isDropDisabled={disableDrop} direction={direction}>
      {provided => {
        return (
          <div>
            {direction == "horizontal"
             ? <div class="d-flex" {...provided.droppableProps} ref={provided.innerRef}>
                 {id == "drawPile" 
                    ? <Cards myKey={id + "back" + "0"} key="back" className="card d-block" cardType={ItemTypes.CARD} name="back" index={0} cardOnly={false} />
                    : id == "playerCardForAskingToKeep"
                        ? <Cards myKey={id + cards.displayName + cards.index} key={id + cards.displayName + cards.index} className="card d-block" cardType={ItemTypes.CARD} name={cards.displayName} index={0} cardOnly={false} />
                                : id.includes("_card_dropped_")
                                    ? cards.map((card) => (
                                        <Cards myKey={id + card.displayName + card.index} key={id + card.displayName + card.index} className="card_dropped overlap-h-65 d-block" cardType={ItemTypes.CARD} name={card.displayName} index={card.index} cardOnly={false} />
                                        ))
                                    : cards.map((card) => (
                                        <Cards myKey={id + card.displayName + card.index} key={id+card.displayName+card.index} className="card overlap-h-20 d-block" cardType={ItemTypes.CARD} name={card.displayName} index={card.index} cardOnly={false} />
                                        ))
                 }
                {provided.placeholder}
              </div>
             : <div {...provided.droppableProps} ref={provided.innerRef}>
                    {id.includes("_card_dropped_")
                        ?
                        cards.map((card) => (
                            <Cards myKey={id + card.displayName + card.index} key={id + card.displayName + card.index} className="card_dropped overlap-v-105 d-block" cardType={ItemTypes.CARD} name={card.displayName} index={card.index} cardOnly={false} />
                        ))
                        :
                        cards.map((card) => (
                            <Cards myKey={id + card.displayName + card.index} key={id+card.displayName+card.index} className="card overlap-v-20 d-block" cardType={ItemTypes.CARD} name={card.displayName} index={card.index} cardOnly={false} />
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
