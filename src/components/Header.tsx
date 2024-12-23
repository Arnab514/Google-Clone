// 'use client'

import Link from "next/link";
import Image from "next/image";
import { TbGridDots } from 'react-icons/tb';

const Header: React.FC = () => {
    const url: string = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80";

    return (
        <div className="flex justify-between items-center px-4 pt-3 bg-[#202124]">
            {/* Left Section */}
            <div className="flex space-x-4 ml-3">
                <Link href='https://about.google/' className="hover:underline text-sm text-gray-200">About</Link>
                <Link href='https://store.google.com/' className="hover:underline text-sm text-gray-200">Store</Link>
            </div>

            {/* Right Section */}
            <div className="flex space-x-4 items-center">
                <Link href='https://mail.google.com' className="hover:underline text-sm text-gray-200">Gmail</Link>
                <Link href='https://image.google.com' className="hover:underline text-sm text-gray-200">Images</Link>
                <TbGridDots className="text-4xl text-gray-200 hover:bg-[#303134] p-2 rounded-full cursor-pointer" />
                <Image 
                    src={url} 
                    alt="dp" 
                    className="rounded-full object-cover cursor-pointer"
                    width={30}
                    height={100}
                    style={{ height: 30 }}
                />
            </div>
        </div>
    );
}

export default Header;
