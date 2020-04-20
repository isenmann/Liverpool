import React from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'

const style = {
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left'
}

const imgStyle = {
    width: '35%',
    height: '35%'
}
const Card = ({ name }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.CARD },
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
                <img style={{ ...imgStyle }} src={process.env.PUBLIC_URL + '/images/' + name + '.png'} />
         </div>
    )
}
export default Card
