import React from 'react'
import './AboutProject'
import './Home'
import './AboutTeam'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const CustomNavbar = () => {
  return (
    <>
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="/Home">SpeakSieve</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/Home">Home</Nav.Link>
                <Nav.Link href="/AboutProject">About Project</Nav.Link>
                <Nav.Link href="/AboutTeam">About Team</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    </>
  )
}

export default CustomNavbar