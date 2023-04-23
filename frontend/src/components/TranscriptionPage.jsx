import React from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Row, Col, Container } from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { Form} from 'react-bootstrap';
import { ButtonGroup } from "react-bootstrap";
import axios from 'axios';
import { Alert } from 'react-bootstrap';

const TranscriptionPage = () => {

  const location = useLocation();
  const { transcriptionResult, fileLocationOs } = location.state;
  const data = JSON.parse(transcriptionResult);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [extractInputValue, setExtractInputValue] = useState('');
  const [dialogueInputValue, setDialogueInputValue] = useState('');
  

  const [showFilterAudioForm, setShowFilterAudioForm] = useState(false);
  const [showExtractPhrasesForm, setShowExtractPhrasesForm] = useState(false);
  const [showGetAllDialoguesForm, setShowGetAllDialoguesForm] = useState(false);

  const [showTranscriptionResult, setShowTranscriptionResult] = useState(true)
  const [showFilterAudioResult, setShowFilterAudioResult] = useState(false)
  const [showExtractPhrasesResult, setShowExtractPhrasesResult] = useState(false)
  const [showGetDialogueResult, setShowGetDialogueResult] = useState(false)

  const [finalExtractPhrasesResult, setFinalExtractPhrasesResult] = useState(null)
  const [finalFilterAudioResult, setFinalFilterAudioResult] = useState(null)
  const [finalGetResultDial, setFinalGetResultDial] = useState(null)
  const [finalAudioPath, setFinalAudioPath] = useState(null)



  const handleFilterAudioClick = () => {
    setShowFilterAudioForm(true);
    setShowExtractPhrasesForm(false);
    setShowGetAllDialoguesForm(false);
  };

  const handleExtractPhrasesClick = () => {
    setShowFilterAudioForm(false);
    setShowExtractPhrasesForm(true);
    setShowGetAllDialoguesForm(false);
  };

  const handleGetAllDialoguesClick = () => {
    setShowFilterAudioForm(false);
    setShowExtractPhrasesForm(false);
    setShowGetAllDialoguesForm(true);
  };

  const handleChangeExtract = (e) => {
    console.log(e.target.value)
    setExtractInputValue(e.target.value)
  }

  const handleExtractPhraseClick = async (e) => {
    console.log(extractInputValue)
    const data = {
      "phrase":extractInputValue
    }

    try {
      const response = await axios.post('http://localhost:8000/extract_phrases', data)
      // console.log(response.data.search_result)
      
      const searchResult =  response.data.search_result
      if (response.data.search_result[0].STATUS) {
        alert("Success! Results found")
        const modifiedResultArray = JSON.parse(transcriptionResult)

        for (let i=1; i<searchResult.length; i++) {

          const index = searchResult[i].index[0]
          const start = searchResult[i].index[1]
          const stop = searchResult[i].index[2]

          // console.log(modifiedResultArray[index].text)
          const text = modifiedResultArray[index].text.split(' ')
          const boldText = text.map((word, wordIndex) => {
            if (wordIndex >= start && wordIndex <= stop) {
              return `<b>${word}</b>`
            } else {
              return word
            }
          })

          const modifiedText = boldText.join(' ')
          modifiedResultArray[index].text = modifiedText
        }

        // console.log(modifiedResultArray)
        setFinalExtractPhrasesResult(modifiedResultArray)
        setShowTranscriptionResult(false)
        setShowFilterAudioResult(false)
        setShowGetDialogueResult(false)
        setShowExtractPhrasesResult(true)

      } else {
        alert("No result found")
      }

    } catch (error) {
      console.error(error)
    }
    
  }

  const handleFilterForm = (e) => {
    console.log(e.target.value)
    setFilterInputValue(e.target.value)
  }

  const handleFilterFormClick = async (e) => {
    console.log(filterInputValue)

    const data = {
      "phrase": filterInputValue
    }

    try {
      const response = await axios.post('http://localhost:8000/voice_filter', data)
      const result = response.data.filter_result

      if (result[0].STATUS) {
        alert("Filter successful")
        const fullPath = result[1].Name 
        const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);

        setFinalFilterAudioResult(fileName)
        setShowTranscriptionResult(false)
        setShowFilterAudioResult(true)
        setShowGetDialogueResult(false)
        setShowExtractPhrasesResult(false)

      } else {
        alert("Cannot filter/Not found")
      }

    } catch (error) {
      console.error(error)
    }

  }

  const handleAllDialogueForm = (e) => {
    console.log(e.target.value)
    setDialogueInputValue(e.target.value)
  }

  const handleAllDialogueFormButtonClick = async (e) => {
    console.log(dialogueInputValue)

    const data = {
      "speaker_num" : dialogueInputValue
    }
    const response = await axios.post('http://localhost:8000/get_all', data)

    setFinalAudioPath(response.data.audio_name)
    setFinalGetResultDial(JSON.parse(response.data.final_result))

    setShowTranscriptionResult(false)
    setShowFilterAudioResult(false)
    setShowGetDialogueResult(true)
    setShowExtractPhrasesResult(false)
  }




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

          <div style={{ paddingBottom: "40px" }}>
          <h5>What would you like to do?</h5>
          <ButtonGroup className="d-flex w-100">
            <Button variant="dark" size="lg" onClick={handleFilterAudioClick}>
              Filter Audio
            </Button>
            <Button
              variant="dark"
              size="lg"
              onClick={handleExtractPhrasesClick}
            >
              Extract Phrases
            </Button>
            <Button
              variant="dark"
              size="lg"
              onClick={handleGetAllDialoguesClick}
            >
              Get All Monologues
            </Button>
          </ButtonGroup>

          {showFilterAudioForm && (
            <Form style={{ marginTop: "20px" }}>
            <Form.Group controlId="formFilterAudio">
              <Form.Label style={{ display: 'inline-block', width: '150px', marginRight: '20px', fontWeight:'bold'}}>Filter Audio:</Form.Label>
              <Form.Control style={{ display: 'inline-block', width: 'calc(100% - 200px)' }} type="text" placeholder="Enter filter text" onChange={handleFilterForm}/>
            </Form.Group>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
              <Button variant="success" style={{ width: '50%' }} onClick={handleFilterFormClick} >
                Submit
              </Button>
              <div style={{ width: '5%'}}></div>
              <Button variant="danger" style={{ width: '45%' }} type="reset">
                Reset
              </Button>
            </div>
          </Form>
          )}

          {showExtractPhrasesForm && (
            <Form style={{ marginTop: "20px" }}>
            <Form.Group controlId="formExtractPhrases">
              <Form.Label style={{ display: 'inline-block', width: '150px', marginRight: '20px', fontWeight:'bold'}}>Extract Phrases:</Form.Label>
              <Form.Control style={{ display: 'inline-block', width: 'calc(100% - 200px)' }} type="text" placeholder="Enter extract text" onChange={handleChangeExtract} />
            </Form.Group>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
              <Button variant="success" style={{ width: '50%' }} onClick={handleExtractPhraseClick}>
                Submit
              </Button>
              <div style={{ width: '5%'}}></div>
              <Button variant="danger" style={{ width: '45%' }} type="reset">
                Reset
              </Button>
            </div>
          </Form>
          )}

          {showGetAllDialoguesForm && (
            <Form style={{ marginTop: "20px" }}>
            <Form.Group controlId="formGetAllDialogues">
              <Form.Label style={{ display: 'inline-block', width: '150px', marginRight: '20px', fontWeight:'bold'}}>Get All Dialogues:</Form.Label>
              <Form.Control style={{ display: 'inline-block', width: 'calc(100% - 200px)' }} type="text" pattern="[0-9]*" placeholder="Enter speaker number" onChange={handleAllDialogueForm}/>
            </Form.Group>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
              <Button variant="success" style={{ width: '50%' }} onClick={handleAllDialogueFormButtonClick}>
                Submit
              </Button>
              <div style={{ width: '5%'}}></div>
              <Button variant="danger" style={{ width: '45%' }} type="reset">
                Reset
              </Button>
            </div>
          </Form>


          )}

          <div style={{ paddingTop: '20px', paddingBottom: '10px' }}>
            <Button className="d-flex justify-content-center align-items-center w-100"
              variant='dark'
              onClick={() => {
                setShowTranscriptionResult(true);
                setShowFilterAudioResult(false);
                setShowGetDialogueResult(false);
                setShowExtractPhrasesResult(false);
              }}
              >
              Show Original Text
            </Button>
          </div>

        </div>

        {showTranscriptionResult && (
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
        )}

        {showExtractPhrasesResult && (
          <>
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
              {finalExtractPhrasesResult.map((item, index) => {
                // Replace speaker names with desired values
                const speaker = item.speaker.replace("SPEAKER ", "Speaker ");
                return (
                  <tr key={index}>
                    <td style={{ width: '15%' }}>{speaker}</td>
                    <td style={{ width: '15%' }}>{parseFloat(item.start_time).toFixed(2)}</td>
                    <td style={{ width: '15%' }}>{parseFloat(item.end_time).toFixed(2)}</td>
                    <td style={{ width: '50%', textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: item.text }}></td>
                    <td style={{ width: '10%' }}>
                      <ReactAudioPlayer src={`http://localhost:8000/audio/${item.audio_file}`} controls />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          </>
        )}

        { showFilterAudioResult && (
          <>
          <Alert key="success" variant='success'>Filtered Results are here!</Alert>
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px'}}>
            <h3 style={{ padding: '20px 50px 20px 200px' }}>Filtered Audio</h3>
            <ReactAudioPlayer src={`http://localhost:8000/audio/${finalFilterAudioResult}`} controls />
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
          </>
        )}

        {showExtractPhrasesResult && (
          <>
          <Alert key="success" variant='success'>Extracted Phrases</Alert>
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
              {finalExtractPhrasesResult.map((item, index) => {
                // Replace speaker names with desired values
                const speaker = item.speaker.replace("SPEAKER ", "Speaker ");
                return (
                  <tr key={index}>
                    <td style={{ width: '15%' }}>{speaker}</td>
                    <td style={{ width: '15%' }}>{parseFloat(item.start_time).toFixed(2)}</td>
                    <td style={{ width: '15%' }}>{parseFloat(item.end_time).toFixed(2)}</td>
                    <td style={{ width: '50%', textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: item.text }}></td>
                    <td style={{ width: '10%' }}>
                      <ReactAudioPlayer src={`http://localhost:8000/audio/${item.audio_file}`} controls />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          </>
        )}

        { showGetDialogueResult && (
          <>
          <Alert key="success" variant='success'>Got all dialogues!</Alert>
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px'}}>
            <h3 style={{ padding: '20px 50px 20px 200px' }}>Speaker Audio</h3>
            <ReactAudioPlayer src={`http://localhost:8000/audio/${finalAudioPath}`} controls />
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
              {finalGetResultDial.map((item, index) => {
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
          </>
        )}

          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
};

export default TranscriptionPage;
