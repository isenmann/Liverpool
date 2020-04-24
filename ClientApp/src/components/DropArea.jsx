import React from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from './ItemTypes'
import LiverpoolService from '../services/LiverpoolHubService';

const style = {
    height: '50px',
    width: '50px'
}
const DropArea = ({ gameName, discard, ownDrop, dropAreaOfPlayer }) => {
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
            else if (dropAreaOfPlayer != "") {
                LiverpoolService.dropCardAtPlayer(gameName, item.name, dropAreaOfPlayer);
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
            
        </div>
    )
}
export default DropArea
