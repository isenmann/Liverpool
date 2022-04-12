import React, {Fragment, useEffect, useState} from 'react';
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

function Game() {
    const [game, setGame] = useState(undefined);

    useEffect(() => {
        LiverpoolService.registerGameUpdated((gameDto) => {
            setGame(gameDto);
        });
    }, []);

    function handleNextRound() {
        LiverpoolService.nextRound(game.name);
    }

    function handleKnock() {
        LiverpoolService.knock(game.name);
    }

    function sendPositiveKnockFeedback() {
        LiverpoolService.knockFeedback(game.name, true);
    }

    function sendNegativeKnockFeedback(){
        LiverpoolService.knockFeedback(game.name, false);
    }

    function sendPositiveKeepFeedback() {
        LiverpoolService.keepCardFeedback(game.name, true);
    }

    function sendNegativeKeepFeedback() {
        LiverpoolService.keepCardFeedback(game.name, false);
    }

    function onDragEnd({ source, destination }) {
        if (!destination) {
          return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId === "playersCard") {
            LiverpoolService.sortPlayerCards(game.name, source.index, destination.index);
            return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId === "discardPile") {
            LiverpoolService.discardCard(game.name, game.myCards[source.index].displayName, source.index);
            return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId.includes("_card_dropped_")) {
            var name = destination.droppableId.split("_", 1);
            LiverpoolService.dropCardAtPlayer(game.name, game.myCards[source.index].displayName, source.index, name[0], destination.droppableId);
            return;
        }

        if (source.droppableId.includes("_card_dropped_") && destination.droppableId === "playersCard") {
            var playerName = source.droppableId.split("_", 1);
            if (playerName[0] === game.player.name) {
                var index = source.droppableId.substring(source.droppableId.length - 1);
                var droppedCardsList = game.player.droppedCards[index];
                LiverpoolService.takeBackPlayersCard(game.name, droppedCardsList[source.index].displayName, index);
            }
            return;
        }

        if (source.droppableId === "discardPile" && destination.droppableId === "playersCard") {
            LiverpoolService.drawCardFromDiscardPile(game.name, game.discardPile.displayName);
            return;
        }

        if (source.droppableId === "drawPile" && destination.droppableId === "playersCard") {
            LiverpoolService.drawCardFromDrawPile(game.name);
            return;
        }

        if (source.droppableId === "playersCard" && destination.droppableId === "playerCardForAskingToKeep") {
            LiverpoolService.askToKeepCard(game.name, game.myCards[source.index].displayName, source.index);
        }
    };

    
    return (
        <div className="container-fluid h-100">
            {game && game.players != null &&
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="row h-100">
                    {/*  Left player  */}
                    <Fragment>
                        <div className="col-1 my-auto d-flex justify-content-center">
                            <div>
                                <Fragment>
                                    <PlayerName player={game.players[0]}/>
                                    <OpponentCards player={game.players[0]} horizontal={false}/>
                                </Fragment>
                            </div>
                        </div>
                        <div className="col-1 p-0">
                            <DropAreaForDroppingCards key={game.players[0]} player={game.players[0]} direction="vertical"/>
                        </div>
                    </Fragment>

                    <div className="col-8">
                        <div className="row h-33">
                            <div className="row w-100">
                                {/*  Upper player */}
                                <div className="col-12 my-auto">
                                    <OpponentCards design="d-flex justify-content-center"
                                                    player={game.players[1]} horizontal={true}/>
                                </div>
                                <div className="col-12 my-auto">
                                    <div className="d-flex justify-content-center">
                                        <DropAreaForDroppingCards key={game.players[1]} player={game.players[1]}
                                                                    direction="horizontal"/>
                                    </div>
                                </div>
                                <div className="col-12 my-auto w-100">
                                    <div className="d-flex justify-content-center">
                                        <PlayerName player={game.players[1]}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row h-33">
                            <div className="col-3 d-flex justify-content-center my-auto">
                                <ScoreBoard playersRanked={game.playersRanked}/>
                            </div>
                            {/* Pile in the middle */}
                            <div className="col-6 my-auto">
                                <Piles game={game} clickFunction={handleNextRound}/>
                            </div>
                            <div className="col-3 my-auto">
                                {/* Ask for keeping a card instead of discard it */}
                                {game.playerAskedForKeepingCard && !game.player.playersTurn &&
                                    <KeepingCardQuestion cardName={game.keepingCard.displayName}
                                                            positiveKeepFeedbackFunction={sendPositiveKeepFeedback}
                                                            negativeKeepFeedbackFunction={sendNegativeKeepFeedback} />
                                }
                                {/* Drop zone for asking to keep one card */}
                                {game.player.playersTurn === true && game.playersKnocked != null && game.playersKnocked.length === 0 &&
                                    <KeepingCard keepingCard={game.keepingCard} askedForKeepingCard={game.playerAskedForKeepingCard}/>
                                }
                                {/* Accept or deny knocking */}
                                {game.playersKnocked != null && game.playersKnocked.length > 0 &&
                                    <PlayerKnock playersKnocked={game.playersKnocked}
                                                    playersTurn={game.player.playersTurn}
                                                    sendPositiveKnockFunction={sendPositiveKnockFeedback}
                                                    sendNegativeKnockFunction={sendNegativeKnockFeedback}/>
                                }
                            </div>
                        </div>

                        <div className="row h-33">
                            <div className="row w-100">
                                <Player myCards={game.myCards} player={game.player} knockFunction={handleKnock}/>
                            </div>
                        </div>
                    </div>

                    {game.players.length === 3 &&
                        <Fragment>
                            {/* Right player */}
                            <div className="col-1 p-0">
                                <DropAreaForDroppingCards key={game.players[2]} player={game.players[2]} direction="vertical"/>
                            </div>
                            <div className="col-1 my-auto d-flex justify-content-center">
                                <div>
                                    <Fragment>
                                        <PlayerName player={game.players[2]}/>
                                        <OpponentCards player={game.players[2]} horizontal={false}/>
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

export default Game