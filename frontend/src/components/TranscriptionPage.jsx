import React from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';

const TranscriptionPage = () => {
  const location = useLocation();
  const { transcriptionResult } = location.state;
  const data = JSON.parse(transcriptionResult);

  return (
    <>
      <h1>Transcription Results</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Speaker</th>
            <th>Start Time</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.speaker}</td>
              <td>{item.start_time}</td>
              <td>{item.text}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TranscriptionPage;
