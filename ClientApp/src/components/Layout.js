import React from 'react';
import NavMenu from './NavMenu';

function Layout(props){
  return (
      <div className="h-100">
      <NavMenu />
      {props.children}
    </div>
  );
}

export default Layout;
