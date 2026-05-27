import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiverpoolService from '../services/LiverpoolHubService';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const sectionStyle = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(212,168,67,0.2)',
    borderRadius: 12,
    padding: '20px 24px',
    flex: 1,
};

const labelStyle = {
    color: 'var(--gold-400)',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: '1rem',
    marginBottom: 10,
    display: 'block',
};

function Liverpool() {
    const [userName, setUserName] = useState('');
    const [userNames, setUserNames] = useState([]);
    const [gameNameToCreateOrJoin, setgameNameToCreateOrJoin] = useState('');
    const [notStartedGames, setnotStartedGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        LiverpoolService.registerUserConnected((usernames) => setUserNames(usernames));
        LiverpoolService.registerUserDisconnected((_, users) => setUserNames(users));
        LiverpoolService.registerUserSetName((usernames) => setUserNames(usernames));
        LiverpoolService.registerGetAllUsers((usernames) => setUserNames(usernames));
        LiverpoolService.registerGameCreated((games) => setnotStartedGames(games));
        LiverpoolService.registerGameJoined((games) => setnotStartedGames(games));
        LiverpoolService.registerAllNotStartedGames((games) => setnotStartedGames(games));
        LiverpoolService.getAllUsers();
        LiverpoolService.getAllNotStartedGames();
    }, []);

    useEffect(() => {
        LiverpoolService.registerGameStarted((name) => {
            navigate('/game/' + name);
        });
    }, [navigate]);

    function handleSubmit(event) {
        event.preventDefault();
        LiverpoolService.setUserName(userName);
    }

    function handleGameCreate(event) {
        event.preventDefault();
        LiverpoolService.createGame(gameNameToCreateOrJoin);
    }

    function handleGameJoin(gameName) {
        return event => {
            event.preventDefault();
            LiverpoolService.joinGame(gameName);
        };
    }

    function handleGameStart(gameName) {
        return event => {
            event.preventDefault();
            LiverpoolService.startGame(gameName);
        };
    }

    return (
        <div style={{ flex: 1, padding: '24px 32px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--gold-400)',
                    fontSize: '1.8rem',
                    marginBottom: 20,
                }}
            >
                Lobby
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}
            >
                {/* Left column: Username + Players online */}
                <div style={{ ...sectionStyle, minWidth: 220, maxWidth: 300 }}>
                    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>
                            <FormattedMessage id="lobby.username" />
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                className="input-casino"
                                type="text"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                style={{ flex: 1, minWidth: 0 }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="btn-casino"
                                style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                            >
                                <FormattedMessage id="lobby.submit" />
                            </motion.button>
                        </div>
                    </form>

                    <div style={{ color: 'var(--gold-400)', fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
                        <FormattedMessage id="lobby.playersOnline" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {userNames.map(name => (
                            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--felt-500)', flexShrink: 0 }} />
                                <span style={{ color: 'var(--text-primary)', fontFamily: "'Lato', sans-serif", fontSize: '0.9rem' }}>
                                    {name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column: Games */}
                <div style={{ ...sectionStyle, minWidth: 300 }}>
                    <form onSubmit={handleGameCreate} style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>
                            <FormattedMessage id="lobby.enterGameName" />
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                className="input-casino"
                                type="text"
                                value={gameNameToCreateOrJoin}
                                onChange={e => setgameNameToCreateOrJoin(e.target.value)}
                                style={{ flex: 1, minWidth: 0 }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="btn-casino"
                                style={{ fontSize: '0.85rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
                            >
                                <FormattedMessage id="lobby.createGame" />
                            </motion.button>
                        </div>
                    </form>

                    <div style={{ color: 'var(--gold-400)', fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: '0.85rem', marginBottom: 10 }}>
                        <FormattedMessage id="lobby.notStartedGames" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {notStartedGames.map(game => (
                            <motion.div
                                key={game.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(212,168,67,0.25)',
                                    borderRadius: 8,
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: "'Lato', sans-serif", fontSize: '0.95rem' }}>
                                        {game.name}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: "'Lato', sans-serif", marginTop: 2 }}>
                                        {game.players.map(p => p.name).join(', ')}
                                    </div>
                                </div>
                                <form onSubmit={handleGameJoin(game.name)} style={{ margin: 0 }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="btn-casino"
                                        style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                                    >
                                        <FormattedMessage id="lobby.joinGame" />
                                    </motion.button>
                                </form>
                                <form onSubmit={handleGameStart(game.name)} style={{ margin: 0 }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="btn-casino"
                                        style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                                    >
                                        <FormattedMessage id="lobby.startGame" />
                                    </motion.button>
                                </form>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Liverpool;
