import React from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Row, Col, Container } from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { Form
 } from 'react-bootstrap';
const TranscriptionPage = () => {

  const location = useLocation();
  const { transcriptionResult, fileLocationOs } = location.state;
  const data = JSON.parse(transcriptionResult);
  const [cardBody, setCardBody] = useState(<p>Please select an option above.</p>);
  const [inputValue, setInputValue] = useState('');

  const handleFilteringAudiosClick = () => {
    setCardBody(
      <>
        <Form>
          <Form.Group controlId="filteringAudiosInput">
            <Form.Label>Enter filter text:</Form.Label>
            <Form.Control type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={() => console.log(`Filtering audios with value: ${inputValue}`)}>Filter</Button>
        </Form>
      </>
    );
  };

  const handleExtractPhraseClick = () => {
    setCardBody(
      <>
        <Form>
          <Form.Group controlId="extractPhraseInput">
            <Form.Label>Enter phrase to extract:</Form.Label>
            <Form.Control type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={() => console.log(`Extracting phrase: ${inputValue}`)}>Extract</Button>
        </Form>
      </>
    );
  };

  const handleAllDialoguesClick = () => {
    setCardBody(
      <>
        <Form>
          <Form.Group controlId="allDialoguesInput">
            <Form.Label>Enter speaker name:</Form.Label>
            <Form.Control type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={() => console.log(`Getting all dialogues for speaker: ${inputValue}`)}>Get Dialogues</Button>
        </Form>
      </>
    );
  };

  return (
    <>
      <h1 style={{ padding:"20px"}}>Transcription Results</h1>
      <Container>
          <Row>
          <Col></Col>
          <Col md={10}>
  
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px'}}>
            <h3 style={{ padding: '20px 50px 20px 200px' }}>Original Audio</h3>
            <ReactAudioPlayer src={"http://localhost:8000/audio/original_audio.mp3"} controls />
          </div>

          <div style={{ paddingBottom: "20px"}}>
            <Card>
              <Card.Header>
                <Nav variant="tabs" defaultActiveKey="#filteringAudios">
                  <Nav.Item>
                    <Nav.Link onClick={handleFilteringAudiosClick}>Filtering Audios</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={handleExtractPhraseClick}>Extract Phrase</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={handleAllDialoguesClick}>All Dialogues of a Specific Speaker</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Card.Title>What would you like to do?</Card.Title>
                {cardBody}
              </Card.Body>
            </Card>
          </div>


            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Speaker</th>
                  <th style={{ width: '15%' }}>Start Time</th>
                  <th style={{ width: '15%' }}>End Time</th>
                  <th style={{ width: '50%' }}>Text</th>
                  <th style={{ width: '10%' }}>Audio</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  // Replace speaker names with desired values
                  const speaker = item.speaker.replace("SPEAKER ", "Speaker ");
                  return (
                    <tr key={index}>
                      <td style={{ width: '15%' }}>{speaker}</td>
                      <td style={{ width: '15%' }}>{parseFloat(item.start_time).toFixed(2)}</td>
                      <td style={{ width: '15%' }}>{parseFloat(item.end_time).toFixed(2)}</td>
                      <td style={{ width: '50%', textAlign: 'left' }}>{item.text}</td>
                      <td style={{ width: '10%' }}>
                        <ReactAudioPlayer src={`http://localhost:8000/audio/${item.audio_file}`} controls />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
};

export default TranscriptionPage;
