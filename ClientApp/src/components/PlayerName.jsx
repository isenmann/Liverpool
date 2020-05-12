import React, { Component } from 'react';

export default class PlayerName extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="text-center">
                {this.props.player.playersTurn === true &&
                    <b style={{backgroundColor: 'green'}}>{this.props.player.name}</b>
                }
                {this.props.player.playersTurn === false &&
                    this.props.player.name
                }
            </div>
        )
    }
}