import React, {Component, Fragment} from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DragDropContext } from 'react-beautiful-dnd';
import OpponentCards from './OpponentCards';
import DropAreaForDroppingCards from './DropAreaForDroppingCards';
import PlayerName from './PlayerName'
import Piles from './Piles'
import ScoreBoard from "./ScoreBoard";
import KeepingCardQuestion from "./KeepingCardQuestion";
import KeepingCard from "./KeepingCard";
import PlayerKnock from "./PlayerKnock";
import Player from "./Player"

export class Game extends Component {
    static displayName = Game.name;

    constructor(props) {
        super(props);
        this.handleNextRound = this.handleNextRound.bind(this);
        this.handleKnock = this.handleKnock.bind(this);
        this.sendPositiveKnockFeedback = this.sendPositiveKnockFeedback.bind(this);
        this.sendNegativeKnockFeedback = this.sendNegativeKnockFeedback.bind(this);
        this.sendNegativeKeepFeedback = this.sendNegativeKeepFeedback.bind(this);
        this.sendPositiveKeepFeedback = this.sendPositiveKeepFeedback.bind(this);

        LiverpoolService.registerGameUpdated((gameDto) => {
            this.setState({ game: gameDto });
        });

        LiverpoolService.connection.onreconnected(() => {
            LiverpoolService.reconnectUser(this.state.game.name, this.state.game.player.name);
        });
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
        }
      };

    render() {
        return (
            <div className="container-fluid h-100">
                {this.state != null && this.state.game != null && this.state.game.players != null &&
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="row h-100">
                        {/*  Left player  */}
                        <Fragment>
                            <div className="col-1 my-auto d-flex justify-content-center">
                                <div>
                                    <Fragment>
                                        <PlayerName player={this.state.game.players[0]}/>
                                        <OpponentCards player={this.state.game.players[0]} horizontal={false}/>
                                    </Fragment>
                                </div>
                            </div>
                            <div className="col-1 p-0">
                                <DropAreaForDroppingCards key={this.state.game.players[0]} player={this.state.game.players[0]} direction="vertical"/>
                            </div>
                        </Fragment>

                        <div className="col-8">
                            <div className="row h-33">
                                <div className="row w-100">
                                    {/*  Upper player */}
                                    <div className="col-12 my-auto">
                                        <OpponentCards design="d-flex justify-content-center"
                                                       player={this.state.game.players[1]} horizontal={true}/>
                                    </div>
                                    <div className="col-12 my-auto">
                                        <div className="d-flex justify-content-center">
                                            <DropAreaForDroppingCards key={this.state.game.players[1]} player={this.state.game.players[1]}
                                                                      direction="horizontal"/>
                                        </div>
                                    </div>
                                    <div className="col-12 my-auto w-100">
                                        <div className="d-flex justify-content-center">
                                            <PlayerName player={this.state.game.players[1]}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row h-33">
                                <div className="col-3 d-flex justify-content-center my-auto">
                                    <ScoreBoard playersRanked={this.state.game.playersRanked}/>
                                </div>
                                {/* Pile in the middle */}
                                <div className="col-6 my-auto">
                                    <Piles game={this.state.game} clickFunction={this.handleNextRound}/>
                                </div>
                                <div className="col-3 my-auto">
                                    {/* Ask for keeping a card instead of discard it */}
                                    {this.state.game.playerAskedForKeepingCard && !this.state.game.player.playersTurn &&
                                        <KeepingCardQuestion cardName={this.state.game.keepingCard.displayName}
                                                             positiveKeepFeedbackFunction={this.sendPositiveKeepFeedback}
                                                             negativeKeepFeedbackFunction={this.sendNegativeKeepFeedback} />
                                    }
                                    {/* Drop zone for asking to keep one card */}
                                    {this.state.game.player.playersTurn === true && this.state.game.playersKnocked != null && this.state.game.playersKnocked.length === 0 &&
                                        <KeepingCard keepingCard={this.state.game.keepingCard} askedForKeepingCard={this.state.game.playerAskedForKeepingCard}/>
                                    }
                                    {/* Accept or deny knocking */}
                                    {this.state.game.playersKnocked != null && this.state.game.playersKnocked.length > 0 &&
                                        <PlayerKnock playersKnocked={this.state.game.playersKnocked}
                                                     playersTurn={this.state.game.player.playersTurn}
                                                     sendPositiveKnockFunction={this.sendPositiveKnockFeedback}
                                                     sendNegativeKnockFunction={this.sendNegativeKnockFeedback}/>
                                    }
                                </div>
                            </div>

                            <div className="row h-33">
                                <div className="row w-100">
                                    <Player myCards={this.state.game.myCards} player={this.state.game.player} knockFunction={this.handleKnock}/>
                                </div>
                            </div>
                        </div>

                        {this.state.game.players.length === 3 &&
                            <Fragment>
                                {/* Right player */}
                                <div className="col-1 p-0">
                                    <DropAreaForDroppingCards key={this.state.game.players[2]} player={this.state.game.players[2]} direction="vertical"/>
                                </div>
                                <div className="col-1 my-auto d-flex justify-content-center">
                                    <div>
                                        <Fragment>
                                            <PlayerName player={this.state.game.players[2]}/>
                                            <OpponentCards player={this.state.game.players[2]} horizontal={false}/>
                                        </Fragment>
                                    </div>
                                </div>
                            </Fragment>
                        }
                    </div>
                </DragDropContext>
                }
            </div>
        )
    }
}