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

handleGameJoin(event) {
    event.preventDefault();
    LiverpoolService.joinGame(this.state.gameNameToCreateOrJoin);
}
  

  render() {
    return (
        <div>
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name: 
                     <input type="text" value={this.state.userName} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Users online</th>
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
       
            <form onSubmit={this.handleGameCreate}>
                <label>
                    Name:
                    <input type="text" value={this.state.gameNameToCreateOrJoin} onChange={this.handleGameCreateOrJoinChange} />
                </label>
                <input type="submit" value="Create game" />
            </form>

            <form onSubmit={this.handleGameJoin}>
                <input type="submit" value="Join game" />
            </form>
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Not started games</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.notStartedGames.map(game =>
                        <tr key={game.name}>
                            <td>{game.name}</td>
                            <td>{game.gameStarted}</td>
                            <td>{game.players}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
  }
}
