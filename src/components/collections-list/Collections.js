import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Accordion, Button, Col, Modal, Row } from "react-bootstrap";
import Files from "react-files";
import { toast } from "react-toast";
import { useCollectionContext } from "../../modules/CollectionContext";
import { CollectionThumb } from "./CollectionThumb";
import ConfirmationModal from "../comnmon/ConfirmationModal";
import { CollectionViewEdit } from "./CollectionEditView";

export function Collections({ onCollectionEdit }) {
  const {
    collections,
    addCollection,
    loadCollections,
    removeCollection,
    saveCollectionsData,
    saveCollectionJSON,
    clearAllCollectionData,
  } = useCollectionContext();

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const [confirmHandler, setConfirmHandler] = useState({ handler: () => {} });

  const onConfirmation = useCallback(
    (confirmed) => {
      setShowConfirmPopup(false);
      if (!confirmed) {
        return;
      }
      confirmHandler.handler();
    },
    [setShowConfirmPopup, confirmHandler]
  );

  const onAddCollection = useCallback(() => {
    addCollection();
  }, [addCollection]);

  const onLoadCollection = useCallback(async ([file]) => {
    try {
      await loadCollections(file);
    } catch (err) {
      console.log(err);
      toast.error("Failed load file");
      toast.error(err.message);
    }
  }, []);

  const onCollectionShow = useCallback(
    (collection) => {
      onCollectionEdit(collection);
    },
    [onCollectionEdit]
  );

  const onSaveClicked = useCallback(() => {
    saveCollectionJSON();
  }, [saveCollectionJSON]);

  const onRemoveCollection = useCallback((collectionId) => {
    setShowConfirmPopup(true);
    setConfirmHandler({ handler: () => removeCollection(collectionId) });
  }, []);

  const onClearAllData = useCallback(() => {
    setShowConfirmPopup(true);
    setConfirmHandler({ handler: () => clearAllCollectionData() });
  }, [clearAllCollectionData]);

  return (
    <Row>
      <h3>Collections</h3>
      {!collections.length && (
        <Row className="no-collections-container">
          You don't have any collections yet. Add it or load it from json file.
        </Row>
      )}
      {collections.map((collection) => (
        <CollectionThumb
          collection={collection}
          onShow={onCollectionShow}
          onRemove={onRemoveCollection}
        />
      ))}
      <Row className="mt-4">
        <Col>
          <Button className={"text-center"} onClick={onAddCollection}>
            Add Collection
            <FontAwesomeIcon icon={faPlusCircle} className={"clr pointer"} />
          </Button>
        </Col>
        <Col>
          <Files
            className="files-dropzone"
            onChange={onLoadCollection}
            accepts={["json/text", ".json"]}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
          >
            <Button className={"text-center"}>
              Load Collections File
              <FontAwesomeIcon icon={faPlusCircle} className={"clr pointer"} />
            </Button>
          </Files>
        </Col>
        <Col>
          <Button onClick={onSaveClicked} className={"save-btn"}>
            Save As Json
          </Button>
        </Col>
        <Col>
          <Button onClick={onClearAllData} className={"save-btn"}>
            Clear All Data
          </Button>
        </Col>
      </Row>
      <ConfirmationModal onConfirm={onConfirmation} show={showConfirmPopup} />
    </Row>
  );
}
