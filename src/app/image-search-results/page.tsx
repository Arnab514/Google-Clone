'use client'
import { useSearchParams } from 'next/navigation';
import ImageSearchResults from '../../components/ImageSearchResults';
import { useEffect, useState } from 'react';

export default function ImageResultsPage() {
    // const searchParams = useSearchParams();
    // const image = searchParams.get('image');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const storedImage = localStorage.getItem('searchImage');
        if (storedImage) {
            setImage(storedImage);
            localStorage.removeItem('searchImage');
        }
    }, []);

    return image ? <ImageSearchResults searchImage={image} /> : null;
}