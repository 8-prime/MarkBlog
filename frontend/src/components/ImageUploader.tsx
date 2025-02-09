import React, { useState } from 'react';

const ImageUploader: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                <button>Select Image</button>
            </label>
            {selectedImage && (
                <div style={{ marginTop: '10px' }}>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ width: '200px', height: 'auto' }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;