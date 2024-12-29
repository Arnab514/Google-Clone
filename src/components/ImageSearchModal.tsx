// 'use client'
// import React, { useState, useRef } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import ReactCrop, { Crop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

// interface ImageSearchProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onImageSelect: (image: string) => void;
// }

// const ImageSearchModal: React.FC<ImageSearchProps> = ({ isOpen, onClose, onImageSelect }) => {
//     const [isDragging, setIsDragging] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [imageUrl, setImageUrl] = useState('');
//     const [crop, setCrop] = useState<Crop>({
//         unit: '%',
//         x: 0,
//         y: 0,
//         width: 100,
//         height: 100
//     });
//     const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const imageRef = useRef<HTMLImageElement>(null);

//     const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
//         const img = e.currentTarget;
//         setImageDimensions({
//             width: img.naturalWidth,
//             height: img.naturalHeight
//         });

//         // Set initial crop based on image dimensions
//         const aspectRatio = img.naturalWidth / img.naturalHeight;
//         if (aspectRatio > 1) {
//             // Landscape
//             setCrop({
//                 unit: '%',
//                 x: 0,
//                 y: 0,
//                 width: 100,
//                 height: 100
//             });
//         } else {
//             // Portrait
//             setCrop({
//                 unit: '%',
//                 x: 0,
//                 y: 0,
//                 width: 100,
//                 height: 100
//             });
//         }
//     };

//     const handleDragEnter = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleDrop = async (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const file = e.dataTransfer.files[0];
//         if (file && file.type.startsWith('image/')) {
//             await processImage(file);
//         }
//     };

//     const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             await processImage(file);
//         }
//     };

//     const handleUrlSearch = async () => {
//         if (imageUrl) {
//             setIsProcessing(true);
//             try {
//                 onImageSelect(imageUrl);
//                 onClose();
//             } catch (error) {
//                 console.error('Error processing image URL:', error);
//             }
//             setIsProcessing(false);
//         }
//     };

//     const processImage = async (file: File) => {
//         setIsProcessing(true);
//         try {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setSelectedImage(e.target?.result as string);
//                 setIsProcessing(false);
//             };
//             reader.readAsDataURL(file);
//         } catch (error) {
//             console.error('Error processing image:', error);
//             setIsProcessing(false);
//         }
//     };

//     const getCroppedImage = async () => {
//         if (!imageRef.current || !crop.width || !crop.height) return null;

//         const canvas = document.createElement('canvas');
//         const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
//         const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

//         canvas.width = crop.width * scaleX;
//         canvas.height = crop.height * scaleY;

//         const ctx = canvas.getContext('2d');
//         if (!ctx) return null;

//         ctx.drawImage(
//             imageRef.current,
//             crop.x * scaleX,
//             crop.y * scaleY,
//             crop.width * scaleX,
//             crop.height * scaleY,
//             0,
//             0,
//             canvas.width,
//             canvas.height
//         );

//         return canvas.toDataURL('image/jpeg');
//     };

//     const handleSearch = async () => {
//         if (selectedImage) {
//             setIsProcessing(true);
//             try {
//                 const croppedImage = await getCroppedImage();
//                 if (croppedImage) {
//                     onImageSelect(croppedImage);
//                 } else {
//                     onImageSelect(selectedImage);
//                 }
//             } catch (error) {
//                 console.error('Error processing cropped image:', error);
//                 onImageSelect(selectedImage);
//             }
//             setIsProcessing(false);
//             onClose();
//         }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-1 z-50 top-20 flex items-center justify-center"
//                     onClick={(e) => e.target === e.currentTarget && onClose()}
//                 >
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.9, opacity: 0 }}
//                         className="bg-[#303134] rounded-3xl p-6 w-[600px] relative"
//                     >

// <style>
//                             {`
//                                 .ReactCrop__crop-selection {
//                                     border: 2px solid #3b82f6 !important;
//                                 }
//                                 .ReactCrop__drag-handle {
//                                     border: 2px solid #3b82f6 !important;
//                                     background-color: white;
//                                 }
//                                 .ReactCrop__drag-handle::after {
//                                     background-color: transparent !important;
//                                 }
//                                 .ReactCrop__drag-bar {
//                                     background-color: transparent !important;
//                                 }
//                                 .ReactCrop__crop-selection:focus {
//                                     border: 2px solid #3b82f6 !important;
//                                 }
//                             `}
//                         </style>

//                         <button
//                             onClick={onClose}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
//                         >
//                             ×
//                         </button>

//                         <h2 className="text-lg text-white mb-4 mx-auto justify-center text-center">
//                             Search any image with google lens
//                         </h2>

//                         {!selectedImage ? (
//                             <div className="space-y-6">
//                                 <div
//                                     onDragEnter={handleDragEnter}
//                                     onDragOver={(e) => e.preventDefault()}
//                                     onDragLeave={handleDragLeave}
//                                     onDrop={handleDrop}
//                                     className={`bg-[#202124] rounded-lg p-8 text-center transition-colors ${
//                                         isDragging ? 'border-blue-500 bg-opacity-10' : ''
//                                     }`}
//                                 >
//                                     <div className="space-y-4">
//                                         <Image
//                                             src="/Drag-Drop.png"
//                                             alt="Drag and Drop"
//                                             width={48}
//                                             height={48}
//                                             className="mx-auto mb-4"
//                                         />
//                                         <div className="text-gray-300">
//                                             Drag an image here or
//                                             <button
//                                                 onClick={() => fileInputRef.current?.click()}
//                                                 className="text-blue-400 hover:underline ml-1"
//                                             >
//                                                 upload a file
//                                             </button>
//                                         </div>
//                                         <input
//                                             title="image"
//                                             ref={fileInputRef}
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={handleFileInput}
//                                             className="hidden"
//                                         />

//                                         <div className="relative">
//                                             <div className="absolute inset-0 flex items-center">
//                                                 <div className="w-full border-t border-gray-600"></div>
//                                             </div>
//                                             <div className="relative flex justify-center">
//                                                 <span className="px-2 bg-[#202124] text-gray-400">OR</span>
//                                             </div>
//                                         </div>

//                                         <div className="flex space-x-2">
//                                             <input
//                                                 type="text"
//                                                 placeholder="Paste image link"
//                                                 value={imageUrl}
//                                                 onChange={(e) => setImageUrl(e.target.value)}
//                                                 className="flex-1 px-4 py-2 bg-[#303134] text-white rounded-full border border-gray-600 focus:outline-none focus:border-blue-500"
//                                             />
//                                             <button
//                                                 onClick={handleUrlSearch}
//                                                 className="px-4 py-2 bg-[#303134] text-blue-400 rounded-full hover:bg-[#26272a]"
//                                             >
//                                                 Search
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 <div className="flex justify-center items-center">
//                                     <div className="relative max-w-full max-h-[400px] flex justify-center">
//                                         <ReactCrop
//                                             crop={crop}
//                                             onChange={c => setCrop(c)}
//                                             className="max-w-full max-h-[400px] flex justify-center"
//                                             style={{
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center'
//                                             }}
//                                         >
//                                             <img
//                                                 ref={imageRef}
//                                                 src={selectedImage}
//                                                 alt="Selected"
//                                                 onLoad={handleImageLoad}
//                                                 className="max-w-full max-h-[400px] object-contain mx-auto"
//                                             />
//                                         </ReactCrop>
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-end space-x-3">
//                                     <button
//                                         onClick={() => setSelectedImage(null)}
//                                         className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleSearch}
//                                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                                         disabled={isProcessing}
//                                     >
//                                         Search
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {isProcessing && (
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
//                                 <div className="space-y-3 text-center">
//                                     <div className="loader">
//                                         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                                     </div>
//                                     <div className="text-white">Processing image...</div>
//                                 </div>
//                             </div>
//                         )}
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };

// export default ImageSearchModal;




// 'use client'
// import React, { useState, useRef } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import ReactCrop, { Crop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

// interface ImageSearchProps {
//     isOpen: boolean; // Indicates whether the modal is open
//     onClose: () => void; // Callback when the modal is closed
//     onImageSelect: (image: string) => void; // Callback when an image is selected
//   }

// const ImageSearchModal: React.FC<ImageSearchProps> = ({ isOpen, onClose, onImageSelect }) => {
//     const [isDragging, setIsDragging] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [imageUrl, setImageUrl] = useState('');
//     const [crop, setCrop] = useState<Crop>({
//         unit: '%',
//         x: 25,
//         y: 25,
//         width: 50,
//         height: 50
//     });

//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const imageRef = useRef<HTMLImageElement>(null);

//     const handleDragEnter = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleDrop = async (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);

//         const file = e.dataTransfer.files[0];
//         if (file && file.type.startsWith('image/')) {
//             await processImage(file);
//         }
//     };

//     const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             await processImage(file);
//         }
//     };

//     const handleUrlSearch = async () => {
//         if (imageUrl) {
//             setIsProcessing(true);
//             try {
//                 onImageSelect(imageUrl);
//                 onClose();
//             } catch (error) {
//                 console.error('Error processing image URL:', error);
//             }
//             setIsProcessing(false);
//         }
//     };

//     const processImage = async (file: File) => {
//         setIsProcessing(true);

//         try {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setSelectedImage(e.target?.result as string);
//                 setIsProcessing(false);
//             };
//             reader.readAsDataURL(file);
//         } catch (error) {
//             console.error('Error processing image:', error);
//             setIsProcessing(false);
//         }
//     };

//     const getCroppedImage = async () => {
//         if (!imageRef.current || !crop.width || !crop.height) return null;

//         const canvas = document.createElement('canvas');
//         const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
//         const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

//         canvas.width = crop.width;
//         canvas.height = crop.height;

//         const ctx = canvas.getContext('2d');
//         if (!ctx) return null;

//         ctx.drawImage(
//             imageRef.current,
//             crop.x * scaleX,
//             crop.y * scaleY,
//             crop.width * scaleX,
//             crop.height * scaleY,
//             0,
//             0,
//             crop.width,
//             crop.height
//         );

//         return canvas.toDataURL('image/jpeg');
//     };

//     const handleSearch = async () => {
//         if (selectedImage) {
//             setIsProcessing(true);
//             try {
//                 const croppedImage = await getCroppedImage();
//                 if (croppedImage) {
//                     onImageSelect(croppedImage);
//                 } else {
//                     onImageSelect(selectedImage);
//                 }
//             } catch (error) {
//                 console.error('Error processing cropped image:', error);
//                 onImageSelect(selectedImage);
//             }
//             setIsProcessing(false);
//             onClose();
//         }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-1 z-50 top-20 flex items-center justify-center"
//                     onClick={(e) => e.target === e.currentTarget && onClose()}
//                 >
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.9, opacity: 0 }}
//                         className="bg-[#303134] rounded-3xl p-6 w-[600px] relative"
//                     >
//                         <button
//                             onClick={onClose}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
//                         >
//                             ×
//                         </button>

//                         <h2 className="text-lg text-white mb-4 mx-auto justify-center text-center">Search any image with google lens</h2>

//                         {!selectedImage ? (
//                             <div className="space-y-6">
//                                 <div
//                                     onDragEnter={handleDragEnter}
//                                     onDragOver={(e) => e.preventDefault()}
//                                     onDragLeave={handleDragLeave}
//                                     onDrop={handleDrop}
//                                     className={`bg-[#202124] rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-opacity-10' : ''
//                                         }`}
//                                 >
//                                     <div className="space-y-4">
//                                         <Image
//                                             src="/Drag-Drop.png"
//                                             alt="Drag and Drop"
//                                             width={48}
//                                             height={48}
//                                             className="mx-auto mb-4"
//                                         />
//                                         <div className="text-gray-300">
//                                             Drag an image here or
//                                             <button
//                                                 onClick={() => fileInputRef.current?.click()}
//                                                 className="text-blue-400 hover:underline ml-1"
//                                             >
//                                                 upload a file
//                                             </button>
//                                         </div>
//                                         <input
//                                             title='image'
//                                             ref={fileInputRef}
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={handleFileInput}
//                                             className="hidden"
//                                         />


//                                         <div className="relative">
//                                             <div className="absolute inset-0 flex items-center">
//                                                 <div className="w-full border-t border-gray-600"></div>
//                                             </div>
//                                             <div className="relative flex justify-center">
//                                                 <span className="px-2 bg-[#202124] text-gray-400">OR</span>
//                                             </div>
//                                         </div>

//                                         <div className="flex space-x-2">
//                                             <input
//                                                 type="text"
//                                                 placeholder="Paste image link"
//                                                 value={imageUrl}
//                                                 onChange={(e) => setImageUrl(e.target.value)}
//                                                 className="flex-1 px-4 py-2 bg-[#303134] text-white rounded-full border border-gray-600 focus:outline-none focus:border-blue-500"
//                                             />
//                                             <button
//                                                 onClick={handleUrlSearch}
//                                                 className="px-4 py-2 bg-[#303134] text-blue-400 rounded-full hover:bg-[#26272a]"
//                                             >
//                                                 Search
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>


//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 <ReactCrop
//                                     crop={crop}
//                                     onChange={c => setCrop(c)}
//                                 >
//                                     <img
//                                         ref={imageRef}
//                                         src={selectedImage}
//                                         alt="Selected"
//                                         className="max-w-full max-h-[400px] object-contain"
//                                     />
//                                 </ReactCrop>
//                                 <div className="flex justify-end space-x-3">
//                                     <button
//                                         onClick={() => setSelectedImage(null)}
//                                         className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleSearch}
//                                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                                         disabled={isProcessing}
//                                     >
//                                         Search
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {isProcessing && (
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
//                                 <div className="space-y-3 text-center">
//                                     <div className="loader">
//                                         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                                     </div>
//                                     <div className="text-white">Processing image...</div>
//                                 </div>
//                             </div>
//                         )}
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };

// export default ImageSearchModal;



  


'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (image: string) => void;
}

const ImageSearchModal: React.FC<ImageSearchProps> = ({ isOpen, onClose, onImageSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await processImage(file);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processImage(file);
        }
    };

    const handleUrlSearch = async () => {
        if (imageUrl) {
            setIsProcessing(true);
            try {
                onImageSelect(imageUrl);
                onClose();
            } catch (error) {
                console.error('Error processing image URL:', error);
            }
            setIsProcessing(false);
        }
    };

    const processImage = async (file: File) => {
        setIsProcessing(true);
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
                setIsProcessing(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            setIsProcessing(false);
        }
    };

    const handleSearch = async () => {
        if (selectedImage) {
            setIsProcessing(true);
            try {
                onImageSelect(selectedImage);
            } catch (error) {
                console.error('Error processing image:', error);
            }
            setIsProcessing(false);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-1 z-50 top-20 flex items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#303134] rounded-3xl p-6 w-[600px] relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                        >
                            ×
                        </button>

                        <h2 className="text-lg text-white mb-4 mx-auto justify-center text-center">
                            Search any image with google lens
                        </h2>

                        {!selectedImage ? (
                            <div className="space-y-6">
                                <div
                                    onDragEnter={handleDragEnter}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`bg-[#202124] rounded-lg p-8 text-center transition-colors ${
                                        isDragging ? 'border-blue-500 bg-opacity-10' : ''
                                    }`}
                                >
                                    <div className="space-y-4">
                                        <Image
                                            src="/Drag-Drop.png"
                                            alt="Drag and Drop"
                                            width={48}
                                            height={48}
                                            className="mx-auto mb-4"
                                        />
                                        <div className="text-gray-300">
                                            Drag an image here or
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-blue-400 hover:underline ml-1"
                                            >
                                                upload a file
                                            </button>
                                        </div>
                                        <input
                                            title="image"
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-600"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className="px-2 bg-[#202124] text-gray-400">OR</span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Paste image link"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                className="flex-1 px-4 py-2 bg-[#303134] text-white rounded-full border border-gray-600 focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                onClick={handleUrlSearch}
                                                className="px-4 py-2 bg-[#303134] text-blue-400 rounded-full hover:bg-[#26272a]"
                                            >
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-center items-center">
                                    <div className="relative max-w-full max-h-[400px] flex justify-center">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="max-w-full max-h-[400px] object-contain mx-auto"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        disabled={isProcessing}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                <div className="space-y-3 text-center">
                                    <div className="loader">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <div className="text-white">Processing image...</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageSearchModal;