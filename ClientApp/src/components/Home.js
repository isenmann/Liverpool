import React, { Component } from 'react';
import CardNotDraggable from './CardNotDraggable';
import ItemTypes from './ItemTypes'

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-12">
                    <h1>Willkommen zu Liverpool!</h1>
                    <p></p>
                    <div class="d-flex justify-content-center">
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="AH" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="2H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="3H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="4H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="5H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="6H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="7H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="8H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="9H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="10H" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="JH" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="QH" cardOnly={false} />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" cardType={ItemTypes.CARD} name="KH" cardOnly={false} />
                    </div>
                    <p></p>
                    <ul>
                        <li>um ein Spiel zu spielen, klickt oben rechts auf "Lobby"</li>
                        <li>danach Benutzername eingeben</li>
                        <li>Spielname vergeben und ein "Spiel erstellen" anklicken</li>
                        <li>sollte schon ein Spiel erstellt worden sein, dann einfach dieses Spiel beitreten</li>
                        <li>das Spiel kann gestartet werden, wenn mind. 3 Teilnehmer beigetreten sind</li>
                    </ul>
                </div>
            </div>
        </div>
    );
  }
}
