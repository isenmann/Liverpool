import React, { Fragment, useEffect, useRef, useState } from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DragDropContext } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import OpponentCards from './OpponentCards';
import DropAreaForDroppingCards from './DropAreaForDroppingCards';
import PlayerName from './PlayerName';
import Piles from './Piles';
import ScoreBoard from './ScoreBoard';
import KeepingCardQuestion from './KeepingCardQuestion';
import KeepingCard from './KeepingCard';
import PlayerKnock from './PlayerKnock';
import Player from './Player';
import FeltTable from './FeltTable';
import AnimatedCardFlyover from './AnimatedCardFlyover';

function Game() {
    const [game, setGame] = useState(undefined);
    const [pendingAnimation, setPendingAnimation] = useState(null);
    const pendingGameUpdateRef = useRef(null);
    const [showRoundEnd, setShowRoundEnd] = useState(false);
    const prevRoundFinishedRef = useRef(false);

    // Zone refs for card flyover animations
    const drawPileRef = useRef(null);
    const discardPileRef = useRef(null);
    const handRefs = useRef({});
    const dropZoneRefs = useRef({});

    function resolveRef(area) {
        if (!area) return null;
        if (area === 'drawPile') return drawPileRef;
        if (area === 'discardPile') return discardPileRef;
        if (area.startsWith('hand:')) {
            const name = area.slice(5);
            if (!handRefs.current[name]) handRefs.current[name] = { current: null };
            return handRefs.current[name];
        }
        if (area.startsWith('dropZone:')) {
            const key = area.slice(9); // "playerName:listIndex"
            if (!dropZoneRefs.current[key]) dropZoneRefs.current[key] = { current: null };
            return dropZoneRefs.current[key];
        }
        return null;
    }

    useEffect(() => {
        LiverpoolService.registerCardMovedAnimation((dto) => {
            // Own moves are already handled visually by DnD — skip animation
            if (dto.playerName === LiverpoolService.userName) return;
            setPendingAnimation(dto);
        });

        LiverpoolService.registerGameUpdated((gameDto) => {
            setPendingAnimation(current => {
                if (current) {
                    // Defer the game state update until animation completes
                    pendingGameUpdateRef.current = gameDto;
                    return current;
                }
                setGame(gameDto);
                return null;
            });
        });
    }, []);

    useEffect(() => {
        if (game && game.roundFinished && !prevRoundFinishedRef.current) {
            setShowRoundEnd(true);
            setTimeout(() => setShowRoundEnd(false), 1800);
        }
        prevRoundFinishedRef.current = game ? game.roundFinished : false;
    }, [game]);

    function handleAnimationComplete() {
        setPendingAnimation(null);
        if (pendingGameUpdateRef.current) {
            setGame(pendingGameUpdateRef.current);
            pendingGameUpdateRef.current = null;
        }
    }

    function handleNextRound() {
        LiverpoolService.nextRound(game.name);
    }

    function handleKnock() {
        LiverpoolService.knock(game.name);
    }

    function sendPositiveKnockFeedback() {
        LiverpoolService.knockFeedback(game.name, true);
    }

    function sendNegativeKnockFeedback() {
        LiverpoolService.knockFeedback(game.name, false);
    }

    function sendPositiveKeepFeedback() {
        LiverpoolService.keepCardFeedback(game.name, true);
    }

    function sendNegativeKeepFeedback() {
        LiverpoolService.keepCardFeedback(game.name, false);
    }

    function onDragEnd({ source, destination }) {
        if (!destination) return;

        if (source.droppableId === 'playersCard' && destination.droppableId === 'playersCard') {
            LiverpoolService.sortPlayerCards(game.name, source.index, destination.index);
            return;
        }

        if (source.droppableId === 'playersCard' && destination.droppableId === 'discardPile') {
            LiverpoolService.discardCard(game.name, game.myCards[source.index].displayName, source.index);
            return;
        }

        if (source.droppableId === 'playersCard' && destination.droppableId.includes('_card_dropped_')) {
            const name = destination.droppableId.split('_', 1);
            LiverpoolService.dropCardAtPlayer(game.name, game.myCards[source.index].displayName, source.index, name[0], destination.droppableId);
            return;
        }

        if (source.droppableId.includes('_card_dropped_') && destination.droppableId === 'playersCard') {
            const playerName = source.droppableId.split('_', 1);
            if (playerName[0] === game.player.name) {
                const index = source.droppableId.substring(source.droppableId.length - 1);
                const droppedCardsList = game.player.droppedCards[index];
                LiverpoolService.takeBackPlayersCard(game.name, droppedCardsList[source.index].displayName, index);
            }
            return;
        }

        if (source.droppableId === 'discardPile' && destination.droppableId === 'playersCard') {
            LiverpoolService.drawCardFromDiscardPile(game.name, game.discardPile.displayName);
            return;
        }

        if (source.droppableId === 'drawPile' && destination.droppableId === 'playersCard') {
            LiverpoolService.drawCardFromDrawPile(game.name);
            return;
        }

        if (source.droppableId === 'playersCard' && destination.droppableId === 'playerCardForAskingToKeep') {
            LiverpoolService.askToKeepCard(game.name, game.myCards[source.index].displayName, source.index);
        }
    }

    if (!game || game.players == null) return null;

    const hasRightPlayer = game.players.length === 3;

    function opponentHandRef(player) {
        return el => {
            if (!handRefs.current[player.name]) handRefs.current[player.name] = { current: null };
            handRefs.current[player.name].current = el;
        };
    }

    const leftPlayerSlot = (
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, width: '100%', justifyContent: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, alignSelf: 'center' }}>
                <PlayerName player={game.players[0]} />
                <OpponentCards player={game.players[0]} horizontal={false} handRef={opponentHandRef(game.players[0])} />
            </div>
            <DropAreaForDroppingCards player={game.players[0]} direction="vertical" dropZoneRefs={dropZoneRefs} />
        </div>
    );

    const topPlayerSlot = (
        <Fragment>
            <OpponentCards design="d-flex justify-content-center" player={game.players[1]} horizontal={true} handRef={opponentHandRef(game.players[1])} />
            <div style={{ width: '100%' }}>
                <DropAreaForDroppingCards player={game.players[1]} direction="horizontal" dropZoneRefs={dropZoneRefs} />
            </div>
            <div className="d-flex justify-content-center">
                <PlayerName player={game.players[1]} />
            </div>
        </Fragment>
    );

    const rightPlayerSlot = hasRightPlayer ? (
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, width: '100%', justifyContent: 'center', flex: 1 }}>
            <DropAreaForDroppingCards player={game.players[2]} direction="vertical" dropZoneRefs={dropZoneRefs} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, alignSelf: 'center' }}>
                <PlayerName player={game.players[2]} />
                <OpponentCards player={game.players[2]} horizontal={false} handRef={opponentHandRef(game.players[2])} />
            </div>
        </div>
    ) : null;

    const centerMidSlot = (
        <Fragment>
            <div style={{ flexShrink: 0 }}>
                <ScoreBoard playersRanked={game.playersRanked} />
            </div>
            <Piles
                game={game}
                clickFunction={handleNextRound}
                discardPileRef={discardPileRef}
                drawPileRef={drawPileRef}
            />
            <div style={{ width: 200, flexShrink: 0 }}>
                {game.playerAskedForKeepingCard && !game.player.playersTurn &&
                    <KeepingCardQuestion
                        cardName={game.keepingCard.displayName}
                        positiveKeepFeedbackFunction={sendPositiveKeepFeedback}
                        negativeKeepFeedbackFunction={sendNegativeKeepFeedback}
                    />
                }
                {game.player.playersTurn === true && game.playersKnocked != null && game.playersKnocked.length === 0 &&
                    <KeepingCard keepingCard={game.keepingCard} askedForKeepingCard={game.playerAskedForKeepingCard} />
                }
                {game.playersKnocked != null && game.playersKnocked.length > 0 &&
                    <PlayerKnock
                        playersKnocked={game.playersKnocked}
                        playersTurn={game.player.playersTurn}
                        sendPositiveKnockFunction={sendPositiveKnockFeedback}
                        sendNegativeKnockFunction={sendNegativeKnockFeedback}
                    />
                }
            </div>
        </Fragment>
    );

    const myHandRef = { current: null };
    handRefs.current[game.player.name] = myHandRef;

    const centerBottomSlot = (
        <Player
            myCards={game.myCards}
            player={game.player}
            knockFunction={handleKnock}
            handRef={el => { myHandRef.current = el; }}
        />
    );

    return (
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <FeltTable
                    leftPlayer={leftPlayerSlot}
                    topPlayer={topPlayerSlot}
                    rightPlayer={rightPlayerSlot}
                    centerMid={centerMidSlot}
                    centerBottom={centerBottomSlot}
                />
            </DragDropContext>

            <AnimatePresence>
                {pendingAnimation && (
                    <AnimatedCardFlyover
                        key={`${pendingAnimation.playerName}-${pendingAnimation.fromArea}-${Date.now()}`}
                        animDto={pendingAnimation}
                        fromRef={resolveRef(pendingAnimation.fromArea)}
                        toRef={resolveRef(pendingAnimation.toArea)}
                        onComplete={handleAnimationComplete}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showRoundEnd && (
                    <motion.div
                        key="round-end"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.75)',
                            zIndex: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <motion.h1
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: 2, duration: 0.5 }}
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                color: 'var(--gold-400)',
                                fontSize: 'clamp(2rem, 6vw, 4rem)',
                                textShadow: '0 4px 24px rgba(0,0,0,0.8)',
                                textAlign: 'center',
                            }}
                        >
                            <FormattedMessage id="game.roundFinished" defaultMessage="Round Complete!" />
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Game;
