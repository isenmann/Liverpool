import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService'
import { FormattedMessage } from "react-intl";

export class Liverpool extends Component {
    static displayName = Liverpool.name;

  constructor(props) {
      super(props);
      this.state = { userName: '', userNames: [], gameNameToCreateOrJoin: '', notStartedGames: [] };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleGameCreateOrJoinChange = this.handleGameCreateOrJoinChange.bind(this);
      this.handleGameCreate = this.handleGameCreate.bind(this);
      this.handleGameJoin = this.handleGameJoin.bind(this);
      this.handleGameStart = this.handleGameStart.bind(this);

      LiverpoolService.registerUserConnected((usernames) => {
          this.setState({ userNames: usernames });
      });

      LiverpoolService.registerUserDisconnected((disconnectedUser, users) => {
          this.setState({ userNames: users });
      });

      LiverpoolService.registerUserSetName((usernames) => {
          this.setState({ userNames: usernames });
      });

      LiverpoolService.registerGetAllUsers((usernames) => {
          this.setState({ userNames: usernames });
      });

      LiverpoolService.registerGameCreated((games) => {
          this.setState({ notStartedGames: games });
      });

      LiverpoolService.registerGameJoined((games) => {
          this.setState({ notStartedGames: games });
      });

      LiverpoolService.registerGameStarted((name) => {
          this.props.history.push('/game/' + name);
      });

      LiverpoolService.registerAllNotStartedGames((games) => {
          this.setState({ notStartedGames: games });
      });
    }

  componentDidMount() {
      LiverpoolService.getAllUsers();
      LiverpoolService.getAllNotStartedGames();
  }

  handleChange(event) {
     this.setState({ userName: event.target.value });
    }

  handleSubmit(event) {
        event.preventDefault();
        LiverpoolService.setUserName(this.state.userName);
  }

  handleGameCreateOrJoinChange(event) {
      this.setState({ gameNameToCreateOrJoin: event.target.value });
  }

handleGameCreate(event) {
    event.preventDefault();
    LiverpoolService.createGame(this.state.gameNameToCreateOrJoin);
}

handleGameJoin(gameName) {
    return event => {
        event.preventDefault()
        LiverpoolService.joinGame(gameName);
    }
}

handleGameStart(gameName) {
    return event => {
        event.preventDefault()
        LiverpoolService.startGame(gameName);
    }
}

    render() {
    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col-6">
                    <form onSubmit={this.handleSubmit}>
                        <label className="col-6 my-auto">
                            <FormattedMessage id="lobby.username" />
                        </label>
                        <input className="col-4" type="text" value={this.state.userName} onChange={this.handleChange} />
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
                            {this.state.userNames.map(name =>
                                <tr key={name}>
                                    <td>{name}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="col-6">
                    <form onSubmit={this.handleGameCreate}>
                        <label className="col-6 my-auto">
                            <FormattedMessage id="lobby.enterGameName" />
                        </label>
                        <input className="col-4" type="text" value={this.state.gameNameToCreateOrJoin} onChange={this.handleGameCreateOrJoinChange} />
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
                            {this.state.notStartedGames.map(game =>
                                <tr key={game.name}>
                                    <td>{game.name}</td>
                                    <td>{game.gameStarted}</td>
                                    <td>{game.players.map(p => p.name + " ")}</td>
                                    <td> <form onSubmit={this.handleGameJoin(game.name)}>
                                        <FormattedMessage id="lobby.joinGame">
                                            { (value) =>
                                                <input type="submit" value={value} />
                                            }
                                        </FormattedMessage>
                                    </form></td>
                                    <td> <form onSubmit={this.handleGameStart(game.name)}>
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
  }
}