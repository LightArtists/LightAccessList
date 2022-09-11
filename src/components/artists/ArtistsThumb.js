import { Button, Card, Col, Row } from "react-bootstrap";

export function ArtistThumb({ artist }) {
  return (
    <Card style={{ width: "18rem", margin: "15px", padding: 0 }}>
      <Card.Header>
        <Row>
          <Col lg={10}>
            <Card.Title className="img-title">{artist.name}</Card.Title>
            <p>{artist.nickname} {artist.website && <a href={artist.website} target="_blank">{artist.website}</a>}</p>
          </Col>
        </Row>
      </Card.Header>
      <Card.Img variant="top" src={artist.fullImageSrc} className="thumb-image" />
      <Card.Body>
        <Card.Text>
          <p>{artist.bio}</p>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="link" href={`https://light.art/artists/${artist.url}`}>
          View On Website
        </Button>
      </Card.Footer>
    </Card>
  );
}
