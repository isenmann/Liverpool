import React, {Component, Fragment} from 'react';

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
                            <th scope="col">Geklopft</th>
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
                        Erlauben
                    </button>
                    {this.props.playersTurn === false &&
                    <button onClick={this.props.sendNegativeKnockFunction}>
                        Verweigern
                    </button>
                    }
                </div>
            </Fragment>
        )
    }
}