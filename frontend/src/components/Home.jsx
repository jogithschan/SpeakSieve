import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Row, Col, Form, Collapse, Alert, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Home.css';
import { Dropdown } from 'react-bootstrap';


const Home = () => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [fileUploaded, setFileUploaded] = useState(false)
    const [transcriptionResult, setTranscriptionResult] = useState(null)
    const [processing, setProcessing] = useState(false)

    const [selectedModel, setSelectedModel] = useState('base')
    const [selectLanguage, setSelectLanguage] = useState('english')
    const [numberSpeakers, setNumberSpeakers] = useState(1)



    const handleModelSelect = (model) => {
        setSelectedModel(model);
      };

    const handleLanguageSelect = (language) => {
        setSelectLanguage(language);
      };

    const handleNumberSpeakersChange = (event) => {
        setNumberSpeakers(parseInt(event.target.value));
    };

      
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

                                <Row>
                                <Col style={{textAlign: 'left'}}>
                                    <Form.Label style={{ marginRight: '10px', fontSize: '1.1em', marginTop: '5px'}}>Model:</Form.Label>
                                </Col>
                                <Col>
                                    <Dropdown style={{width: '150px'}}>
                                            <Dropdown.Toggle variant="primary" id="model-dropdown" style={{width: '100%'}}>
                                                {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleModelSelect('tiny')}>Tiny</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleModelSelect('base')}>Base</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleModelSelect('small')}>Small</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleModelSelect('medium')}>Medium</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleModelSelect('large')}>Large</Dropdown.Item>
                                            </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                </Row>
                                <Row style={{ paddingTop: '10px' }}>
                                <Col style={{textAlign: 'left'}}>
                                    <Form.Label style={{ marginRight: '10px', fontSize: '1.1em', marginTop: '5px' }}>Language:</Form.Label>
                                </Col>
                                <Col>
                                    <Dropdown style={{width: '150px'}}>
                                            <Dropdown.Toggle variant="primary" id="language-dropdown" style={{width: '100%'}}>
                                                {selectLanguage.charAt(0).toUpperCase() + selectLanguage.slice(1)}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleLanguageSelect('english')}>English</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleLanguageSelect('any')}>Any</Dropdown.Item>
                                            </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                </Row>
                                <Row style={{ paddingTop: '10px', paddingBottom:'10px' }}>
                                <Col style={{textAlign: 'left'}}>
                                    <Form.Label style={{ marginRight: '10px', fontSize: '1.1em', marginTop: '5px' }}>Number of Speakers:</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control type="number" defaultValue={numberSpeakers} onChange={handleNumberSpeakersChange} />
                                </Col>
                                </Row>


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
