'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TbGridDots } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';
import { CropIcon, RotateCcw, SearchIcon, Loader2 } from 'lucide-react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const profileUrl = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

const USD_TO_INR_RATE = 83.12;

type Product = {
  id: number;
  image: string;
  platform: string;
  price: string;
  priceInINR: string;
  title: string;
  rating?: number;
  size: 'medium' | 'large';
  category: string;
  description: string;
};

const convertToINR = (usdPrice: number): string => {
  const inrPrice = usdPrice * USD_TO_INR_RATE;
  return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
};

const LoadingSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="mb-4">
            <div className="border border-gray-200 rounded-lg h-60">
              <div className="relative h-44 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                <div className="flex flex-col mt-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
                <div className="flex items-center mt-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const getCroppedImg = (image: HTMLImageElement, crop: any): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleSearchCrop = () => {
    if (crop.width && crop.height && imageRef.current) {
      const croppedImage = getCroppedImg(
        imageRef.current,
        crop
      );
      setCroppedImageUrl(croppedImage);
      setIsCropping(false);
      setSearching(true);
      
      const cropArea = {
        x: Math.round(crop.x),
        y: Math.round(crop.y),
        width: Math.round(crop.width),
        height: Math.round(crop.height)
      };

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Add a natural delay before fetching results
      searchTimeoutRef.current = setTimeout(() => {
        fetchProducts(cropArea);
      }, 1500);
    }
  };

  const handleResetImage = () => {
    setCroppedImageUrl(null);
    setCrop({
      unit: '%',
      x: 25,
      y: 25,
      width: 50,
      height: 50
    });
    setSearching(true);
    
    // Add delay for reset search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts();
    }, 1500);
  };

  const toggleCropping = () => {
    setIsCropping(!isCropping);
    if (!isCropping) {
      setCrop({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
      });
    }
  };

  const fetchProducts = async (cropArea?: { x: number; y: number; width: number; height: number }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products?limit=20');
      const data = await response.json();

      if (Array.isArray(data)) {
        const transformedProducts: Product[] = data.map((item, index) => ({
          id: item.id,
          image: item.image || "/api/placeholder/180/240",
          platform: "Fakestore",
          price: `$${item.price}`,
          priceInINR: convertToINR(item.price),
          title: item.title,
          rating: item.rating?.rate || undefined,
          size: index % 2 === 0 ? 'medium' : 'large',
          category: item.category,
          description: item.description
        }));

        setProducts(transformedProducts);
      } else {
        console.error('Unexpected API response structure:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <Link href="/" className="relative h-8 w-24">
          <Image
            src={googleLogo}
            alt="Google"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </Link>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
            Upload
          </button>
          <TbGridDots className="text-4xl text-gray-700 hover:bg-gray-100 p-2 rounded-full cursor-pointer transition-colors duration-200" />
          <div className="relative h-8 w-8">
            <Image 
              src={profileUrl} 
              alt="Profile"
              fill
              className="rounded-full object-cover ring-2 ring-gray-200 hover:ring-gray-300 transition-all duration-200"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 bg-[#202124] flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="mb-8 text-center text-gray-300 text-md font-medium flex items-center space-x-4">
                <p>You searched for this</p>
                {!croppedImageUrl && (
                  <button 
                    onClick={toggleCropping}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title={isCropping ? "Cancel crop" : "Crop image"}
                  >
                    <CropIcon className="w-5 h-5 text-gray-300" />
                  </button>
                )}
                {isCropping && (
                  <button 
                    onClick={handleSearchCrop}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Search with cropped area"
                  >
                    <SearchIcon className="w-5 h-5 text-gray-300" />
                  </button>
                )}
                {croppedImageUrl && (
                  <button 
                    onClick={handleResetImage}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Reset to original image"
                  >
                    <RotateCcw className="w-5 h-5 text-gray-300" />
                  </button>
                )}
              </div>

              <div className="max-w-full max-h-full overflow-hidden flex items-center justify-center rounded-lg shadow-xl">
                {mounted && (
                  isCropping ? (
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      className="max-h-[75vh]"
                      minWidth={50}
                      minHeight={50}
                      ruleOfThirds
                    >
                      <img
                        ref={imageRef}
                        src={searchImage}
                        alt="Search reference"
                        className="w-auto max-w-full max-h-[75vh]"
                        onLoad={() => setLoading(false)}
                      />
                    </ReactCrop>
                  ) : (
                    <img
                      src={croppedImageUrl || searchImage}
                      alt="Search reference"
                      sizes="100vw"
                      className="w-auto max-w-full max-h-[75vh] transition-opacity duration-300"
                      onLoad={() => setLoading(false)}
                    />
                  )
                )}
              </div>

              <div className="mt-6 text-center text-gray-300 text-md font-medium">
                {isCropping ? (
                  <p className="animate-pulse">Drag to select any area to search</p>
                ) : searching ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p>Searching for similar items...</p>
                  </div>
                ) : (
                  <p>Here are the suitable results for your {croppedImageUrl ? 'cropped' : ''} image</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/3 overflow-y-auto bg-gray-50" style={{ height: 'calc(100vh - 56px)' }}>
          {loading || searching ? (
            <LoadingSkeleton />
          ) : (
            <div className="p-6">
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
                        onClick={() => window.open(`https://www.google.com/search?q=${product.category}&tbm=shop`, '_blank')}
                      >
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className={`relative ${product.size === 'large' ? 'h-52' : 'h-44'}`}>
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium truncate" title={product.title}>
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                            <div className="flex flex-col mt-2">
                              <p className="text-blue-600 font-medium text-sm">{product.priceInINR}</p>
                              <p className="text-xs text-gray-500">{product.price}</p>
                            </div>
                            {product.rating && (
                              <div className="flex items-center mt-2">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <button
                      className="px-6 py-3 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg font-medium text-sm flex items-center space-x-2 shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={() => window.open('https://www.google.com/search?q=clothing&tbm=shop', '_blank')}
                    >
                      <span>See More Results</span>
                      <BsArrowRight className="ml-2" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search area</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSearchResults;



// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { TbGridDots } from 'react-icons/tb';
// import { BsArrowRight } from 'react-icons/bs';
// import { IoMdImages } from 'react-icons/io';
// import ImageSearchModal from './ImageSearchModal';

// const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
// const profileUrl = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

// const USD_TO_INR_RATE = 83.12;

// interface SearchImageData {
//   originalImage: string;
//   croppedImage?: string;
// }

// interface ImageSearchResultsProps {
//   searchData?: SearchImageData;
// }

// type Product = {
//   id: number;
//   image: string;
//   platform: string;
//   price: string;
//   priceInINR: string;
//   title: string;
//   rating?: number;
//   size: 'medium' | 'large';
//   category: string;
//   description: string;
// };

// const convertToINR = (usdPrice: number): string => {
//   const inrPrice = usdPrice * USD_TO_INR_RATE;
//   return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
// };

// const defaultSearchData: SearchImageData = {
//   originalImage: '/api/placeholder/400/400'
// };

// const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({ searchData = defaultSearchData }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState<SearchImageData>(searchData);
//   const [imageError, setImageError] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('https://fakestoreapi.com/products?limit=20');
//         const data = await response.json();

//         if (Array.isArray(data)) {
//           const transformedProducts: Product[] = data.map((item, index) => ({
//             id: item.id,
//             image: item.image || "/api/placeholder/180/240",
//             platform: "Fakestore",
//             price: `$${item.price}`,
//             priceInINR: convertToINR(item.price),
//             title: item.title,
//             rating: item.rating?.rate || undefined,
//             size: index % 2 === 0 ? 'medium' : 'large',
//             category: item.category,
//             description: item.description
//           }));

//           setProducts(transformedProducts);
//         } else {
//           console.error('Unexpected API response structure:', data);
//           setProducts([]);
//         }
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (searchData) {
//       setCurrentImage(searchData);
//       setImageError(false);
//     }
//   }, [searchData]);

//   const handleNewImageSelect = (newImageData: SearchImageData) => {
//     setCurrentImage(newImageData);
//     setImageError(false);
//     setIsModalOpen(false);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
//         <Link href="/" className="relative h-8 w-24">
//           <Image
//             src={googleLogo}
//             alt="Google"
//             fill
//             className="object-contain"
//             priority
//             unoptimized
//           />
//         </Link>
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2"
//           >
//             <IoMdImages className="text-lg" />
//             <span>Upload New</span>
//           </button>
//           <TbGridDots className="text-4xl text-gray-700 hover:bg-gray-100 p-2 rounded-full cursor-pointer" />
//           <div className="relative h-8 w-8">
//             <Image 
//               src={profileUrl} 
//               alt="Profile"
//               fill
//               className="rounded-full object-cover"
//               unoptimized
//             />
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-1/2 bg-[#202124] p-4">
//           <div className="h-full flex items-center justify-center">
//             {mounted && currentImage && !imageError ? (
//               <div className="relative w-full h-full flex items-center justify-center">
//                 <img
//                   src={currentImage.croppedImage || currentImage.originalImage}
//                   alt="Search reference"
//                   className="max-w-full max-h-[75vh] object-contain"
//                   onError={handleImageError}
//                 />
//               </div>
//             ) : (
//               <div className="text-gray-400 flex flex-col items-center justify-center">
//                 <IoMdImages className="text-6xl mb-4" />
//                 <p>No image available</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
//           {loading ? (
//             <div className="h-full flex items-center justify-center">
//               <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900"></div>
//             </div>
//           ) : (
//             <div className="p-6">
//               {products.length > 0 ? (
//                 <>
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {products.map((product) => (
//                       <div
//                         key={product.id}
//                         className="group cursor-pointer"
//                         onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(product.category)}&tbm=shop`, '_blank')}
//                       >
//                         <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
//                           <div className={`relative ${product.size === 'large' ? 'h-52' : 'h-44'}`}>
//                             <Image
//                               src={product.image}
//                               alt={product.title}
//                               fill
//                               className="object-contain group-hover:scale-105 transition-transform duration-300"
//                               unoptimized
//                             />
//                           </div>
//                           <div className="p-3">
//                             <p className="text-sm font-medium truncate" title={product.title}>
//                               {product.title}
//                             </p>
//                             <p className="text-sm text-gray-500">{product.category}</p>
//                             <div className="flex flex-col mt-1">
//                               <p className="text-blue-600 font-medium text-sm">{product.priceInINR}</p>
//                               <p className="text-xs text-gray-500">{product.price}</p>
//                             </div>
//                             {product.rating && (
//                               <div className="flex items-center mt-1">
//                                 <span className="text-yellow-400">★</span>
//                                 <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-6 flex justify-center">
//                     <button
//                       className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm flex items-center"
//                       onClick={() => window.open('https://www.google.com/search?q=clothing&tbm=shop', '_blank')}
//                     >
//                       See More <BsArrowRight className="ml-2" />
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex justify-center items-center h-full">
//                   <p className="text-gray-500">No products found</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <ImageSearchModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onImageSelect={handleNewImageSelect}
//       />
//     </div>
//   );
// };

// export default ImageSearchResults;