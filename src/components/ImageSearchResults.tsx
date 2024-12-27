'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const dummyProducts = [
  { id: 1, image: "/api/placeholder/180/240", platform: "Amazon", price: "$59.99", title: "Classic Denim Jacket", size: "medium" },
  { id: 2, image: "/api/placeholder/150/200", platform: "Flipkart", price: "$49.99", title: "Leather Bomber", size: "large" },
  { id: 3, image: "/api/placeholder/160/220", platform: "Myntra", price: "$39.99", title: "Casual Cotton Jacket", size: "small" },
  { id: 4, image: "/api/placeholder/170/230", platform: "Amazon", price: "$69.99", title: "Winter Puffer", size: "large" },
  { id: 5, image: "/api/placeholder/140/190", platform: "Myntra", price: "$45.99", title: "Sports Jacket", size: "large" },
  { id: 6, image: "/api/placeholder/190/250", platform: "Flipkart", price: "$55.99", title: "Windbreaker", size: "small" },
  { id: 7, image: "/api/placeholder/165/225", platform: "Amazon", price: "$65.99", title: "Bomber Jacket", size: "medium" },
  { id: 8, image: "/api/placeholder/175/235", platform: "Myntra", price: "$75.99", title: "Denim Jacket", size: "medium" }
];

const googleLogo = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
// const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png';
const url = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

const ImageSearchResults = ({ searchImage }: { searchImage: string }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <Link href="/">
          <Image
            src={googleLogo}
            alt="Google"
            width={92}
            height={30}
            className="cursor-pointer"
            priority
          />
        </Link>
        <Image 
          src={url} 
          alt="dp" 
          className="rounded-full object-cover cursor-pointer"
          width={30}
          height={100}
          style={{ height: 30 }}
        />
      </header>

      <div className="flex w-full">
        <div className="w-1/2 p-6 bg-[#202124]">
          <div className="sticky top-20">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={searchImage}
                alt="Search reference"
                className="w-full object-contain max-h-[500px]"
              />
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Visual matches for your image
            </div>
          </div>
        </div>

        <div className="w-1/2 p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="grid grid-cols-4 gap-4">
            {dummyProducts.map((product) => {
              const getSize = () => {
                const sizes = {
                  small: 'h-[160px]',
                  medium: 'h-[200px]',
                  large: 'h-[240px]'
                };
                return sizes[product.size] || sizes.medium;
              };

              return (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`relative ${getSize()}`}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-500">{product.platform}</p>
                      <p className="text-blue-600 font-medium text-sm mt-1">{product.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchResults;