import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

const Headers = () => {
  return (
    <>
      <Navbar className="bg-dark" style={{ height: '60px' }}>
        <Container>
          {/* Website Name */}
          <Navbar.Brand className="text-light fw-bold me-4">
            G-Gallery
          </Navbar.Brand>

          {/* Navigation Links */}
          <NavLink to="/" className="text-light text-decoration-none me-3">
            Home
          </NavLink>

          <NavLink
            to="/publicgalleryregister"
            className="text-light text-decoration-none me-3"
          >
            Register
          </NavLink>

          <Navbar.Collapse className="justify-content-end">
            {/* Right-aligned items can go here if needed */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Headers;
