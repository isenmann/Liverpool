import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DropArea from './DropArea';
import Card from './Card';
import ItemTypes from './ItemTypes'

export class Game extends Component {
    static displayName = Game.name;

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.gameName = params.name;

        LiverpoolService.registerGameUpdated((gameDto) => {
            this.setState({ game: gameDto });
        });
    }

    render() {

        let myCards = "";

        if (this.state !=null && this.state.game != null) {
            this.state.game.myCards.map(cards =>
                myCards = myCards + ' ' + cards.displayName
            )
        } else {
            myCards = "";
        }

        return (
            <div class="container-fluid h-100">
                <DndProvider backend={Backend}>
                    <div class="row h-100">
                        <div class="col-3 bg-danger">
                            <div class="row h-100 bg-success">
                                <div class="col-6 bg-dark my-auto">
                                    <div class=""> {/* < !--Linker Spieler verdeckte Karten --> */}
                                        <img class="card d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        <img class="card overlap-v-20 d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        <img class="card overlap-v-20 d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        <img class="card overlap-v-20 d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                    </div>
                                </div>
                                <div class="col-6 bg-danger my-auto">
                                    <div class=""> {/* <!-- Linker Spieler abgelegten Karten -->*/}
                                        <img class="card d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        <img class="card overlap-v-20 d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        <img class="card overlap-v-20 d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        <img class="card overlap-v-20 d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 bg-success">
                            <div class="row h-33 bg-warning">
                                <div class="row w-100">
                                    <div class="col-12 my-auto"> {/* <!-- Oberer Spieler verdeckte Karten -->*/}
                                        <div class="d-flex justify-content-center">
                                            <img class="card overlap-h-20" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                            <img class="card overlap-h-20" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                            <img class="card overlap-h-20" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        </div>
                                    </div>
                                    <div class="col-12 my-auto">
                                        <div class="d-flex justify-content-center"> {/* <!-- Oberer Spieler abgelegten Karten -->*/}
                                            <img class="card overlap-h-20" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                            <img class="card overlap-h-20" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                            <img class="card overlap-h-20" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                            <img class="card overlap-h-20" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                            <img class="card overlap-h-20" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row h-33">
                                <div class="col-12 my-auto"> {/* <!-- Stapel in der Mitte -->*/}
                                    <div class="d-flex justify-content-center bg-primary">
                                        <DropArea gameName={this.gameName} discard={true} ownDrop={false} />
                                        {this.state != null && this.state.game != null && this.state.game.discardPile != null &&
                                            <Card className="m-3 card" name={this.state.game.discardPile.displayName} cardType={ItemTypes.CARD} />                            
                                        }
                                        <Card className="m-3 card" name="back" cardType={ItemTypes.CARD}/>
                                    </div>
                                </div>
                            </div>

                            <div class="row h-33 bg-warning">
                                <div class="row w-100">
                                    <div class="col-12 my-auto">
                                        <div class="d-flex justify-content-center"> {/* <!-- Eigene abgelegt Karten -->*/}
                                            <DropArea gameName={this.gameName} discard={false} ownDrop={true} />
                                            {this.state != null && this.state.game != null &&
                                                this.state.game.player.droppedCards.map(cards => {
                                                    return (<Card className="overlap-h-20 card" name={cards.displayName} cardType={ItemTypes.DROPPEDCARD} />);
                                            }
                                            )
                                            }</div>
                                    </div>
                                    <div class="col-12 my-auto w-100">
                                        <div class="d-flex justify-content-center"> {/* <!-- Spielerhand -->*/}
                                            <DropArea gameName={this.gameName} discard={false} ownDrop={false} />
                                            {this.state != null && this.state.game != null &&
                                                this.state.game.myCards.map(cards => {
                                                    return (<Card className="overlap-h-20 card" name={cards.displayName} cardType={ItemTypes.CARD} />);
                                                    }
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-3 bg-dark">
                            <div class="row h-100 bg-success">
                                <div class="col-6 bg-danger my-auto"> {/* <!-- Rechte Spieler abgelegt Karten -->*/}
                                    <div>
                                        <img class="card d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        <img class="card overlap-v-20 d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        <img class="card overlap-v-20 d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                        <img class="card overlap-v-20 d-block" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/800px-Aceofspades.svg.png" />
                                    </div>
                                </div>
                                <div class="col-6 bg-dark my-auto">
                                    <div> {/* <!-- Rechte Spieler verdeckte Karten  */}
                                        <img class="card d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        <img class="card overlap-v-20 d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        <img class="card overlap-v-20 d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                        <img class="card overlap-v-20 d-block" src="https://i.pinimg.com/originals/62/ea/00/62ea0046d9b332d23393a714b160fa58.jpg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DndProvider>
            </div>

            
        )
    }
}