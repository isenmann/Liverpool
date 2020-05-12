import React, { Component } from 'react';
import CardNotDraggable from './CardNotDraggable';

export default class OpponentCards extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let content = [];
        let className = "card_dropped d-block";
        if (this.props.horizontal) {
            className += " overlap-h-65";
        } else {
            className += " overlap-v-105";
        }

        let style = "";
        if (this.props.design != null) {
            style = this.props.design;
        }

        for (let i = 0; i < this.props.player.countofCards; i++) {
            if (i === 0) {
                content.push(<CardNotDraggable key={this.props.player.name + i} className="card_dropped d-block" name="back" />);
            } else {
                content.push(<CardNotDraggable key={this.props.player.name + i} className={className} name="back" />);
            }
        }

        return <div className={style}>{content}</div>;
    }
}