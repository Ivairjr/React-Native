import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";

const PHOTO_STORAGE = "photos";

export function usePhotoGallery() {

    const { getPhoto } = useCamera();
    const { deleteFile, getUri, readFile, writeFile } = useFilesystem();

    //Array to store captured photos
    const [photos, setPhotos] = useState<Photo[]>([]);
  
    const takePhoto = async () => {
      const cameraPhoto = await getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });


      const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);
        const newPhotos = [{
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
        }, ...photos];
        setPhotos(newPhotos)
    };

    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
      const base64Data = await base64FromPath(photo.webPath!);
      const savedFile = await writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Data
      });

      const { get, set } = useStorage();
    
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    };
  
    return {
      photos,
      takePhoto
    };
  }
  
  //New photo type to hold metadata
  export interface Photo {
    filepath: string;
    webviewPath?: string;
  }