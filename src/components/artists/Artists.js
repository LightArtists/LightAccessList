import React, { useCallback, useEffect, useState } from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useCollectionContext} from "../../modules/CollectionContext";
import {ArtistThumb} from "./ArtistsThumb";
import {toast} from "react-toast";
import CSVReader from "react-csv-reader";

const parseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

export function Artists({ collection }) {
  const { artists, loadArtists } =
    useCollectionContext();

  const onLoadArtists = useCallback(async (fileData) => {
    try {
      await loadArtists(fileData);
    } catch (err) {
      console.log(err);
      toast.error("Failed load artists");
      toast.error(err.message);
    }
  }, []);

  return (
    <Row className="justify-content-center align-content-center">
      <div className="d-flex justify-content-between align-items-center ms-5 me-5 ps-4">
        <h3>Artists</h3>
      </div>
      <div className="images-list-cont">
        {(artists || []).map((artist) => (
          <ArtistThumb
            artist={artist}
          />
        ))}
      </div>
      <div className="d-flex justify-content-center align-items-center mt-4 ">
        <Col lg={3}>
          Load Artists CSV File
          <CSVReader
            onFileLoaded={onLoadArtists}
            parserOptions={parseOptions}
          >
          </CSVReader>
        </Col>
      </div>
    </Row>
  );
}
