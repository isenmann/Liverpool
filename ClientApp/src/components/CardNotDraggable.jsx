import React from 'react'

const CardNotDraggable = ({ name, cardType, className }) => {
    return (
      <div>
        <img className={className} src={process.env.PUBLIC_URL + '/images/' + name + '.png'} />
      </div>
    )
}
export default CardNotDraggable