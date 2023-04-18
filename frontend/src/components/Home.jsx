import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Row, Col, Form, Collapse, Alert, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Home.css';

const Home = () => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [fileUploaded, setFileUploaded] = useState(false)
    const [transcriptionResult, setTranscriptionResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [buttonText, setButtonText] = useState(Language1);
    const [num_spe, set_num_spe] = useState(0);

    var Language1 = 'Language';
    var Size1 = '';
    var Number_Speakers = 0;

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

    const handleOpen1 = () => {
        setOpen1(!open1);
        setButtonText(Language1);

    };

    const  handleOpen2 = () => {
        setOpen2(!open2);
    }

    const LanguageEnglish = () => {
        // do something
        Language1 = 'English';
        // setButtonText('English');
        setOpen1(false);
    };

    const LanguageAny = () => {
        // do something
        Language1 = 'Any';
        setOpen1(false);
    };

    const SizeTiny = () => {
        // do something
        Size1 = 'Tiny';
        setOpen2(false);
    };

    const SizeBase = () => {
        // do something
        Size1 = 'Base';
        setOpen2(false);
    };

    const SizeSmall = () => {
        // do something
        Size1 = 'Small';
        setOpen2(false);
    };

    const SizeMedium = () => {
        // do something
        Size1 = 'Medium';
        setOpen2(false);
    };

    const SizeLarge = () => {
        // do something
        Size1 = 'Large';
        setOpen2(false);
    };

    // const Num_Speakers = () =>{
    //     Number_Speakers = num_spe;
    //     // console.log(Number_Speakers);
    // }

    const Num_Speakers = (e) => {
        set_num_spe(e.target.value)
        Number_Speakers = e.target.value;
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
                                    <div className="dropdown">
                                        <Button onClick={handleOpen1}>Language</Button>
                                        {open1 ?(
                                            <ul className="menu">
                                            <li className="menu-item">
                                                <Button onClick={LanguageEnglish}>English</Button>
                                            </li>
                                            <li className="menu-item">
                                                <Button onClick={LanguageAny}>Any</Button>
                                            </li>
                                            </ul>
                                            // setButtonText('clicked');
                                        ) : null}
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <div className="dropdown">
                                        <Button onClick={handleOpen2}>Model Size</Button>
                                        {open2 ? (
                                            <ul className="menu">
                                            <li className="menu-item">
                                                <Button onClick={SizeTiny}>Tiny</Button>
                                            </li>
                                            <li className="menu-item">
                                                <Button onClick={SizeBase}>Base</Button>
                                            </li>
                                            <li className="menu-item">
                                                <Button onClick={SizeSmall}>Small</Button>
                                            </li>
                                            <li className="menu-item">
                                                <Button onClick={SizeMedium}>Medium</Button>
                                            </li>
                                            <li className="menu-item">
                                                <Button onClick={SizeLarge}>Large</Button>
                                            </li>
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                                <div style={{ padding: 20}}>
                                    <form>
                                        <label>Number of Speakers:   
                                            <input type="number" value={num_spe} onChange={Num_Speakers} />
                                        </label>
                                    </form>
                                </div>

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
