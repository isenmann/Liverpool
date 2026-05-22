import React from 'react';
import NavMenu from './NavMenu';

function Layout(props) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavMenu />
            {props.children}
        </div>
    );
}

export default Layout;
