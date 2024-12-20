'use client'
import 'regenerator-runtime'
import { useState } from "react";
import Image from "next/image";
import { AiOutlineSearch } from 'react-icons/ai';
import { useRouter } from "next/navigation";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Main: React.FC = () => {
    const [search, setSearch] = useState<any>('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const router = useRouter();

    const googleLogo: string = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png';

    const onSearchSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`https://google.com/search?q=${search || transcript}`);
    }

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
    }

    const stopListening = () => {
        SpeechRecognition.stopListening()
        setSearch(transcript);
    }

    const selectImage = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const response = await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (!event.target) return;
                resolve(event.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsDataURL(file);
        });
        console.log(response);
        document.location.assign(`https://www.google.com/searchbyimage?&image_url=${response}`);
    }


    const handleMouseEnter = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        setTooltipPosition({ x: clientX, y: clientY });
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#202124] relative">
            <div className="flex flex-col items-center min-h-screen">
                <div className="flex-1 flex flex-col items-center mt-14">
                    <Image
                        src={googleLogo}
                        alt="logo"
                        width={270}
                        height={100}
                        priority
                    />
                    <div className="relative">
                        <form 
                            onSubmit={(e) => onSearchSubmit(e)} 
                            className="flex border border-gray-700 mt-7 px-4 rounded-full w-[584px] items-center bg-[#303134] hover:bg-[#404145]"
                            // onMouseEnter={() => setShowTooltip(true)}
                            // onMouseLeave={() => setShowTooltip(false)}
                        >
                            <AiOutlineSearch className="text-xl text-gray-400" />
                            <input
                                type="text"
                                className="w-full h-11 focus:outline-none text-sm mx-4 bg-transparent text-gray-200 placeholder-gray-400"
                                value={search || transcript}
                                onChange={(e) => setSearch(e.target.value)}
                                onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            />
                            {
                                listening ?
                                    <Image
                                        src="/pngwing.com.png"
                                        alt="mic"
                                        width={24}
                                        height={24}
                                        onClick={stopListening}
                                        className="cursor-pointer"
                                    />
                                    : <Image
                                        src="/pngwing.com.png"
                                        alt="mic"
                                        width={24}
                                        height={24}
                                        onClick={startListening}
                                        className="cursor-pointer"
                                    />
                            }
                            <label htmlFor="imageInput" className="ml-4">
                                <Image
                                    src="/Google_Lens_Icon.png"
                                    alt="Google Lens"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                />
                            </label>
                            <input
                                type="file"
                                id="imageInput"
                                className='hidden'
                                onChange={(e) => selectImage(e)}
                            />
                        </form>
                        {showTooltip && (
                            <div
                                className="absolute bg-[#303134] text-white text-xs py-1 px-3 shadow-md border border-white"
                                style={{
                                    left: tooltipPosition.x -420 ,
                                    top: tooltipPosition.y - 180, // Adjust to place it slightly below the cursor
                                    transform: 'translate(-50%, 0)', // Center the tooltip horizontally
                                }}
                            >
                                Search
                            </div>
                        )}
                    </div>
                    <div className="flex mt-7">
                        <button type='button'
                            className="bg-[#303134] mr-3 py-2 px-4 text-sm rounded hover:border border-gray-700 text-gray-200 font-medium"
                            onClick={(e) => onSearchSubmit(e)}>Google Search</button>
                        <button type='button'
                            className="bg-[#303134] py-2 px-4 text-sm rounded hover:border border-gray-700 font-medium text-gray-200"
                            onClick={() => router.push('https://www.google.com/doodles')}>I'm Feeling Lucky</button>
                    </div>
                    <div className="mt-7 text-sm text-gray-300">
                        Google offered in:{' '}
                        <span className="space-x-2">
                            <a href="#" className="text-blue-400 hover:underline">हिन्दी</a>
                            <a href="#" className="text-blue-400 hover:underline">বাংলা</a>
                            <a href="#" className="text-blue-400 hover:underline">తెలుగు</a>
                            <a href="#" className="text-blue-400 hover:underline">मराठी</a>
                            <a href="#" className="text-blue-400 hover:underline">தமிழ்</a>
                            <a href="#" className="text-blue-400 hover:underline">ગુજરાતી</a>
                            <a href="#" className="text-blue-400 hover:underline">ಕನ್ನಡ</a>
                            <a href="#" className="text-blue-400 hover:underline">മലയാളം</a>
                            <a href="#" className="text-blue-400 hover:underline">ਪੰਜਾਬੀ</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;