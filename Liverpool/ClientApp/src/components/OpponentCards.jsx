import React from 'react';
import CardNotDraggable from './CardNotDraggable';

function OpponentCards({design, player, horizontal}) {
    let content = [];
    let className = "card_dropped d-block";
    if (horizontal) {
        className += " overlap-h-65";
    } else {
        className += " overlap-v-105";
    }

    let style = "";
    if (design != null) {
        style = design;
    }

    for (let i = 0; i < player.countofCards; i++) {
        if (i === 0) {
            content.push(<CardNotDraggable key={player.name + i} className="card_dropped d-block" name="back" />);
        } else {
            content.push(<CardNotDraggable key={player.name + i} className={className} name="back" />);
        }
    }

    return <div className={style}>{content}</div>;
}

export default OpponentCards;