import React, { Component } from 'react';
import CardNotDraggable from './CardNotDraggable';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col-12">
                    <h1>Willkommen zu Liverpool!</h1>
                    <p />
                    <h4>v1.2</h4>
                    <div className="d-flex justify-content-center">
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="AH" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="2H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="3H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="4H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="5H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="6H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="7H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="8H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="9H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="10H" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="JH" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="QH" />
                        <CardNotDraggable className="card_dropped overlap-h-20 d-block" name="KH" />
                    </div>
                    <p/>
                    <ul>
                        <li>um ein Spiel zu spielen, klickt oben rechts auf "Lobby"</li>
                        <li>danach Benutzername eingeben</li>
                        <li>Spielname vergeben und ein "Spiel erstellen" anklicken</li>
                        <li>sollte schon ein Spiel erstellt worden sein, dann einfach dieses Spiel beitreten</li>
                        <li>das Spiel kann gestartet werden, wenn mind. 3 Teilnehmer beigetreten sind</li>
                    </ul>
                    <p />   
                    <br />
                    <br />
                    Thanks to Chris Aguilar for the card images:
                    <br />
                    <b>Vectorized Playing Cards 3.1</b><br />
                    <a href="https://totalnonsense.com/open-source-vector-playing-cards" rel="noopener noreferrer" target="_blank">https://totalnonsense.com/open-source-vector-playing-cards</a> <br />
                    Copyright 2011,2020 - Chris Aguilar - conjurenation at gmail dot com <br />
                    Licensed under: LGPL 3.0 - <a href="https://www.gnu.org/licenses/lgpl-3.0.html" rel="noopener noreferrer" target="_blank">https://www.gnu.org/licenses/lgpl-3.0.html</a> <br />
                </div>
            </div>
        </div>
    );
  }
}
