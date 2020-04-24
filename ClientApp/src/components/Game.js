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
        this.handleDropCards = this.handleDropCards.bind(this);

        LiverpoolService.registerGameUpdated((gameDto) => {
            this.setState({ game: gameDto });
        });
    }

    getOpponentCards = (player, horizontal) => {
        let content = [];
        let className = "card d-block";
        if (horizontal) {
            className += " overlap-h-20";
        } else {
            className += " overlap-v-20";
        }
        for (let i = 0; i < player.countofCards; i++) {
            if (i === 0) {
                content.push(<Card className="card d-block" name="back" cardType={ItemTypes.DROPPEDCARD} />);
            } else {
                content.push(<Card className={className} name="back" cardType={ItemTypes.DROPPEDCARD} />);
            }
            
        }
        return content;
    };

    handleDropCards() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.dropCards(this.state.game.name);
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
            <div class="container-fluid h-100">
                <DndProvider backend={Backend}>
                    <div class="row h-100">
                        <div class="col-3">
                            <div class="row h-100">
                                <div class="col-6 my-auto">
                                    <div class=""> {/* < !--Linker Spieler verdeckte Karten --> */}
                                        {this.state != null && this.state.game != null &&
                                            this.state.game.players[0].playersTurn === true &&
                                            <p>Active player</p>
                                        }
                                        {this.state != null && this.state.game != null &&
                                            this.getOpponentCards(this.state.game.players[0], false)
                                        }
                                    </div>
                                </div>
                                <div class="col-6 my-auto">
                                    <div class=""> {/* <!-- Linker Spieler abgelegten Karten -->*/}
                                        {this.state != null && this.state.game != null &&
                                            this.state.game.players[0].droppedCards.map(cards => {
                                                return (<Card className="card overlap-v-20 d-block" name={cards.displayName} cardType={ItemTypes.DROPPEDCARD} />);
                                            }
                                            )
                                        }
                                        {/* <img class="card d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" /> -->*/}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="row h-33">
                                <div class="row w-100">
                                    <div class="col-12 my-auto"> {/* <!-- Oberer Spieler verdeckte Karten -->*/}
                                        <div class="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null &&
                                                this.state.game.players[1].playersTurn === true &&
                                                <p>Active player</p>
                                            }
                                            {this.state != null && this.state.game != null &&
                                                this.getOpponentCards(this.state.game.players[1], true)
                                            }
                                        </div>
                                    </div>
                                    <div class="col-12 my-auto">
                                        <div class="d-flex justify-content-center"> {/* <!-- Oberer Spieler abgelegten Karten -->*/}
                                            {this.state != null && this.state.game != null &&
                                                this.state.game.players[1].droppedCards.map(cards => {
                                                    return (<Card className="card overlap-h-20 d-block" name={cards.displayName} cardType={ItemTypes.DROPPEDCARD} />);
                                                }
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row h-33">
                                <div class="col-12 my-auto"> {/* <!-- Stapel in der Mitte -->*/}
                                    <div class="d-flex justify-content-center">
                                        <DropArea gameName={this.gameName} discard={true} ownDrop={false} />
                                        {this.state != null && this.state.game != null && this.state.game.discardPile != null &&
                                            <Card className="m-3 card" name={this.state.game.discardPile.displayName} cardType={ItemTypes.CARD} />                            
                                        }
                                        <Card className="m-3 card" name="back" cardType={ItemTypes.CARD}/>
                                    </div>
                                </div>
                            </div>

                            <div class="row h-33">
                                <div class="row w-100">
                                    <div class="col-12 my-auto">
                                        <div class="d-flex justify-content-center"> {/* <!-- Eigene abgelegt Karten -->*/}
                                            
                                            <button onClick={this.handleDropCards}> 
                                                "Drop cards"
                                            </button>
                                            {this.state != null && this.state.game != null &&
                                                this.state.game.player.droppedCards.map(cards => {
                                                    return (<Card className="overlap-h-20 card" name={cards.displayName} cardType={ItemTypes.DROPPEDCARD} />);
                                            }
                                            )
                                            }
                                        </div>
                                    </div>
                                    <div class="col-12 my-auto w-100">
                                        <div class="d-flex justify-content-center"> {/* <!-- Spielerhand -->*/}
                                            <DropArea gameName={this.gameName} discard={false} ownDrop={false} />
                                            {this.state != null && this.state.game != null &&
                                                this.state.game.myCards.map(cards => {
                                                    return (<Card className="overlap-h-20 card" name={cards.displayName} cardType={ItemTypes.CARD} />);
                                                    }
                                                )
                                            }
                                            {this.state != null && this.state.game != null &&
                                                    this.state.game.player.playersTurn === true &&
                                                <p>Your turn</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state != null && this.state.game != null && this.state.game.players.length === 3 &&
                            <div class="col-3">
                            <div class="row h-100">
                                <div class="col-6 my-auto"> {/* <!-- Rechte Spieler abgelegt Karten -->*/}
                                    <div>
                                    {this.state != null && this.state.game != null &&
                                        this.state.game.players[2].droppedCards.map(cards => {
                                            return (<Card className="card overlap-v-20 d-block" name={cards.displayName} cardType={ItemTypes.DROPPEDCARD} />);
                                        }
                                        )
                                    }
                                    </div>
                                </div>
                                <div class="col-6 my-auto">
                                    <div> {/* <!-- Rechte Spieler verdeckte Karten  */}
                                    {/* <!--<img class="card d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />*/}
                                        {this.state != null && this.state.game != null &&
                                            this.state.game.players[2].playersTurn === true &&
                                            <p>Active player</p>
                                    }    
                                    {this.state != null && this.state.game != null &&
                                        this.getOpponentCards(this.state.game.players[2], false)
                                    }
                                    </div>
                                </div>
                                </div>
                            </div>
                        }
                    </div>
                </DndProvider>
            </div>

            
        )
    }
}