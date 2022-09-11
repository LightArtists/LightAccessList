import { Tab, Row, Tabs } from "react-bootstrap";
import { useCallback } from "react";
import { toast } from "react-toast";
import { CollectionGeneralData } from "./CollectionGeneralData";
import { useCollectionContext } from "../../modules/CollectionContext";
import { DropPhases } from "../phases/DropPhases";
import { PhaseProvider } from "../../modules/PhaseContext";
import { on } from "local-storage";
import { Images } from "../image-list/Images";
import { ImageProvider, useImageContext } from "../../modules/ImageContext";

export function CollectionViewEdit({ collection }) {
  const { updateCollection, categoryOptions } = useCollectionContext();

  const onSaveChanges = useCallback(
    async (item) => {
      const isSavedSuccess = await updateCollection(item);
      if (isSavedSuccess) {
        toast.success("Collection updated");
      }
    },
    [updateCollection]
  );

  return (
    <Row>
      <Tabs
        defaultActiveKey="general"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="general" title="General">
          <CollectionGeneralData
            collection={collection}
            onSaveChanges={onSaveChanges}
            categoryOptions={categoryOptions}
          />
        </Tab>
        <Tab eventKey="dtopPhases" title="Drop Phases">
          <PhaseProvider collection={collection} onSaveChanges={onSaveChanges}>
            <DropPhases />
          </PhaseProvider>
        </Tab>
        <Tab eventKey="images" title="Images">
          <ImageProvider collection={collection}>
            <Images collection={collection} />
          </ImageProvider>
        </Tab>
      </Tabs>
    </Row>
  );
}
