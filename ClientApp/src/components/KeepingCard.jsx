import React from 'react';
import CardNotDraggable from "./CardNotDraggable";
import DropArea from "./DropArea";
import {FormattedMessage} from "react-intl";

function KeepingCard({keepingCard, askedForKeepingCard}) {
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
                        {askedForKeepingCard ?
                            <CardNotDraggable className="card d-block"
                                                name={keepingCard.displayName}/>
                            :
                            <DropArea id="playerCardForAskingToKeep" disableDrop={false}
                                        cards={keepingCard}
                                        direction="horizontal"/>
                        }
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )    
}
export default KeepingCard;