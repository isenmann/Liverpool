import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Liverpool } from './components/Liverpool';
import { Game } from './components/Game';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/Liverpool' component={Liverpool} />
        <Route path='/Game/:name' component={Game} />
      </Layout>
    );
  }
}
