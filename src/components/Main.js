import { useCallback, useState } from "react";
import { Accordion, Button, Col, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { CollectionViewEdit } from "./collections-list/CollectionEditView";
import { ImageProvider } from "../modules/ImageContext";
import { Images } from "./image-list/Images";
import { Collections } from "./collections-list/Collections";
import {Artists} from "./artists/Artists";

export function Main() {
  const [editingCollection, setEditingCollection] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState('collections');

  const onCollectionEdit = useCallback(
    (collection) => {
      setEditingCollection(collection);
      setActiveTabKey('item');
    },
    [setEditingCollection, setActiveTabKey]
  );

  const onChangeTab = useCallback((value) => {
    setActiveTabKey(value);
  }, [setActiveTabKey]);

  return (
    <Row>
      <Tabs
        activeKey={activeTabKey}
        className="mb-3"
        onSelect={onChangeTab}
      >
        <Tab eventKey="collections" title="Collections">
          <Collections onCollectionEdit={onCollectionEdit} />
        </Tab>
        <Tab eventKey="artists" title="Artists">
          <Artists/>
        </Tab>
        {editingCollection && <Tab eventKey="item" title="Collection Item" >
          <CollectionViewEdit collection={editingCollection} />
        </Tab>}
      </Tabs>
    </Row>
  );
}
