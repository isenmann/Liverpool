import React, { useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

import './NavMenu.css'

function NavMenu() {
  const [collapsed, setCollapsed] = useState(true);

  function toggleNavbar () {
    setCollapsed(!collapsed);
  }

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <NavbarBrand tag={Link} to="/">Liverpool</NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Liverpool">Lobby</NavLink>
              </NavItem>
            </ul>
          </Collapse>
      </Navbar>
    </header>
  );
}

export default NavMenu;