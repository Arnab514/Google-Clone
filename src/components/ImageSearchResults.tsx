// 'use client'
// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// const dummyProducts = [
//   { id: 1, image: "/api/placeholder/180/240", platform: "Amazon", price: "$59.99", title: "Classic Denim Jacket", size: "medium" },
//   { id: 2, image: "/api/placeholder/150/200", platform: "Flipkart", price: "$49.99", title: "Leather Bomber", size: "large" },
//   { id: 3, image: "/api/placeholder/160/220", platform: "Myntra", price: "$39.99", title: "Casual Cotton Jacket", size: "small" },
//   { id: 4, image: "/api/placeholder/170/230", platform: "Amazon", price: "$69.99", title: "Winter Puffer", size: "large" },
//   { id: 5, image: "/api/placeholder/140/190", platform: "Myntra", price: "$45.99", title: "Sports Jacket", size: "large" },
//   { id: 6, image: "/api/placeholder/190/250", platform: "Flipkart", price: "$55.99", title: "Windbreaker", size: "small" },
//   { id: 7, image: "/api/placeholder/165/225", platform: "Amazon", price: "$65.99", title: "Bomber Jacket", size: "medium" },
//   { id: 8, image: "/api/placeholder/175/235", platform: "Myntra", price: "$75.99", title: "Denim Jacket", size: "medium" }
// ];

// const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
// // const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png';
// const url = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

// const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
//   return (
//     <div className="min-h-screen bg-white">
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
//         <Link href="/">
//           <Image
//             src={googleLogo}
//             alt="Google"
//             width={92}
//             height={30}
//             className="cursor-pointer"
//             priority
//           />
//         </Link>
//         <Image 
//           src={url} 
//           alt="dp" 
//           className="rounded-full object-cover cursor-pointer"
//           width={30}
//           height={100}
//           style={{ height: 30 }}
//         />
//       </header>

//       <div className="flex w-full">
//         <div className="w-1/2 p-6 bg-[#202124]">
//           <div className="sticky top-20">
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <img
//                 src={searchImage}
//                 alt="Search reference"
//                 className="w-full object-contain max-h-[500px]"
//               />
//             </div>
//             <div className="mt-4 text-sm text-gray-400">
//               Visual matches for your image
//             </div>
//           </div>
//         </div>

//         <div className="w-1/2 p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
//           <div className="grid grid-cols-4 gap-4">
//             {dummyProducts.map((product) => {
//               const getSize = () => {
//                 const sizes = {
//                   small: 'h-[160px]',
//                   medium: 'h-[200px]',
//                   large: 'h-[240px]'
//                 };
//                 return sizes[product.size] || sizes.medium;
//               };

//               return (
//                 <div
//                   key={product.id}
//                   className="group cursor-pointer"
//                 >
//                   <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className={`relative ${getSize()}`}>
//                       <Image
//                         src={product.image}
//                         alt={product.title}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                     <div className="p-3">
//                       <p className="text-sm text-gray-500">{product.platform}</p>
//                       <p className="text-blue-600 font-medium text-sm mt-1">{product.price}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageSearchResults;



// 'use client'
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
// const url = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

// const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const searchQuery = encodeURIComponent('Jackets');
//       const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${searchQuery}&country=us&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY`;
      
//       const options = {
//         method: 'GET',
//         headers: {
//           'x-rapidapi-key': '361c633106msh4d5824daee53689p119c14jsndf2114194c83',
//           'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
//         }
//       };

//       try {
//         const response = await fetch(url, options);
//         const data = await response.json();
        
//         if (data?.status === "OK" && data?.data?.products && Array.isArray(data.data.products)) {
//           const transformedProducts = data.data.products.map((item, index) => ({
//             id: item.product_id,
//             image: item.product_photos?.[0] || "/api/placeholder/180/240",
//             platform: "Google Shopping",
//             price: item.offer?.price ? `$${item.offer.price}` : "Price not available",
//             title: item.product_title,
//             rating: item.product_rating,
//             numReviews: item.product_num_reviews,
//             size: index % 2 === 0 ? 'medium' : 'large', // Simplified size determination
//             productUrl: item.product_page_url
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

//   return (
//     <main className="flex min-h-screen flex-col bg-white">
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
//         <Link href="/" className="relative h-8 w-24">
//           <Image
//             src={googleLogo}
//             alt="Google"
//             fill
//             className="object-contain"
//             priority
//           />
//         </Link>
//         <div className="relative h-8 w-8">
//           <Image 
//             src={url} 
//             alt="Profile"
//             fill
//             className="rounded-full object-cover"
//           />
//         </div>
//       </header>

//       <div className="flex flex-1">
//         <div className="w-1/2 p-6 bg-[#202124]">
//           <div className="sticky top-20">
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <img
//                 src={searchImage}
//                 alt="Search reference"
//                 className="w-full object-contain max-h-[500px]"
//               />
//             </div>
//             <div className="mt-4 text-sm text-gray-400">
//               Visual matches for your image
//             </div>
//           </div>
//         </div>

//         <div className="w-1/2 p-6 overflow-y-auto">
//           {loading ? (
//             <div className="flex justify-center items-center h-full">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//             </div>
//           ) : products.length > 0 ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="group cursor-pointer"
//                   onClick={() => window.open(product.productUrl, '_blank')}
//                 >
//                   <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className={`relative ${product.size === 'large' ? 'h-56' : 'h-48'}`}>
//                       <Image
//                         src={product.image}
//                         alt={product.title}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                     <div className="p-3">
//                       <p className="text-sm font-medium truncate" title={product.title}>
//                         {product.title}
//                       </p>
//                       <p className="text-sm text-gray-500">{product.platform}</p>
//                       <p className="text-blue-600 font-medium text-sm mt-1">{product.price}</p>
//                       {product.rating && (
//                         <div className="flex items-center mt-1">
//                           <span className="text-yellow-400">★</span>
//                           <span className="text-sm ml-1">{product.rating}</span>
//                           {product.numReviews && (
//                             <span className="text-sm text-gray-500 ml-1">
//                               ({product.numReviews.toLocaleString()})
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center h-full">
//               <p className="text-gray-500">No products found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ImageSearchResults;






// 'use client'
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
// const url = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

// const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const searchQuery = encodeURIComponent('Mens Jackets');
//       const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${searchQuery}&country=us&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY`;
      
//       const options = {
//         method: 'GET',
//         headers: {
//           'x-rapidapi-key': '361c633106msh4d5824daee53689p119c14jsndf2114194c83',
//           'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
//         }
//       };

//       try {
//         const response = await fetch(url, options);
//         const data = await response.json();
        
//         if (data?.status === "OK" && data?.data?.products && Array.isArray(data.data.products)) {
//           const transformedProducts = data.data.products.map((item, index) => ({
//             id: item.product_id,
//             image: item.product_photos?.[0] || "/api/placeholder/180/240",
//             platform: "Google Shopping",
//             price: item.offer?.price ? `${item.offer.price}` : "Price not available",
//             title: item.product_title,
//             rating: item.product_rating,
//             numReviews: item.product_num_reviews,
//             size: index % 2 === 0 ? 'medium' : 'large',
//             productUrl: item.product_page_url
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
//           />
//         </Link>
//         <div className="relative h-8 w-8">
//           <Image 
//             src={url} 
//             alt="Profile"
//             fill
//             className="rounded-full object-cover"
//           />
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-1/2 bg-[#202124] overflow-y-auto">
//           <div className="sticky top-0 p-6">
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <img
//                 src={searchImage}
//                 alt="Search reference"
//                 className="w-full object-contain max-h-[500px]"
//               />
//             </div>
//             <div className="mt-4 text-sm text-gray-400">
//               Visual matches for your image
//             </div>
//           </div>
//         </div>

//         <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
//           <div className="p-6">
//             {loading ? (
//               <div className="flex justify-center items-center h-full top-20">
//                 <div className="animate-spin rounded-full h-20 w-20 my-auto border-b-4 border-gray-900"></div>
//               </div>
//             ) : products.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {products.map((product) => (
//                   <div
//                     key={product.id}
//                     className="group cursor-pointer"
//                     onClick={() => window.open(product.productUrl, '_blank')}
//                   >
//                     <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
//                       <div className={`relative ${product.size === 'large' ? 'h-56' : 'h-48'}`}>
//                         <Image
//                           src={product.image}
//                           alt={product.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                       <div className="p-3">
//                         <p className="text-sm font-medium truncate" title={product.title}>
//                           {product.title}
//                         </p>
//                         <p className="text-sm text-gray-500">{product.platform}</p>
//                         <p className="text-blue-600 font-medium text-sm mt-1">{product.price}</p>
//                         {product.rating && (
//                           <div className="flex items-center mt-1">
//                             <span className="text-yellow-400">★</span>
//                             <span className="text-sm ml-1">{product.rating}</span>
//                             {product.numReviews && (
//                               <span className="text-sm text-gray-500 ml-1">
//                                 ({product.numReviews.toLocaleString()})
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex justify-center items-center h-full">
//                 <p className="text-gray-500">No products found</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageSearchResults;




// 'use client'
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { TbGridDots } from 'react-icons/tb';

// const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
// const url = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

// const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const searchQuery = encodeURIComponent('Mens Jackets');
//       const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${searchQuery}&country=us&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY`;

//       const options = {
//         method: 'GET',
//         headers: {
//           'x-rapidapi-key': '361c633106msh4d5824daee53689p119c14jsndf2114194c83',
//           'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
//         }
//       };

//       try {
//         const response = await fetch(url, options);
//         const data = await response.json();

//         if (data?.status === "OK" && data?.data?.products && Array.isArray(data.data.products)) {
//           const transformedProducts = data.data.products.map((item, index) => ({
//             id: item.product_id,
//             image: item.product_photos?.[0] || "/api/placeholder/180/240",
//             platform: "Google Shopping",
//             price: item.offer?.price ? `${item.offer.price}` : "Price not available",
//             title: item.product_title,
//             rating: item.product_rating,
//             numReviews: item.product_num_reviews,
//             size: index % 2 === 0 ? 'medium' : 'large',
//             productUrl: item.product_page_url
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
//           />
//         </Link>
//         <div className="flex items-center space-x-4">
//           <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
//             Upload
//           </button>
//           <TbGridDots className="text-4xl text-gray-700 hover:bg-[#303134] p-2 rounded-full cursor-pointer" />
//           <div className="relative h-8 w-8">
//             <Image 
//               src={url} 
//               alt="Profile"
//               fill
//               className="rounded-full object-cover"
//             />
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-1/2 bg-[#202124] flex items-center justify-center">
//           <div className="p-6 w-full relative max-h-[80%] max-w-[90%]">
//             <div className="border border-gray-200 rounded-lg  ">
//               <img
//                 src={searchImage}
//                 alt="Search reference"
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
//           <div className="p-6">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900"></div>
//               </div>
//             ) : products.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {products.map((product) => (
//                   <div
//                     key={product.id}
//                     className="group cursor-pointer"
//                     onClick={() => window.open(product.productUrl, '_blank')}
//                   >
//                     <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
//                       <div className={`relative ${product.size === 'large' ? 'h-56' : 'h-48'}`}>
//                         <Image
//                           src={product.image}
//                           alt={product.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                       <div className="p-3">
//                         <p className="text-sm font-medium truncate" title={product.title}>
//                           {product.title}
//                         </p>
//                         <p className="text-sm text-gray-500">{product.platform}</p>
//                         <p className="text-blue-600 font-medium text-sm mt-1">{product.price}</p>
//                         {product.rating && (
//                           <div className="flex items-center mt-1">
//                             <span className="text-yellow-400">★</span>
//                             <span className="text-sm ml-1">{product.rating}</span>
//                             {product.numReviews && (
//                               <span className="text-sm text-gray-500 ml-1">
//                                 ({product.numReviews.toLocaleString()})
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex justify-center items-center h-full">
//                 <p className="text-gray-500">No products found</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageSearchResults;


'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TbGridDots } from 'react-icons/tb';

const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const url = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

type Product = {
  id: string;
  image: string;
  platform: string;
  price: string;
  title: string;
  rating?: number;
  numReviews?: number;
  size: 'medium' | 'large';
  productUrl: string;
};

const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const searchQuery = encodeURIComponent('Mens Jackets');
      const url = `https://real-time-product-search.p.rapidapi.com/search-v2?q=${searchQuery}&country=us&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY`;

      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '361c633106msh4d5824daee53689p119c14jsndf2114194c83',
          'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data?.status === "OK" && data?.data?.products && Array.isArray(data.data.products)) {
          const transformedProducts: Product[] = data.data.products.map((item, index) => ({
            id: item.product_id,
            image: item.product_photos?.[0] || "/api/placeholder/180/240",
            platform: "Google Shopping",
            price: item.offer?.price ? `${item.offer.price}` : "Price not available",
            title: item.product_title,
            rating: item.product_rating,
            numReviews: item.product_num_reviews,
            size: index % 2 === 0 ? 'medium' : 'large',
            productUrl: item.product_page_url
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
          />
        </Link>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Upload
          </button>
          <TbGridDots className="text-4xl text-gray-700 hover:bg-[#303134] p-2 rounded-full cursor-pointer" />
          <div className="relative h-8 w-8">
            <Image 
              src={url} 
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 bg-[#202124] flex items-center justify-center">
          <div className="max-w-[90%]  w-full max-h-[90vh] flex items-center">
            <div className="border border-gray-200 rounded-lg w-full">
              <img
                src={searchImage}
                alt="Search reference"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900"></div>
            </div>
          ) : (
            <div className="p-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group cursor-pointer"
                      onClick={() => window.open(product.productUrl, '_blank')}
                    >
                      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`relative ${product.size === 'large' ? 'h-56' : 'h-48'}`}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate" title={product.title}>
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500">{product.platform}</p>
                          <p className="text-blue-600 font-medium text-sm mt-1">{product.price}</p>
                          {product.rating && (
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm ml-1">{product.rating}</span>
                              {product.numReviews && (
                                <span className="text-sm text-gray-500 ml-1">
                                  ({product.numReviews.toLocaleString()})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
