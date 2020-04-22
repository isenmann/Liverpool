import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DropArea from './DropArea';
import Card from './Card';
import ItemTypes from './ItemTypes'

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
                        <h3>Ablagestapel</h3>
                        <DropArea gameName={this.gameName} discard={true} ownDrop={false} />
                        {this.state != null && this.state.game != null && this.state.game.discardPile != null &&
                            <Card name={this.state.game.discardPile.displayName} cardType={ItemTypes.CARD} />                            
                        }
                        <p></p>
                        <h3>Aufnahmestapel</h3>
                        <Card name="back" cardType={ItemTypes.CARD}/> 
                    </div>
                   
                    <div style={{ overflow: 'hidden', clear: 'both' }}>
                        <h3>Hier zum Aufnehmen</h3>
                        <DropArea gameName={this.gameName} discard={false} ownDrop={false}/>
                        <p></p>
                        <h3>Hier zum Ablegen</h3>
                        <DropArea gameName={this.gameName} discard={false} ownDrop={true} />
                        {this.state != null && this.state.game != null &&
                            this.state.game.player.droppedCards.map(cards => {
                                return (<Card name={cards.displayName} cardType={ItemTypes.DROPPEDCARD} />);
                            }
                            )
                        }

                        <p></p>
                        <h3>Eigene Karten</h3>
                            {this.state != null && this.state.game != null &&
                            this.state.game.myCards.map(cards => {
                                return (<Card name={cards.displayName} cardType={ItemTypes.CARD} />);
                                }
                                )
                            }
                    </div>
                </DndProvider>
            </div>
        )
    }
}