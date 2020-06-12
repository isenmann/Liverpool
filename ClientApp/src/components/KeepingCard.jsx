import React, {Component} from 'react';
import CardNotDraggable from "./CardNotDraggable";
import DropArea from "./DropArea";
import {FormattedMessage} from "react-intl";

export default class KeepingCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="d-flex justify-content-center">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">
                            <FormattedMessage id="game.keepingCard" />
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            {this.props.askedForKeepingCard ?
                                <CardNotDraggable className="card d-block"
                                                  name={this.props.keepingCard.displayName}/>
                                :
                                <DropArea id="playerCardForAskingToKeep" disableDrop={false}
                                          cards={this.props.keepingCard}
                                          direction="horizontal"/>
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}