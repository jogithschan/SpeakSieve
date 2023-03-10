import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Row, Col, Form, Collapse, Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const Home = () => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)
    const [fileUploaded, setFileUploaded] = useState(false)


    const updateSelectedFile = (e) => {
        setSelectedFile(e.target.files[0])
        console.log(selectedFile)
    }

    const updateFileUploaded = (e) => {

        if (selectedFile != null && selectedFile !== undefined) {
            setFileUploaded(true)

            const reader = new FileReader()
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                setFileUrl(reader.result);
            }
        }
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
                    <Col sm = {8}>
                        <Form>
                            <Form.Group className="mb-3" style={{ padding: 20}}>
                                <Form.Label>Choose an audio file</Form.Label>
                                <Form.Control type='file' onChange={updateSelectedFile} accept='audio/*'/>
                            </Form.Group>
                        </Form>
                        <div className="d-grid gap-2">
                            <Button variant="secondary" size="lg" onClick={ updateFileUploaded }>
                                Upload
                            </Button>
                        </div>

                        <Collapse in={fileUploaded}>

                            <div style={{padding:20}}>

                                <Alert key="success" variant='success'>
                                    File uploaded successfully!
                                </Alert>

                                <audio controls>
                                    <source src={fileUrl} type='audio/mpeg' />
                                </audio>
                            </div>
                        </Collapse>

                    </Col>
                    <Col></Col>
                </Row>

            </Col>
            <Col>
                <Card style={{ width: '25rem' }}>
                    <Card.Body>
                        <Card.Title>Group Number 2</Card.Title>
                        <Card.Text>
                            Group Members:
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>Akshita Gupta - 2020491</ListGroup.Item>
                        <ListGroup.Item>Charvi Jindal - 2020045</ListGroup.Item>
                        <ListGroup.Item>Chetan - 2020046</ListGroup.Item>
                        <ListGroup.Item>Jogith S Chandran - 2020072</ListGroup.Item>
                        <ListGroup.Item>Shivam Agrawal - 2020124</ListGroup.Item>
                        <ListGroup.Item>Utkarsh Arora - 2020143</ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        </Container>
    </div>
  )
}

export default Home