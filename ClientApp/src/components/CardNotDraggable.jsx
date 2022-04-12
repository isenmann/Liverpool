import React from 'react'

function CardNotDraggable ({ name, className }) {
    return (
      <div>
        <img alt="" className={className} src={process.env.PUBLIC_URL + '/images/' + name + '.png'} />
      </div>
    )
};

export default CardNotDraggable