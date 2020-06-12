import React, {Component, Fragment} from 'react';
import DropAreaForDroppingCards from "./DropAreaForDroppingCards";
import DropArea from "./DropArea";
import {FormattedMessage} from "react-intl";

export default class Player extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="col-12 my-auto w-100">
                    <div className="d-flex justify-content-center">
                        {this.props.player.playersTurn === true &&
                            <b style={{ backgroundColor: 'green' }}><FormattedMessage id="game.you" /></b>
                        }
                        {this.props.player.playersTurn === false &&
                        <Fragment>
                            <FormattedMessage id="game.you" />
                            <div>
                                <button onClick={this.props.knockFunction}>
                                    <FormattedMessage id="game.knock" />
                                </button>
                            </div>
                        </Fragment>
                        }
                    </div>
                </div>
                <div className="col-12 my-auto w-100 justify-content-center">
                    {/* Dropped cards of player */}
                    <div className="d-flex justify-content-center">
                        <DropAreaForDroppingCards key={this.props.player.name} player={this.props.player}
                                                  direction="horizontal"/>
                    </div>
                </div>
                <div className="col-12 my-auto w-100">
                    {/* Player's cards*/}
                    <div className="d-flex justify-content-center">
                        {this.props.myCards != null &&
                        <DropArea id="playersCard" disableDrop={false}
                                  cards={this.props.myCards} direction="horizontal"/>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}