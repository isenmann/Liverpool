import React, {Component, Fragment} from 'react';
import CardNotDraggable from "./CardNotDraggable";
import {FormattedMessage} from "react-intl";

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
                            <th scope="col">
                                <FormattedMessage id="game.keepingCardQuestion" />
                            </th>
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
                        <FormattedMessage id="game.allow" />
                    </button>
                    <button onClick={this.props.negativeKeepFeedbackFunction}>
                        <FormattedMessage id="game.deny" />
                    </button>
                </div>
            </Fragment>
        )
    }
}