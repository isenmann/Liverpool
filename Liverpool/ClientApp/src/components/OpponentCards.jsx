import React from 'react';
import CardNotDraggable from './CardNotDraggable';

function OpponentCards({ design, player, horizontal, handRef }) {
    let content = [];
    let className = "card_dropped d-block";
    if (horizontal) {
        className += " overlap-h-65";
    } else {
        className += " overlap-v-105";
    }

    for (let i = 0; i < player.countofCards; i++) {
        if (i === 0) {
            content.push(<CardNotDraggable key={player.name + i} className="card_dropped d-block" name="back" />);
        } else {
            content.push(<CardNotDraggable key={player.name + i} className={className} name="back" />);
        }
    }

    return <div ref={handRef} className={design ?? ''}>{content}</div>;
}

export default OpponentCards;