import React, { Component } from 'react';
import {FormattedMessage} from "react-intl";

export default class ScoreBoard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col"><FormattedMessage id="game.name" /></th>
                    <th scope="col"><FormattedMessage id="game.points" /></th>
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