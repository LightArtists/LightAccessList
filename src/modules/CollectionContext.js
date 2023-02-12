import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as ls from "local-storage";
import { saveAs } from "file-saver";
import { uid } from "uid";
import { defaultNewCollection } from "./data";
import {getNextName, parseArtists} from "../utils/data";

export const CollectionContext = React.createContext({});

export const CollectionProvider = ({ children }) => {
  const [artists, setArtists] = useState([]);
  const [collections, setCollections] = useState([]);
  const [artistOptions, setArtistOptions] = useState([]);

  useEffect(() => {
    const collections = ls.get("collections");
    const artists = ls.get("artists");
    if (collections && collections.length) {
      setCollections(collections);
    }
    if (artists && artists.length) {
      setArtists(artists);
    }
  }, []);

  const updateArtistOptions = useEffect(
    () => {
      const artistsNames = artists
        .map((artist) => ({
          name: artist.name,
          value: artist.name,
          artistImg: artist.imageSrc,
        }))
        .filter(
          (artist, index, arr) =>
            index === arr.findIndex((a) => a.name === artist.name)
        );
      setArtistOptions(artistsNames);
    },
    [artists]
  );

  const saveCollectionsData = useCallback(
    (newData) => {
      if (!newData) {
        throw new Error("Cannot set collection to null");
      }
      try {
        setCollections((oldData) => {
          if (newData === true) {
            ls.set("collections", oldData);
            return oldData;
          }
          if (Array.isArray(newData)) {
            ls.set("collections", newData);
            return newData;
          }
          const results = newData(oldData);
          ls.set("collections", results);
          return results;
        });
      } catch (err) {
        console.log(err);
        alert("Could not save progress.");
      }
    },
    [setCollections]
  );

  const loadCollections = useCallback(
    async (file) => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.addEventListener("load", (event) => {
          try {
            const data = JSON.parse(event.target.result);
            data.reduce((coll, map) => {
              if (!coll.id) {
                coll.id = uid();
              }
              if (coll.id in map) {
                coll.id = uid();
              }
              map[coll.id] = true;
              return map;
            }, {});
            saveCollectionsData((collections) => [...collections, ...data]);
            resolve(data);
          } catch (e) {
            reject(new Error("Cant parse file data"));
          }
        });
        reader.addEventListener("error", (event) => {
          reject(new Error("Error during data loading"));
        });
        reader.readAsText(file);
      });
    },
    [saveCollectionsData]
  );

  const loadArtists = useCallback(
    async (data) => {
      const artists = parseArtists(data);
      setArtists(artists);
      ls.set("artists", artists);
    },
    [saveCollectionsData]
  );

  const addCollection = useCallback(() => {
    saveCollectionsData((collections) => {
      const name = getNextName(
        defaultNewCollection.name,
        collections.map((item) => item.name)
      );
      return [
        ...collections,
        {
          ...defaultNewCollection,
          name,
          id: uid(),
        },
      ];
    });
  }, [saveCollectionsData]);

  const removeCollection = useCallback(
    (collectionId) => {
      saveCollectionsData((collections) =>
        collections.filter((collection) => collection.id !== collectionId)
      );
    },
    [saveCollectionsData]
  );

  const getCollectionById = useCallback(
    (collectionId) => {
      return collections.find((item) => item.id === collectionId);
    },
    [collections]
  );

  const updateCollection = useCallback(
    (collection) => {
      const foundCollectionIndex = collections.findIndex(
        (item) => item.id === collection.id
      );
      if (foundCollectionIndex === -1) {
        return false;
      }
      if (collection.isMain) {
        collections.forEach((coll, index) => {
          if (index === foundCollectionIndex) {
            return;
          }
          collections[index] = {...collections[index], isMain: false};
        })
      }
      collections[foundCollectionIndex] = {
        ...collections[foundCollectionIndex],
        ...collection,
      };
      saveCollectionsData(collections);
      return true;
    },
    [collections, saveCollectionsData]
  );

  const clearAllCollectionData = useCallback(
    (index, newPhase) => {
      saveCollectionsData([]);
      ls.clear();
    },
    [saveCollectionsData]
  );

  const saveCollectionJSON = useCallback(() => {
    if (!collections.length) {
      return;
    }
    saveCollectionsData(collections);
    const bytes = new TextEncoder().encode(JSON.stringify(collections, 2, 2));
    var blob = new Blob([bytes], { type: "application/json;charset=utf-8" });
    saveAs(blob, "collections.json");
  }, [collections, saveCollectionsData]);

  const categoryOptions = useMemo(() => {
    return collections
      .map((collection) => ({
        value: collection.categoryName,
        type: collection.categoryType,
      }))
      .filter(
        (item, index, mapedCollections) =>
          mapedCollections.findIndex((a) => a.value === item.value) === index
      );
  }, [collections]);

  return (
    <CollectionContext.Provider
      value={{
        collections,
        loadArtists,
        artists,
        artistOptions,
        clearAllCollectionData,
        addCollection,
        updateCollection,
        saveCollectionsData,
        saveCollectionJSON,
        removeCollection,
        loadCollections,
        categoryOptions,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollectionContext = () => React.useContext(CollectionContext);
