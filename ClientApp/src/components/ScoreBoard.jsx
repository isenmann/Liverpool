import React, { Component } from 'react';

export default class ScoreBoard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Punkte</th>
                </tr>
                </thead>
                <tbody>
                {this.props.playersRanked.map((player) => (
                    <tr key={player.name + "Ranked"}>
                        <td>{player.name}</td>
                        <td>{player.points}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}