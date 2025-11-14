import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import "./navBar.css"
import { Link } from 'react-router-dom';
/*import './oldCss/Site.css'
import './oldCss/bootstrap.css'
import './oldCss/FFHub.css'
*/
export default function NavBar() {

	return (
		<Navbar className='navbar' variant='dark'>
		<Container>
			<Navbar.Brand as={Link} to="/">The Fantasy Football Hub</Navbar.Brand>
			<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="navbar-nav">
				<Nav.Link  as={Link} to="/About">About</Nav.Link>
				<Nav.Link  as={Link} to="/guillotine">Guillotine</Nav.Link>

			</Nav>
			</Navbar.Collapse> 
		</Container>
		</Navbar>
	);
}
