import React, { useCallback, useEffect, useState } from "react";
import { ImageThumb } from "./ImageslistThumb";
import {Button, Col, Row} from "react-bootstrap";
import { useImageContext } from "../../modules/ImageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { ImageForm } from "./ImageForm";
import Files from "react-files";
import {toast} from "react-toast";
import CSVReader from "react-csv-reader";

const parseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

export function Images({ collection }) {
  const { images, removeImage, removeAllImages, saveChanges, saveIPFSData, saveImage, loadImagesFromCSV } =
    useImageContext();
  const [editingImage, setEditingImage] = useState({});
  const isNewImage = !editingImage.id && editingImage.id !== 0;

  const onAddImage = useCallback(() => {
    setEditingImage({
      collection: collection.name,
      subtitle: collection.name,
    });
  }, [setEditingImage]);

  useEffect(() => {
    setEditingImage((oldData) => ({
      ...oldData,
      collection: collection.name,
      subtitle: collection.name,
    }));
  }, [collection]);

  const onEditImage = useCallback(
    (image) => {
      setEditingImage(image);
    },
    [editingImage]
  );

  const onDownloadIPFS = useCallback(
    (image) => {
      saveIPFSData(image);
    },
    [saveIPFSData]
  );

  const onFileLoaded = useCallback(
    async (file) => {
      try {
        console.log(file);
        await loadImagesFromCSV(file);
      } catch (err) {
        console.log(err);
        toast.error("Failed load images");
        toast.error(err.message);
      }
    },
    []
  );

  return (
    <Row className="justify-content-center align-content-center">
      <div className="d-flex justify-content-between align-items-center ms-5 me-5 ps-4">
        <h3>Images</h3>
        <Button onClick={removeAllImages} className={"save-btn"}>
          Remove All
        </Button>
      </div>
      <div className="images-list-cont">
        {(images || []).map((image) => (
          <ImageThumb
            image={image}
            onRemove={removeImage}
            onEdit={onEditImage}
            onDownloadIPFS={onDownloadIPFS}
          />
        ))}
      </div>
      <ImageForm image={editingImage} onSaveChanges={saveImage} />
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Col lg={3}>
          <Button className={"text-center"} onClick={onAddImage}>
            Add Image
            <FontAwesomeIcon icon={faPlusCircle} className={"clr pointer"} />
          </Button>
        </Col>
        <Col lg={3}>
          Load Images CSV File
          <CSVReader
            onFileLoaded={onFileLoaded}
            parserOptions={parseOptions}
          >
          </CSVReader>
        </Col>
        <Col lg={3}>
          <Button onClick={saveChanges} className={"save-btn"}>
            Save Changes
          </Button>
        </Col>
      </div>
    </Row>
  );
}
