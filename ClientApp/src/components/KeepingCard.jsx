import React, {Component} from 'react';
import CardNotDraggable from "./CardNotDraggable";
import DropArea from "./DropArea";

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
                        <th scope="col">Karte hier ablegen um sie behalten zu wollen</th>
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