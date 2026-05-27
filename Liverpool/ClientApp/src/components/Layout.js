import React from 'react';
import NavMenu from './NavMenu';

function Layout(props) {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <NavMenu />
            {props.children}
        </div>
    );
}

export default Layout;
