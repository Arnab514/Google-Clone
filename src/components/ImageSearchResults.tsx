'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TbGridDots } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';

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
      <div className="mt-6 flex justify-center">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
};

const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
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
      }
    };

    fetchProducts();
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
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Upload
          </button>
          <TbGridDots className="text-4xl text-gray-700 hover:bg-[#303134] p-2 rounded-full cursor-pointer" />
          <div className="relative h-8 w-8">
            <Image 
              src={profileUrl} 
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 bg-[#202124] flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="mb-8 text-center text-gray-300 text-md font-medium">
                <p>You searched for this</p>
              </div>

              <div className="max-w-full max-h-full overflow-hidden flex items-center justify-center">
                {mounted && (
                  <img
                    src={searchImage}
                    alt="Search reference"
                    sizes="100vw"
                    className="w-auto max-w-full max-h-[75vh]"
                  />
                )}
              </div>

              <div className="mt-20 text-center text-gray-300 text-md font-medium">
                <p>Here are the suitable results for your image</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/3 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="p-6">
              {products.length > 0 ? (
                <>
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="group mb-4 cursor-pointer break-inside-avoid-column"
                        onClick={() => window.open(`https://www.google.com/search?q=${product.category}&tbm=shop`, '_blank')}
                      >
                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <div className="flex flex-col mt-1">
                              <p className="text-blue-600 font-medium text-sm">{product.priceInINR}</p>
                              <p className="text-xs text-gray-500">{product.price}</p>
                            </div>
                            {product.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      className="px-6 py-2 text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium text-sm flex items-center"
                      onClick={() => window.open('https://www.google.com/search?q=clothing&tbm=shop', '_blank')}
                    >
                      See More <BsArrowRight className="ml-2" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No products found</p>
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