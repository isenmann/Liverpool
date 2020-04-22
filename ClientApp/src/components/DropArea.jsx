import React from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from './ItemTypes'
import LiverpoolService from '../services/LiverpoolHubService';

const style = {
    height: '12rem',
    width: '12rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
}
const DropArea = ({ gameName, discard, ownDrop }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop(item, monitor) {
            const didDrop = monitor.didDrop()
            if (didDrop) {
                return
            }

            if (discard) {
                LiverpoolService.discardCard(gameName, item.name);
            }
            else if (ownDrop) {
                LiverpoolService.dropCard(gameName, item.name);
            }
            else {
                if (item.name === "back") {
                    LiverpoolService.drawCardFromDrawPile(gameName);
                } else {
                    LiverpoolService.drawCardFromDiscardPile(gameName, item.name);
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }
    return (
        <div ref={drop} style={{ ...style, backgroundColor }}>
            {isActive ? 'Release to drop' : 'Drag a card here'}
        </div>
    )
}
export default DropArea
