import React, { Component } from 'react';
import LiverpoolService from '../services/LiverpoolHubService'

export class Game extends Component {
    static displayName = Game.name;

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.gameName = params.name;
    }

    render() {
        return (
            <div>
                <h1>Game {this.gameName} started</h1>
            </div>
        )
    }
}