import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import "./navBar.css"
/*import './oldCss/Site.css'
import './oldCss/bootstrap.css'
import './oldCss/FFHub.css'
*/
export default function NavBar() {

	return (
		<Navbar className='navbar' variant='dark'>
		<Container>
			<Navbar.Brand href="#home">The Fantasy Football Hub</Navbar.Brand>
			{/* <Navbar.Collapse id="basic-navbar-nav">
			<Nav className="navbar-nav">
				<Nav.Link href="#home">Home</Nav.Link>
				<Nav.Link href="#link">Link</Nav.Link>

			</Nav>
			</Navbar.Collapse> */}
		</Container>
		</Navbar>
	);
}
