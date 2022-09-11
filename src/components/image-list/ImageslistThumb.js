import NoImage from "../../assets/images/no-image.png";
import { Button, Card, Col, Row } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import { useCallback } from "react";

export function ImageThumb({ image, onRemove, onEdit, onDownloadIPFS }) {
  const onRemoveItem = useCallback(
    (item) => {
      onRemove(image.id);
    },
    [image, onRemove]
  );

  const onEditImage = useCallback(
    (item) => {
      onEdit(image);
    },
    [image, onEdit]
  );

  const onDownload = useCallback(
    () => {
      onDownloadIPFS(image);
    },
    [image, onDownloadIPFS]
  );

  return (
    <Card style={{ width: "18rem", margin: "15px", padding: 0 }}>
      <Card.Header>
        <Row>
          <Col lg={10}>
            <Card.Title className="img-title">{image.title}</Card.Title>
            <p>{image.artist}</p>
          </Col>
          <Col lg={2}>
            <CloseButton onClick={onRemoveItem} />
          </Col>
        </Row>
      </Card.Header>
      <Card.Img variant="top" src={image.smallImage} className="thumb-image" />
      <Card.Body>
        <p>{image.tags?.join(", ") || ""}</p>
      </Card.Body>
      <Card.Footer>
        <div className="d-grid gap-0 m-0 p-0">
          <Button variant="light" size="lg" onClick={onEditImage}>
            Edit
          </Button><Button variant="light" size="lg" onClick={onDownload}>
            Download IPFS JSON
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
