import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Row, Col, Form, Collapse, Alert, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const Home = () => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [fileUploaded, setFileUploaded] = useState(false)
    const [transcriptionResult, setTranscriptionResult] = useState(null)
    const [processing, setProcessing] = useState(false)

    const updateSelectedFile = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const updateFileUploaded = (e) => {
        if (selectedFile != null && selectedFile !== undefined) {
            setFileUploaded(true)
            const reader = new FileReader()
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                sendAudioFile(selectedFile, reader.result)
            }
        }
    }

    const sendAudioFile = async (file, fileData) => {
        const data = {
            fileName: selectedFile.name,
            fileData: fileData
        };

        setProcessing(true)

        try {
            const response = await axios.post('http://localhost:8000/process_audio', data)
            setTranscriptionResult(response.data.transcription)
        } catch (error) {
            console.error(error)
        }

        setProcessing(false)
    }

    return (
        <div>
            <h1 style={{ padding : 40 }}>Information Retrieval from Audio Files</h1>
            <Container>
                <Row>
                    <Col>
                        <h4>Upload Audio</h4>

                        <Row>
                            <Col></Col>
                            <Col sm={5}>
                                <Form>
                                    <Form.Group className="mb-3" style={{ padding: 20}}>
                                        <Form.Label>Choose an audio file</Form.Label>
                                        <Form.Control type='file' onChange={updateSelectedFile} accept='audio/*' />
                                    </Form.Group>
                                </Form>
                                <div className="d-grid gap-2">
                                    <Button variant="secondary" size="lg" onClick={ updateFileUploaded }>
                                        Upload
                                    </Button>
                                </div>

                                <Collapse in={fileUploaded}>

                                    <div style={{padding:20}}>

                                        {processing && (
                                            <div>
                                                <Spinner animation="border" variant="primary" />
                                                <p>Processing audio...</p>
                                            </div>
                                        )}

                                        {!processing && (
                                            <div>
                                                <Alert key="success" variant='success'>
                                                    File uploaded successfully!
                                                </Alert>

                                                {transcriptionResult && (
                                                    <p>Transcription: {transcriptionResult}</p>
                                                )}

                                                <audio controls>
                                                    <source src={selectedFile} type='audio/mpeg' />
                                                </audio>
                                            </div>
                                        )}

                                    </div>
                                </Collapse>

                            </Col>
                            <Col></Col>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home
