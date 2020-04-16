import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DropArea from './DropArea';
import Card from './Card';

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
                <DndProvider backend={Backend}>
                    <h1>Game {this.gameName} started</h1>
                    <div style={{ overflow: 'hidden', clear: 'both' }}>
                        <DropArea />
                    </div>
                   
                    <div>
                    
                    <h2>{myCards}</h2>
                    {this.state != null && this.state.game != null &&
                        this.state.game.myCards.map(cards => {
                            return (<Card name={cards.displayName} />);
                        }
                        )
                    }
                    </div>
                </DndProvider>
            </div>
        )
    }
}