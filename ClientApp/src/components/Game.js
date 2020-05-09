﻿import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DragDropContext } from 'react-beautiful-dnd';
import DropArea from './DropArea';
import CardNotDraggable from './CardNotDraggable';

export class Game extends Component {
    static displayName = Game.name;

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.gameName = params.name;
        this.handleNextRound = this.handleNextRound.bind(this);
        this.handleKnock = this.handleKnock.bind(this);
        this.sendPositiveKnockFeedback = this.sendPositiveKnockFeedback.bind(this);
        this.sendNegativeKnockFeedback = this.sendNegativeKnockFeedback.bind(this);
        this.sendNegativeKeepFeedback = this.sendNegativeKeepFeedback.bind(this);
        this.sendPositiveKeepFeedback = this.sendPositiveKeepFeedback.bind(this);

        LiverpoolService.registerGameUpdated((gameDto) => {
            this.setState({ game: gameDto });
        });
    }

    getOpponentCards = (player, horizontal) => {
        let content = [];
        let className = "card_dropped d-block";
        if (horizontal) {
            className += " overlap-h-65";
        } else {
            className += " overlap-v-105";
        }
        for (let i = 0; i < player.countofCards; i++) {
            if (i === 0) {
                content.push(<CardNotDraggable className="card_dropped d-block" name="back"/>);
            } else {
                content.push(<CardNotDraggable className={className} name="back"/>);
            }
            
        }
        return content;
    };

    getDropAreaForDroppingCards = (player, direction) => {
        var content = [];
        var height = "";
        let className = "d-flex col justify-content-center";

        if (direction === "vertical") {
            if (player.droppedCards.length === 2) {
                height = "h-50";
            }
            if (player.droppedCards.length === 3) {
                height = "h-33";
            }
            if (player.droppedCards.length === 4) {
                height = "h-25";
            }

            className = height + " d-flex w-100 justify-content-center";
        }

        for (var i = 0; i < player.droppedCards.length; i++) {
            var dropId = player.name + "_card_dropped_" + i;
            content.push(
                <div className={className}>
                    <DropArea id={dropId} disableDrop={false} cards={player.droppedCards[i]} direction={direction} />
            </div>
            );
        }
        return content;
    }

    handleNextRound() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.nextRound(this.state.game.name);
    }

    handleKnock() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.knock(this.state.game.name);
    }

    sendPositiveKnockFeedback(){
        if (this.state != null && this.state.game != null)
            LiverpoolService.knockFeedback(this.state.game.name, true);
    }

    sendNegativeKnockFeedback(){
        if (this.state != null && this.state.game != null)
            LiverpoolService.knockFeedback(this.state.game.name, false);
    }

    sendPositiveKeepFeedback() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.keepCardFeedback(this.state.game.name, true);
    }

    sendNegativeKeepFeedback() {
        if (this.state != null && this.state.game != null)
            LiverpoolService.keepCardFeedback(this.state.game.name, false);
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

        if (source.droppableId === "playersCard" && destination.droppableId.includes("_card_dropped_")) {
            var name = destination.droppableId.split("_", 1);
            LiverpoolService.dropCardAtPlayer(this.state.game.name, this.state.game.myCards[source.index].displayName, name[0], destination.droppableId);
            return;
        }

        if (source.droppableId.includes("_card_dropped_") && destination.droppableId === "playersCard") {
            var playerName = source.droppableId.split("_", 1);
            if (playerName[0] === this.state.game.player.name) {
                var index = source.droppableId.substring(source.droppableId.length - 1);
                var droppedCardsList = this.state.game.player.droppedCards[index];
                LiverpoolService.takeBackPlayersCard(this.state.game.name, droppedCardsList[source.index].displayName, index);
            }
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

        if (source.droppableId === "playersCard" && destination.droppableId === "playerCardForAskingToKeep") {
            LiverpoolService.askToKeepCard(this.state.game.name, this.state.game.myCards[source.index].displayName);
            return;
        }
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
            <div className="container-fluid h-100">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="row h-100">
                        <div className="col-1 my-auto d-flex justify-content-center"> 
                            <div>
                                <div className="text-center">
                                    {this.state != null && this.state.game != null && this.state.game.players[0].playersTurn === true &&
                                        <b style={{ backgroundColor: 'green' }}>{this.state.game.players[0].name}</b>
                                    }
                                    {this.state != null && this.state.game != null && this.state.game.players[0].playersTurn === false &&
                                        this.state.game.players[0].name
                                    }
                                </div>
                                <div className=""> {/* < !--Linker Spieler verdeckte Karten --> */}
                                    {this.state != null && this.state.game != null &&
                                        this.getOpponentCards(this.state.game.players[0], false)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-1 p-0">
                             {/* <!-- Linker Spieler abgelegten Karten -->*/}
                            {this.state != null && this.state.game != null && this.state.game.players != null && this.state.game.players[0] != null &&
                                this.getDropAreaForDroppingCards(this.state.game.players[0], "vertical")
                            }
                        </div>

                        <div className="col-8">
                            <div className="row h-33">
                                <div className="row w-100">
                                    <div className="col-12 my-auto"> {/* <!-- Oberer Spieler verdeckte Karten -->*/}
                                        <div className="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null &&
                                                this.getOpponentCards(this.state.game.players[1], true)
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12 my-auto">
                                        <div className="d-flex justify-content-center"> {/* <!-- Oberer Spieler abgelegten Karten -->*/}
                                        { this.state != null && this.state.game != null && this.state.game.players != null && this.state.game.players[1] != null &&
                                                this.getDropAreaForDroppingCards(this.state.game.players[1], "horizontal")
                                        }
                                        </div>
                                    </div>
                                    <div className="col-12 my-auto w-100">
                                        <div className="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null && this.state.game.players[1].playersTurn === true &&
                                               <b style={{ backgroundColor: 'green' }}>{this.state.game.players[1].name}</b>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.players[1].playersTurn === false &&
                                               this.state.game.players[1].name
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row h-33">
                                <div className="col-3 d-flex justify-content-center my-auto">
                                    {this.state != null && this.state.game != null &&
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Punkte</th>
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
                                <div className="col-6 my-auto"> {/* <!-- Stapel in der Mitte -->*/}
                                    <div className="d-flex justify-content-center">
                                        {this.state != null && this.state.game != null &&
                                            <b>Runde {this.state.game.round} ({this.state.game.mantra})</b>
                                        }
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        { this.state != null && this.state.game != null && this.state.game.discardPile != null &&
                                            <DropArea id="discardPile" disableDrop={false} cards={[this.state.game.discardPile]} direction="horizontal" />
                                        }
                                        { this.state != null && this.state.game != null &&
                                            <DropArea id="drawPile" disableDrop={true} direction="horizontal" />
                                        }

                                        {this.state != null && this.state.game != null && this.state.game.roundFinished && this.state.game.gameFinished === false &&
                                            <div className="d-flex justify-content-center">
                                                <button onClick={this.handleNextRound}>
                                                    Nächste Runde
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-3 my-auto">
                                    {/* Ask for keeping a card instead of discard it */}
                                    {this.state != null && this.state.game != null && this.state.game.playerAskedForKeepingCard && !this.state.game.player.playersTurn &&
                                        <>
                                        <div className="d-flex justify-content-center">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                    <th scope="col">Folg. Karte will der aktive Spieler behalten</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <CardNotDraggable className="card d-block" name={this.state.game.keepingCard.displayName}/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <button onClick={this.sendPositiveKeepFeedback}>
                                                Erlauben
                                            </button>
                                            <button onClick={this.sendNegativeKeepFeedback}>
                                                Verweigern
                                            </button>
                                            </div>
                                        </>
                                    }
                                    {/* Drop zone for asking to keep one card */}
                                    {this.state != null && this.state.game != null && this.state.game.player.playersTurn === true && this.state.game.playersKnocked != null && this.state.game.playersKnocked.length === 0 &&
                                        <div className="d-flex justify-content-center">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Karte hier ablegen um sie behalten zu wollen</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                    <td>
                                                        {this.state.game.playerAskedForKeepingCard ?
                                                            <CardNotDraggable className="card d-block" name={this.state.game.keepingCard.displayName}/>
                                                            :
                                                            <DropArea id="playerCardForAskingToKeep" disableDrop={false} cards={this.state.game.keepingCard} direction="horizontal" />
                                                        }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    {/* Accept or deny knocking */}
                                    {this.state != null && this.state.game != null && this.state.game.playersKnocked != null && this.state.game.playersKnocked.length > 0 &&
                                        <div className="d-flex bg-danger justify-content-center">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Geklopft</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.game.playersKnocked.map((player) => (
                                                        <tr>
                                                            <td>{player}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    {this.state != null && this.state.game != null && this.state.game.playersKnocked != null && this.state.game.playersKnocked.length > 0 &&
                                        <div className="d-flex justify-content-center">
                                                <button onClick={this.sendPositiveKnockFeedback}>
                                                    Erlauben
                                                </button>
                                                {this.state != null && this.state.game != null && this.state.game.playersKnocked != null && this.state.game.playersKnocked.length > 0 && this.state.game.player.playersTurn === false &&
                                                <button onClick={this.sendNegativeKnockFeedback}>
                                                    Verweigern
                                            </button>
                                            }
                                        </div>
                                    }
                                </div>  
                            </div>

                            <div className="row h-33">
                                <div className="row w-100">
                                    <div className="col-12 my-auto w-100">
                                        <div className="d-flex justify-content-center">
                                            {this.state != null && this.state.game != null && this.state.game.player.playersTurn === true &&
                                                <b style={{ backgroundColor: 'green' }}>Du</b>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.player.playersTurn === false &&
                                                <>Du</>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.player.playersTurn === false &&
                                                <button onClick={this.handleKnock}>
                                                    Klopfen
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12 my-auto w-100 justify-content-center">
                                        <div className="d-flex justify-content-center"> {/* <!-- Eigene abgelegt Karten -->*/}
                                            {this.state != null && this.state.game != null && this.state.game.player != null &&
                                                this.getDropAreaForDroppingCards(this.state.game.player, "horizontal")
                                            }
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 my-auto w-100">
                                        <div className="d-flex justify-content-center"> {/* <!-- Spielerhand -->*/}
                                            {this.state != null && this.state.game != null && this.state.game.myCards != null && this.state.game.myCards != null &&
                                                <DropArea id="playersCard" disableDrop={false} cards={this.state.game.myCards} direction="horizontal" />
                                            }
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>

                        {this.state != null && this.state.game != null && this.state.game.players.length === 3 &&
                            <>
                                <div className="col-1 p-0">
                                        {/* <!-- Rechter Spieler abgelegten Karten -->*/}
                                        {this.state != null && this.state.game != null && this.state.game.players != null && this.state.game.players[2] != null &&
                                            this.getDropAreaForDroppingCards(this.state.game.players[2], "vertical")
                                        }
                                </div>
                                <div className="col-1 my-auto d-flex justify-content-center">
                                    <div>
                                        <div className="text-center">
                                            {this.state != null && this.state.game != null && this.state.game.players[2].playersTurn === true &&
                                              <b style={{ backgroundColor: 'green' }}>{this.state.game.players[2].name}</b>
                                            }
                                            {this.state != null && this.state.game != null && this.state.game.players[2].playersTurn === false &&
                                              this.state.game.players[2].name
                                            }
                                        </div>
                                        <div className=""> {/* < !--Rechter Spieler verdeckte Karten --> */}
                                                {this.state != null && this.state.game != null &&
                                                    this.getOpponentCards(this.state.game.players[2], false)
                                                }
                                        </div>
                                    </div> 
                                </div>
                            </>
                        }
                    </div>
                </DragDropContext>
            </div>
        )
    }
}