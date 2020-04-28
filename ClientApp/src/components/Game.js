import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DragDropContext } from 'react-beautiful-dnd';
import DropArea from './DropArea';
import Card from './Card';
import CardNotDraggable from './CardNotDraggable';
import ItemTypes from './ItemTypes'
import { move } from './Utils';

export class Game extends Component {
    static displayName = Game.name;

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.gameName = params.name;
        this.handleDropCards = this.handleDropCards.bind(this);
        this.handleNextRound = this.handleNextRound.bind(this);

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
                content.push(<CardNotDraggable className="card d-block" name="back" cardType={ItemTypes.DROPPEDCARD} />);
            } else {
                content.push(<CardNotDraggable className={className} name="back" cardType={ItemTypes.DROPPEDCARD}/>);
            }
            
        }
        return content;
    };

    handleDropCards() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.dropCards(this.state.game.name);
    }

    handleNextRound() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.nextRound(this.state.game.name);
    }

    onDragEnd = ({ source, destination }) => {
        if (!destination) {
          return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId === "playersCard") {
            LiverpoolService.sortPlayerCards(this.state.game.name, source.index, destination.index);
            return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId === "discardPile") {
            LiverpoolService.discardCard(this.state.game.name, this.state.game.myCards[source.index].displayName);
            return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId === "playersCard_dropped") {
            LiverpoolService.dropCardAtPlayer(this.state.game.name, this.state.game.myCards[source.index].displayName, this.state.game.player.name);
            return;
        }

        if (source.droppableId === "discardPile" && destination.droppableId === "playersCard") {
            LiverpoolService.drawCardFromDiscardPile(this.state.game.name, this.state.game.discardPile.displayName);
            return;           
        }

        if (source.droppableId === "drawPile" && destination.droppableId === "playersCard") {
            LiverpoolService.drawCardFromDrawPile(this.state.game.name);
            return;
        }

        if (source.droppableId === "playersCard" && (destination.droppableId == this.state.game.players[0].name || destination.droppableId == this.state.game.players[1].name || destination.droppableId == this.state.game.players[2].name)) {
            LiverpoolService.dropCardAtPlayer(this.state.game.name, this.state.game.myCards[source.index].displayName, destination.droppableId );
            return;
        }

        //this.setState(state => {
        //  return move(state, source, destination);
        //});
      };

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
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div class="row h-100">
                        <div class="col-2">
                            <div class="row h-100">
                                <div class="row h-99 my-auto">
                                    <div class="col-12 my-auto w-100">
                                        <div class="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null && this.state.game.players[0].playersTurn === true &&
                                                <b>{this.state.game.players[0].name}</b>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.players[0].playersTurn === false &&
                                                this.state.game.players[0].name
                                            }
                                        </div>
                                    </div>
                                    <div class="col-6 my-auto">
                                        <div class=""> {/* < !--Linker Spieler verdeckte Karten --> */}
                                            {this.state != null && this.state.game != null &&
                                                this.getOpponentCards(this.state.game.players[0], false)
                                            }
                                        </div>
                                    </div>
                                    <div class="col-6 my-auto">
                                        <div class=""> {/* <!-- Linker Spieler abgelegten Karten -->*/}
                                        { this.state != null && this.state.game != null && this.state.game.players != null && this.state.game.players[0] != null &&
                                                <DropArea id={this.state.game.players[0].name} disableDrop={false} gameName={this.gameName} discard={false} ownDrop={false} dropAreaOfPlayer={this.state.game.players[0].name} cards={this.state.game.players[0].droppedCards} direction="vertical" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-8">
                            <div class="row h-33">
                                <div class="row w-100">
                                    <div class="col-12 my-auto"> {/* <!-- Oberer Spieler verdeckte Karten -->*/}
                                        <div class="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null &&
                                                this.getOpponentCards(this.state.game.players[1], true)
                                            }
                                        </div>
                                    </div>
                                    <div class="col-12 my-auto">
                                        <div class="d-flex justify-content-center"> {/* <!-- Oberer Spieler abgelegten Karten -->*/}
                                        { this.state != null && this.state.game != null && this.state.game.players != null && this.state.game.players[1] != null &&
                                            <DropArea id={this.state.game.players[1].name} disableDrop={false} gameName={this.gameName} discard={false} ownDrop={false} dropAreaOfPlayer={this.state.game.players[1].name} cards={this.state.game.players[1].droppedCards} direction="horizontal" />
                                        }
                                        </div>
                                    </div>
                                    <div class="col-12 my-auto w-100">
                                        <div class="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null && this.state.game.players[1].playersTurn === true &&
                                                <b>{this.state.game.players[1].name}</b>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.players[1].playersTurn === false &&
                                                this.state.game.players[1].name
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row h-33">
                                <div class="col-3 d-flex justify-content-center my-auto">
                                    {this.state != null && this.state.game != null &&
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Points</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.game.playersRanked.map((player) => (
                                                <tr>
                                                    <td>{player.name}</td>
                                                    <td>{player.points}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    }
                                </div>  
                                <div class="col-6 my-auto"> {/* <!-- Stapel in der Mitte -->*/}
                                    <div class="d-flex justify-content-center">
                                    { this.state != null && this.state.game != null && this.state.game.discardPile != null &&
                                        <DropArea id="discardPile" disableDrop={false} gameName={this.gameName} discard={true} ownDrop={false} dropAreaOfPlayer="" cards={[this.state.game.discardPile]} direction="horizontal" />
                                    }
                                    { this.state != null && this.state.game != null &&
                                        <DropArea id="drawPile" disableDrop={true} gameName={this.gameName} discard={false} ownDrop={false} dropAreaOfPlayer="" direction="horizontal" />
                                    }
                                    {this.state != null && this.state.game != null && this.state.game.roundFinished &&
                                        <button onClick={this.handleNextRound}>
                                            Next round
                                        </button>
                                    }

                                    </div>
                                </div>
                                <div class="col-3 justify-content-center my-auto">
                                    {this.state != null && this.state.game != null &&
                                        <b>Round {this.state.game.round} ({this.state.game.mantra})</b>
                                    }
                                </div>
                            </div>

                            <div class="row h-33">
                                <div class="row w-100">
                                    <div class="col-12 my-auto w-100">
                                        <div class="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null && this.state.game.player.playersTurn === true &&
                                                <b>You</b>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.player.playersTurn === false &&
                                                <>You</>
                                            }
                                        </div>
                                    </div>
                                    <div class="col-12 my-auto">
                                        <div class="d-flex justify-content-center"> {/* <!-- Eigene abgelegt Karten -->*/}
                                            {this.state != null && this.state.game != null && this.state.game.player != null && this.state.game.player.droppedCards.length == 0 &&
                                                <button onClick={this.handleDropCards}>
                                                    Drop cards
                                                </button>
                                            }
                                            { this.state != null && this.state.game != null && this.state.game.player != null &&
                                                <DropArea id="playersCard_dropped" disableDrop={false} gameName={this.gameName} discard={false} ownDrop={true} dropAreaOfPlayer={this.state.game.player.name} cards={this.state.game.player.droppedCards} direction="horizontal" />
                                            }
                                        </div>
                                    </div>
                                    
                                        <div class="col-12 my-auto w-100">
                                            <div class="d-flex justify-content-center"> {/* <!-- Spielerhand -->*/}
                                                {this.state != null && this.state.game != null && this.state.game.myCards != null && this.state.game.myCards != null &&
                                                    <DropArea id="playersCard" disableDrop={false} gameName={this.gameName} discard={false} ownDrop={false} dropAreaOfPlayer="" cards={this.state.game.myCards} direction="horizontal" />
                                                }
                                            </div>
                                        </div>
                                   
                                </div>
                            </div>
                        </div>

                        {this.state != null && this.state.game != null && this.state.game.players.length === 3 &&
                            <div class="col-2">
                                <div class="row h-100">
                                    <div class="row h-99 my-auto">
                                        <div class="col-12 my-auto w-100">
                                            <div class="d-flex justify-content-center">
                                                {this.state != null && this.state.game != null && this.state.game.players[1].playersTurn === true &&
                                                    <b>{this.state.game.players[2].name}</b>
                                                }
                                                {this.state != null && this.state.game != null && this.state.game.players[1].playersTurn === false &&
                                                    this.state.game.players[2].name
                                                }
                                            </div>
                                        </div>
                                        <div class="col-6 my-auto"> {/* <!-- Rechte Spieler abgelegt Karten -->*/}
                                            <div>
                                                { this.state != null && this.state.game != null && this.state.game.players != null && this.state.game.players[2] != null &&
                                                    <DropArea id={this.state.game.players[2].name} disableDrop={false} gameName={this.gameName} discard={false} ownDrop={false} dropAreaOfPlayer={this.state.game.players[2].name} cards={this.state.game.players[2].droppedCards} direction="vertical" />
                                                }
                                            </div>
                                        </div>
                                        <div class="col-6 my-auto">
                                            <div> {/* <!-- Rechte Spieler verdeckte Karten  */}     
                                                {this.state != null && this.state.game != null &&
                                                    this.getOpponentCards(this.state.game.players[2], false)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </DragDropContext>
            </div>
        )
    }
}