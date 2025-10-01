import React, { Fragment } from 'react';
import CardNotDraggable from "./CardNotDraggable";
import { FormattedMessage } from "react-intl";

function KeepingCardQuestion({ cardName, positiveKeepFeedbackFunction, negativeKeepFeedbackFunction }) {
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
                                    name={cardName} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <button style={{ marginRight: 12, zIndex: 9999 }} onClick={positiveKeepFeedbackFunction}>
                    <FormattedMessage id="game.allow" />
                </button>
                <button style={{ zIndex: 9999 }} onClick={negativeKeepFeedbackFunction}>
                    <FormattedMessage id="game.deny" />
                </button>
            </div>
        </Fragment>
    )
}

export default KeepingCardQuestion;