import React from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Row, Col, Container } from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';


const TranscriptionPage = () => {

  const location = useLocation();
  const { transcriptionResult, fileLocationOs } = location.state;
  const data = JSON.parse(transcriptionResult);

  return (
    <>
      <h1 style={{ padding:"20px"}}>Transcription Results</h1>
      <Container>
          <Row>
          <Col></Col>
          <Col md={8}>
  
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px'}}>
            <h3 style={{ padding: '20px 50px 20px 50px' }}>Original Audio</h3>
            <ReactAudioPlayer src={"http://localhost:8000/audio/hailhydra3.mp3"} controls />
          </div>


            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Speaker</th>
                  <th style={{ width: '20%' }}>Start Time</th>
                  <th style={{ width: '50%' }}>Text</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  // Replace speaker names with desired values
                  const speaker = item.speaker.replace("SPEAKER ", "Speaker ");
                  return (
                    <tr key={index}>
                      <td style={{ width: '20%' }}>{speaker}</td>
                      <td style={{ width: '20%' }}>{item.start_time}</td>
                      <td style={{ width: '50%', textAlign: 'left' }}>{item.text}</td>
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
