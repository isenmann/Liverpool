import React, { Component } from 'react';
import DropArea from './DropArea';

export default class DropAreaForDroppingCards extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var content = [];
        var height = "";
        let className = "d-flex col justify-content-center";

        if (this.props.direction === "vertical") {
            if (this.props.player.droppedCards.length === 2) {
                height = "h-50";
            }
            if (this.props.player.droppedCards.length === 3) {
                height = "h-33";
            }
            if (this.props.player.droppedCards.length === 4) {
                height = "h-25";
            }

            className = height + " d-flex w-100 justify-content-center";
        }

        for (var i = 0; i < this.props.player.droppedCards.length; i++) {
            var dropId = this.props.player.name + "_card_dropped_" + i;
            content.push(
                <div className={className}>
                    <DropArea id={dropId} disableDrop={false} cards={this.props.player.droppedCards[i]} direction={this.props.direction} />
                </div>
            );
        }
        return content;
    }
}