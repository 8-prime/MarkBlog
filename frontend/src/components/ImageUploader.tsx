import React, { useRef, useState } from 'react';
import { BasicButton } from './BasicButton';
import { uploadImage } from '../api/api';


export type ImageUploaderProps = {
    onSelected: (imageUrl: string) => void
}

const ImageUploader = ({ onSelected }: ImageUploaderProps) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileObject = event.target.files?.[0];
        if (fileObject) {
            const response = await uploadImage(fileObject);
            if (response) {
                onSelected(response);
            }
        }
    };

    return (
        <div>
            <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                <BasicButton onClick={() => fileInput.current!.click()} >Select Image</BasicButton>
            </label>
        </div>
    );
};

export default ImageUploader;