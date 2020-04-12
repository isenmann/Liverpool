import React, { Component } from 'react';
import * as signalR from "@microsoft/signalr";

export class Liverpool extends Component {
    static displayName = Liverpool.name;

  constructor(props) {
      super(props);
      this.state = { userName: '', userNames: [] };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/liverpoolHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.start();
      connection.on("UserConnected", message => {
          this.setState({ userNames: message, userName: this.state.userName });
      });

      connection.on("UserDisconnected", (disconnectedUser, users) => {
          console.log(disconnectedUser);
          this.setState({ userNames: users, userName: this.state.userName });
      });

      connection.on("UserSetName", message => {
          this.setState({ userNames: message, userName: this.state.userName });
      });
    this.connection = connection;
  }

  handleChange(event) {
     this.setState({ userNames: this.state.userNames, userName: event.target.value });
  }

  handleSubmit(event) {
     event.preventDefault();
     this.connection.invoke("SetUserName", this.state.userName);
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
