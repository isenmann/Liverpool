import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService'

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
          console.log(disconnectedUser);
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
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-6">
                    <form onSubmit={this.handleSubmit}>
                        <label class="col-6 my-auto">
                            Bitte Spielername eingeben:                              
                        </label>
                        <input class="col-4" type="text" value={this.state.userName} onChange={this.handleChange} />
                        <input class="col-2" type="submit" value="Senden" />
                    </form>

                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Spieler online</th>
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
                <div class="col-6">
                    <form onSubmit={this.handleGameCreate}>
                        <label class="col-6 my-auto">
                            Bitte Spielname eingeben:
                        </label>
                        <input class="col-4" type="text" value={this.state.gameNameToCreateOrJoin} onChange={this.handleGameCreateOrJoinChange} />
                        <input class="col-2" type="submit" value="Spiel erstellen" />
                    </form>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Nicht gestartete Spiele</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.notStartedGames.map(game =>
                                <tr key={game.name}>
                                    <td>{game.name}</td>
                                    <td>{game.gameStarted}</td>
                                    <td>{game.players.map(p => p.name)}</td>
                                    <td> <form onSubmit={this.handleGameJoin(game.name)}>
                                        <input type="submit" value="Spiel beitreten" />
                                    </form></td>
                                    <td> <form onSubmit={this.handleGameStart(game.name)}>
                                        <input type="submit" value="Spiel starten" />
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
