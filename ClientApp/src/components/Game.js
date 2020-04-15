import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService'

export class Game extends Component {
    static displayName = Game.name;

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.gameName = params.name;

        LiverpoolService.registerGameUpdated((gameDto) => {
            this.setState({ game: gameDto });
        });
    }

    render() {

        let myCards = "";

        if (this.state !=null && this.state.game != null) {
            this.state.game.myCards.map(cards =>
                myCards = myCards + ' ' + cards.displayName
            )
        } else {
            myCards = "";
        }

        return (
            <div>
                <h1>Game {this.gameName} started</h1>
                <h2>{myCards}</h2>
                {this.state != null && this.state.game != null &&
                    this.state.game.myCards.map(cards => {
                        return (<img src={process.env.PUBLIC_URL + '/images/' + cards.displayName + '.png'} />);
                    }
                    )
                }
            </div>
        )
    }
}