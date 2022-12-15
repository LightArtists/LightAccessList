import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCollectionContext } from "./CollectionContext";
import { saveAs } from "file-saver";
import {mapCollectionImages, mapImageToIPFS} from "../utils/data";

export const ImageContext = React.createContext({});
export const MAX_DROP_SIZE = 1000000;

export const ImageProvider = ({ collection, children, permanent }) => {
  const [images, setImages] = useState([]);

  const { updateCollection, artists } = useCollectionContext();

  useEffect(() => {
    let images = collection.images || [];
    if (permanent) {
      images = images.concat();
    }
    setImages(images);
  }, [collection, permanent]);

  const saveChanges = useCallback(() => {
    collection.images = images;
    updateCollection(collection);
  }, [collection, images, updateCollection]);

  const removeAllImages = useCallback(
    (imageId) => {
      setImages((images) => []);
    },
    [setImages]
  );

  const removeImage = useCallback(
    (imageId) => {
      setImages((images) => images.filter((image) => image.id !== imageId));
    },
    [setImages]
  );

  const updateImagesTokensIds = useCallback(
    (imageId) => {
      const dropId = parseInt(collection.dropId);
      setImages((images) => images.map((image, index) => ({
        ...image,
        tokenId: MAX_DROP_SIZE * dropId + index,
        internalNumber: index
      })));
    },
    [setImages, collection.dropId]
  );

  const loadImagesFromCSV = useCallback(
    (data) => {
        const images = mapCollectionImages({
          name: collection.name,
          imageDir: collection.collectionID,
        }, data, artists);
      setImages(images);
    },
    [setImages, collection, artists]
  );

  const saveImage = useCallback(
    (image) => {
      if (!!image.id) {
        const imageIndex = images.findIndex((item) => item.id === image.id);
        if (imageIndex === -1) {
          return false;
        }
        images[imageIndex] = {
          ...images[imageIndex],
          ...image,
        };
        return setImages([...images]);
      }

      let newId = Math.max(...images.map((image) => image.id));
      if (newId) {
        newId++;
      } else {
        newId = 1;
      }
      image.id = newId;
      images.push(image);
      setImages([...images]);
    },
    [setImages, images]
  );

  const saveIPFSData = useCallback((image) => {
    const data = mapImageToIPFS(image, collection);
    const bytes = new TextEncoder().encode(JSON.stringify(data));
    var blob = new Blob([bytes], { type: "application/json;charset=utf-8" });
    saveAs(blob, `${image.title}.json`);
  }, [collection]);

  return (
    <ImageContext.Provider
      value={{
        images,
        saveIPFSData,
        loadImagesFromCSV,
        removeImage,
        saveChanges,
        saveImage,
        removeAllImages,
        updateImagesTokensIds,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => React.useContext(ImageContext);
