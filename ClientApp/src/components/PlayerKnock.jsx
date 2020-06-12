import React, {Component, Fragment} from 'react';
import {FormattedMessage} from "react-intl";

export default class PlayerKnock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="d-flex bg-danger justify-content-center">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col"><FormattedMessage id="game.knocked" /></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.playersKnocked.map((player) => (
                            <tr key={player + "knockTable"}>
                                <td>{player}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center">
                    <button onClick={this.props.sendPositiveKnockFunction}>
                        <FormattedMessage id="game.allow" />
                    </button>
                    {this.props.playersTurn === false &&
                    <button onClick={this.props.sendNegativeKnockFunction}>
                        <FormattedMessage id="game.deny" />
                    </button>
                    }
                </div>
            </Fragment>
        )
    }
}