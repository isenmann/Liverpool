import React, {Component, Fragment} from 'react';
import CardNotDraggable from "./CardNotDraggable";

export default class KeepingCardQuestion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="d-flex justify-content-center">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Folg. Karte will der aktive Spieler behalten</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <CardNotDraggable className="card d-block"
                                                  name={this.props.cardName}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center">
                    <button onClick={this.props.positiveKeepFeedbackFunction}>
                        Erlauben
                    </button>
                    <button onClick={this.props.negativeKeepFeedbackFunction}>
                        Verweigern
                    </button>
                </div>
            </Fragment>
        )
    }
}