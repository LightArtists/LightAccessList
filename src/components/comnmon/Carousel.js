import NoImage from "../../assets/images/no-image.png";
import { Button, Card, Carousel, Col, Row } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import { useCallback } from "react";

export function CarouselComponent({ collection }) {
  const images = collection?.images || [];
  return (
    <Carousel fade>
      {images.map((image) => {
        return (
          <Carousel.Item>
            <img
              className="d-block img-carousel"
              src={image.smallImage}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>
                {image.title} / {image.artist}
              </h3>
              <p>image.description</p>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}
