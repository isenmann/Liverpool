import React, { useState, useEffect } from 'react';
import LiverpoolService from '../services/LiverpoolHubService'
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

function Liverpool() {
    const [userName, setUserName] = useState('');
    const [userNames, setUserNames] = useState([]);
    const [gameNameToCreateOrJoin, setgameNameToCreateOrJoin] = useState('');
    const [notStartedGames, setnotStartedGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        LiverpoolService.registerUserConnected((usernames) => {
            setUserNames(usernames);
        });
    
        LiverpoolService.registerUserDisconnected((disconnectedUser, users) => {
            setUserNames(users);
        });
    
        LiverpoolService.registerUserSetName((usernames) => {
            setUserNames(usernames);
        });
    
        LiverpoolService.registerGetAllUsers((usernames) => {
            setUserNames(usernames);
        });
    
        LiverpoolService.registerGameCreated((games) => {
            setnotStartedGames(games);
        });
    
        LiverpoolService.registerGameJoined((games) => {
            setnotStartedGames(games);
        });
    
        LiverpoolService.registerAllNotStartedGames((games) => {
            setnotStartedGames(games);
        });
    
        LiverpoolService.getAllUsers();
        LiverpoolService.getAllNotStartedGames();
    }, []);

    useEffect(() => {
        LiverpoolService.registerGameStarted((name) => {
            navigate('/game/' + name);
        });
    }, [navigate]);

    function handleChange(event)  {
        setUserName(event.target.value);
    };

    function handleSubmit(event) {
            event.preventDefault();
            LiverpoolService.setUserName(userName);
    };

    function handleGameCreateOrJoinChange(event) {
        setgameNameToCreateOrJoin(event.target.value);
    };

    function handleGameCreate(event) {
        event.preventDefault();
        LiverpoolService.createGame(gameNameToCreateOrJoin);
    };

    function handleGameJoin(gameName) {
        return event => {
            event.preventDefault()
            LiverpoolService.joinGame(gameName);
        }
    };

    function handleGameStart(gameName) {
        return event => {
            event.preventDefault()
            LiverpoolService.startGame(gameName);
        }
    };

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col-6">
                    <form onSubmit={handleSubmit}>
                        <label className="col-6 my-auto">
                            <FormattedMessage id="lobby.username" />
                        </label>
                        <input className="col-4" type="text" value={userName} onChange={handleChange} />
                        <FormattedMessage id="lobby.submit">
                            { (value) =>
                                <input className="col-2" type="submit" value={value} />
                            }
                        </FormattedMessage>

                    </form>

                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="lobby.playersOnline" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userNames.map(name =>
                                <tr key={name}>
                                    <td>{name}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="col-6">
                    <form onSubmit={handleGameCreate}>
                        <label className="col-6 my-auto">
                            <FormattedMessage id="lobby.enterGameName" />
                        </label>
                        <input className="col-4" type="text" value={gameNameToCreateOrJoin} onChange={handleGameCreateOrJoinChange} />
                        <FormattedMessage id="lobby.createGame">
                            { (value) =>
                                <input className="col-2" type="submit" value={value} />
                            }
                        </FormattedMessage>
                    </form>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="lobby.notStartedGames" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {notStartedGames.map(game =>
                                <tr key={game.name}>
                                    <td>{game.name}</td>
                                    <td>{game.gameStarted}</td>
                                    <td>{game.players.map(p => p.name + " ")}</td>
                                    <td> <form onSubmit={handleGameJoin(game.name)}>
                                        <FormattedMessage id="lobby.joinGame">
                                            { (value) =>
                                                <input type="submit" value={value} />
                                            }
                                        </FormattedMessage>
                                    </form></td>
                                    <td> <form onSubmit={handleGameStart(game.name)}>
                                        <FormattedMessage id="lobby.startGame">
                                            { (value) =>
                                                <input type="submit" value={value} />
                                            }
                                        </FormattedMessage>
                                    </form></td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                </div>
            </div>
        </div>
    );
  };

  export default Liverpool;