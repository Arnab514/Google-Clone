'use client'
import 'regenerator-runtime'
import { useState } from "react";
import Image from "next/image";
import { AiOutlineSearch } from 'react-icons/ai';
import { useRouter } from "next/navigation";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Main: React.FC = () => {
    const [search, setSearch] = useState<any>('');
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const router = useRouter();

    const googleLogo: string = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

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

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    return (
        <div className="flex flex-col items-center mt-28">
            <Image
                src={googleLogo}
                alt="logo"
                width={270}
                height={100}
            />
            <form onSubmit={(e) => onSearchSubmit(e)} className="flex border mt-7 px-5 py-2 rounded-full w-2/5 items-center hover:shadow-md">
                <AiOutlineSearch className="text-2xl text-slate-400" />
                <input
                    type="text"
                    className="w-full focus:outline-none ml-4"
                    value={search || transcript}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {
                    listening ?
                        <Image
                            src="/pngwing.com.png"
                            alt="mic"
                            width={30}
                            height={30}
                            onClick={stopListening}
                            className="cursor-pointer mr-5"
                        />
                        : <Image
                            src="/pngwing.com.png"
                            alt="mic"
                            width={30}
                            height={30}
                            onClick={startListening}
                            className="cursor-pointer mr-5"
                        />
                }
                <label htmlFor="imageInput">
                    <Image
                        src="/Google_Lens_Icon.png"
                        alt="Google Lens"
                        width={28}
                        height={28}
                        className="cursor-pointer mr-5"
                    />
                </label>
                <input
                    type="file"
                    id="imageInput"
                    className='hidden'
                    onChange={(e) => selectImage(e)}
                />
            </form>
            <div className="flex mt-7">
                <button type='button'
                    className="bg-slate-100 mr-3 py-2 px-4 text-sm rounded hover:border"
                    onClick={(e) => onSearchSubmit(e)}>Google Search</button>
                <button type='button'
                    className="bg-slate-100 py-2 px-4 text-sm  rounded hover:border"
                    onClick={() => router.push('https://www.google.com/doodles')}>I'm Feeling Lucky</button>
            </div>
        </div>
    )
}

export default Main;
