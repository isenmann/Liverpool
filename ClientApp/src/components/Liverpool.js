import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService'

export class Liverpool extends Component {
    static displayName = Liverpool.name;

  constructor(props) {
      super(props);
      this.state = { userName: '', userNames: [] };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);

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
    }

  componentDidMount() {
    LiverpoolService.getAllUsers();
  }

  handleChange(event) {
     this.setState({ userName: event.target.value });
  }

  handleSubmit(event) {
      event.preventDefault();
      LiverpoolService.setUserName(this.state.userName);
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
      </div>
    );
  }
}
