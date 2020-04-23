import React from 'react'
import { useDrag } from 'react-dnd'

const style = {
    cursor: 'move'
}

const Card = ({ name, cardType, className }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: cardType },
        //end: (item, monitor) => {
        //    const dropResult = monitor.getDropResult()
        //    if (item && dropResult) {
        //        alert(`You dropped ${item.name} into ${dropResult.name}!`)
        //    }
        //},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0.4 : 1
    return (
        <div ref={drag} style={{ ...style, opacity }}>
            <img className={className} src={process.env.PUBLIC_URL + '/images/' + name + '.png'} />
         </div>
    )
}
export default Card
