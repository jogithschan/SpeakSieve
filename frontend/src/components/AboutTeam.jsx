import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutTeam = () => {

  const team = [
    {
      name: 'Akshita Gupta',
      image: 'https://www.mahatmahome.gr/image/cache/placeholder-150x150.png',
      text: '2020491'
    },
    {
      name: 'Charvi Jindal',
      image: 'https://www.mahatmahome.gr/image/cache/placeholder-150x150.png',
      text: '2020045'
    },
    {
      name: 'Chetan',
      image: 'https://www.mahatmahome.gr/image/cache/placeholder-150x150.png',
      text: '2020046'
    },
    {
      name: 'Jogith S Chandran',
      image: 'https://www.mahatmahome.gr/image/cache/placeholder-150x150.png',
      text: '2020072'
    },
    {
      name: 'Shivam Agrawal',
      image: 'https://www.mahatmahome.gr/image/cache/placeholder-150x150.png',
      text: '2020124'
    },
    {
      name: 'Utkarsh Arora',
      image: 'https://www.mahatmahome.gr/image/cache/placeholder-150x150.png',
      text: '2020143'
    }
  ];

  return (

    <>
        <h1 style={{ paddingTop : 40 }}>About Team</h1>
        <Container className="my-5">
          <Row className="my-5">
            {team.map((person, index) => (
              <Col md={4} key={index}>
                <Card className="mb-4 hover-card" style={{ margin:40 }}>
                  <Card.Img variant="top" src={person.image} />
                  <Card.Body>
                    <Card.Title>{person.name}</Card.Title>
                    <Card.Text>{person.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
    </>

  )
}

export default AboutTeam