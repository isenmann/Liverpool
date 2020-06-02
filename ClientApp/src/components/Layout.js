import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
      return (
        <div className="h-100">
        <NavMenu />
          {this.props.children}
      </div>
    );
  }
}
