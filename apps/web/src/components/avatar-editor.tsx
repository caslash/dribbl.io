/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDBUser } from '@/context/dbusercontext';
import { Crop as CropIcon, Upload, X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface AvatarEditorProps {
  children: React.ReactNode;
}

export function AvatarEditor({ children }: AvatarEditorProps) {
  const { uploadAvatar } = useDBUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedFile(fileWithPreview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    return canvas.toDataURL('image/png', 1.0);
  }

  async function handleCropAndUpload() {
    if (!croppedImageUrl) return;

    try {
      setIsUploading(true);

      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.png', { type: 'image/png' });

      await uploadAvatar(file);

      setDialogOpen(false);
      setSelectedFile(null);
      setCroppedImageUrl('');
      setCrop(undefined);

      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel() {
    setDialogOpen(false);
    setSelectedFile(null);
    setCroppedImageUrl('');
    setCrop(undefined);

    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-sm text-muted-foreground">Drop the image here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload an image</p>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, GIF, WebP (max 5MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={onCropComplete}
                  aspect={1}
                  className="w-full"
                >
                  <img
                    ref={imgRef}
                    src={selectedFile.preview}
                    alt="Crop preview"
                    className="max-h-96 w-full object-contain"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Drag to move, resize corners to crop. The image will be cropped to a 100x100 square.
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {selectedFile && (
              <Button onClick={handleCropAndUpload} disabled={!croppedImageUrl || isUploading}>
                <CropIcon className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Save Avatar'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
