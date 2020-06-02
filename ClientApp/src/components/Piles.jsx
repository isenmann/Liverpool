import React, { Component } from 'react';
import DropArea from "./DropArea";

export default class Piles extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <b>Runde {this.props.game.round} ({this.props.game.mantra})</b>
                </div>
                <div className="d-flex justify-content-center">
                    <DropArea id="discardPile" disableDrop={false} cards={[this.props.game.discardPile]} direction="horizontal"/>
                    <DropArea id="drawPile" disableDrop={true} direction="horizontal"/>
                    {this.props.game.roundFinished && this.props.game.gameFinished === false &&
                    <div className="d-flex justify-content-center">
                        <button onClick={this.props.clickFunction}>
                            Nächste Runde
                        </button>
                    </div>
                    }
                </div>
            </div>
        )
    }
}