import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import logo from './money-talk.png';
import reportWebVitals from './reportWebVitals';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <STBNavBar />
    <App />
  </React.StrictMode>
);

function STBNavBar() {
  return (
    <Navbar expand="md" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
        <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
        />Split the Bill</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <HowToModal />
          </Nav>
          <Navbar.Text>
            Created by <a href="https://brandondemelo.com/">Brandon Demelo</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function HowToModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-secondary" size="sm" onClick={handleShow}>
        How to Use
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>How to Split the Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup as="ol" numbered>
            <ListGroup.Item>Input the number of people sharing the bill (Max 50)</ListGroup.Item>
            <ListGroup.Item>Input the bill total in XX.XX format. Ex. 10.99</ListGroup.Item>
            <ListGroup.Item>In the "Name" column, type in the name of the person for the row (optional)</ListGroup.Item>
            <ListGroup.Item>In the "Individual" column, input any costs that the person is responsible for individually (optional)</ListGroup.Item>
            <ListGroup.Item>The "Shared" column is the cost of the bill MINUS all individual costs divided by the number of people</ListGroup.Item>
            <ListGroup.Item>The calculated price for each individual is shown under the "Total/person" column</ListGroup.Item>

          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default HowToModal;
