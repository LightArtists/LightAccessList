import NoImage from "../../assets/images/no-image.png";
import {Badge, Button, Card, Col, Row} from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import { useCallback } from "react";

export function CollectionThumb({ collection, onRemove, onShow }) {
  const onRemoveItem = useCallback(
    (item) => {
      onRemove(collection.id);
    },
    [collection, onRemove]
  );

  const onShowMore = useCallback(
    (item) => {
      onShow(collection);
    },
    [collection, onShow]
  );

  const firstImage =
    collection.images && collection.images.length > 0
      ? collection.images[0]
      : { smallImage: NoImage };
  return (
    <Card style={{ width: "18rem", margin: "10px", padding: 0 }}>
      <Card.Header >
        <Row>
          <Col lg={10}>
            <Card.Title>{collection.name}</Card.Title>
            <p>{collection.categoryName}</p>
          </Col>
          <Col lg={2}>
            <CloseButton onClick={onRemoveItem} />
          </Col>
        </Row>
        {collection.isMain && <Badge bg="primary">Primary</Badge>}{' '}
        {collection.isRandom && <Badge bg="secondary">Random</Badge>}
      </Card.Header>
      <Card.Img
        variant="top"
        src={firstImage.smallImage}
        className="thumb-image"
      />
      <Card.Body>
        <Card.Title>
          {collection.images?.length || 0} / {collection.itemsCount} images
          loaded
        </Card.Title>
        <Card.Text>{collection.description}</Card.Text>
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" onClick={onShowMore}>
            Show More
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
