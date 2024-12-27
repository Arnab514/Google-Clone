'use client'
import 'regenerator-runtime'
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AiOutlineSearch, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useRouter } from "next/navigation";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import VoiceSearchPage from './VoiceSearchPage';
import ImageSearchModal from './ImageSearchModal';
import ImageSearchResults from './ImageSearchResults';
import debounce from 'lodash/debounce';

const Main: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [tooltipText, setTooltipText] = useState<string>('');
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isVoiceSearchActive, setIsVoiceSearchActive] = useState<boolean>(false);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const router = useRouter();

    const googleLogo: string = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png';

    const generateSuggestions = (searchTerm: string): string[] => {
        const commonPrefixes = ['how to', 'what is', 'Who is', 'where to', 'why does', 'when did'];
        const commonSuffixes = ['near me', 'online', 'meaning', 'definition', 'examples'];
        
        let suggestions: string[] = [
            searchTerm,
            ...commonPrefixes.map(prefix => `${prefix} ${searchTerm}`),
            ...commonSuffixes.map(suffix => `${searchTerm} ${suffix}`),
        ];

        // Add some context-specific suggestions
        if (searchTerm.startsWith('how')) {
            suggestions.push(
                `${searchTerm} step by step`,
                `${searchTerm} tutorial`,
                `${searchTerm} guide`,
                `${searchTerm} for beginners`
            );
        } else if (searchTerm.startsWith('what')) {
            suggestions.push(
                `${searchTerm} mean`,
                `${searchTerm} definition`,
                `${searchTerm} explained`,
                `${searchTerm} examples`
            );
        } else {
            suggestions.push(
                `best ${searchTerm}`,
                `${searchTerm} reviews`,
                `${searchTerm} alternatives`,
                `top ${searchTerm}`,
                `${searchTerm} price`
            );
        }

        // Filter suggestions to match search term and remove duplicates
        return [...new Set(suggestions)]
            .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 10); // Limit to 10 suggestions
    };

    const debouncedFetch = useCallback(
        debounce((searchTerm: string) => {
            if (!searchTerm || searchTerm.length < 1) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            
            // Simulate network delay
            setTimeout(() => {
                const generatedSuggestions = generateSuggestions(searchTerm);
                setSuggestions(generatedSuggestions);
                setIsLoading(false);
            }, 200);
        }, 300),
        []
    );

    useEffect(() => {
        debouncedFetch(search);
        return () => debouncedFetch.cancel();
    }, [search, debouncedFetch]);

    const onSearchSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const searchQuery = search || transcript;
        if (searchQuery) {
            router.push(`https://google.com/search?q=${searchQuery}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    setSearch(suggestions[selectedIndex]);
                    setShowSuggestions(false);
                    router.push(`https://google.com/search?q=${suggestions[selectedIndex]}`);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const startListening = () => {
        setIsVoiceSearchActive(true);
        resetTranscript();
        SpeechRecognition.startListening({ continuous: false, language: 'en-IN' })
    }

    const stopListening = () => {
        SpeechRecognition.stopListening()
    }

    const handleVoiceSearchComplete = (finalTranscript: string) => {
        setSearch(finalTranscript);
        setIsVoiceSearchActive(false);
        router.push(`https://google.com/search?q=${finalTranscript}`);
    }

    const selectImage = async (imageData: string) => {
        try {
            const response = await fetch(imageData);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            localStorage.setItem('searchImage', imageData);
            router.push('/image-search-results');
            // router.push(`/image-search-results?image=${encodeURIComponent(imageData)}`);
            // document.location.assign(`https://www.google.com/searchbyimage?&image_url=${objectUrl}`);
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent, text: string) => {
        const { clientX, clientY } = e;
        let xOffset = 450;

        if (text === 'Search by voice') {
            xOffset = 490;
        } else if (text === 'Search by image') {
            xOffset = 490;
        }

        setTooltipPosition({ x: clientX - xOffset, y: clientY - 190 });
        setTooltipText(text);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as Element).closest('.search-suggestions-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const highlightMatch = (suggestion: string) => {
        if (!search) return suggestion;
        const regex = new RegExp(`(${search})`, 'gi');
        const parts = suggestion.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ?
                <span key={index} className="text-white font-medium">{part}</span> :
                <span key={index}>{part}</span>
        );
    };

    // if (!browserSupportsSpeechRecognition) {
    //     return null;
    // }
    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            return console.log("Unsupported")
        }
    }, []);

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
                    <div className="relative search-suggestions-container">
                        <form
                            onSubmit={onSearchSubmit}
                            className="flex border border-gray-700 mt-7 px-4 rounded-full w-[584px] items-center bg-[#303134] hover:bg-[#404145]"
                        >
                            <AiOutlineSearch className="text-xl text-gray-400" />
                            <input
                            title='search'
                                type="text"
                                className="w-full h-11 focus:outline-none text-sm mx-4 bg-transparent text-gray-200 placeholder-gray-400"
                                value={search || transcript}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={handleKeyDown}
                                onMouseEnter={(e) => handleMouseEnter(e, 'Search')}
                                onMouseLeave={handleMouseLeave}
                                // placeholder="Search Google or type a URL"
                            />
                            <div
                                onMouseEnter={(e) => handleMouseEnter(e, 'Search by voice')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Image
                                    src="/pngwing.com.png"
                                    alt="mic"
                                    width={30}
                                    height={30}
                                    onClick={listening ? stopListening : startListening}
                                    className="cursor-pointer mr-6"
                                />
                            </div>
                            <div
                                onClick={() => setIsImageSearchOpen(true)}
                                onMouseEnter={(e) => handleMouseEnter(e, 'Search by image')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Image
                                    src="/Google_Lens_Icon.png"
                                    alt="Google Lens"
                                    width={30}
                                    height={30}
                                    className="cursor-pointer"
                                />
                            </div>
                        </form>

                        {showSuggestions && search && (
                            <div className="absolute left-0 right-0 bg-[#303134] mt-1 rounded-lg border border-gray-700 shadow-lg max-h-96 overflow-y-auto z-50 w-[584px]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <AiOutlineLoading3Quarters className="animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className={`px-4 py-2 hover:bg-[#404145] cursor-pointer flex items-center ${
                                                selectedIndex === index ? 'bg-[#404145]' : ''
                                            }`}
                                            onClick={() => {
                                                setSearch(suggestion);
                                                setShowSuggestions(false);
                                                router.push(`https://google.com/search?q=${suggestion}`);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <AiOutlineSearch className="text-gray-400 mr-3 flex-shrink-0" />
                                            <span className="text-gray-300">{highlightMatch(suggestion)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {showTooltip && (
                            <div
                                className="absolute bg-[#303134] text-white text-xs py-1 px-2 rounded whitespace-nowrap"
                                style={{
                                    left: tooltipPosition.x,
                                    top: tooltipPosition.y,
                                    border: '1px solid #5f6368',
                                }}
                            >
                                {tooltipText}
                            </div>
                        )}
                    </div>
                    <div className="flex mt-7">
                        <button
                            type='button'
                            className="bg-[#303134] mr-3 py-2 px-4 text-sm rounded hover:border border-gray-700 text-gray-200 font-medium"
                            onClick={(e) => onSearchSubmit(e)}
                        >
                            Google Search
                        </button>
                        <button
                            type='button'
                            className="bg-[#303134] py-2 px-4 text-sm rounded hover:border border-gray-700 font-medium text-gray-200"
                            onClick={() => router.push('https://www.google.com/doodles')}
                        >
                            I'm Feeling Lucky
                        </button>
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
            
            {isVoiceSearchActive && (
                <VoiceSearchPage
                    isListening={listening}
                    transcript={transcript}
                    onClose={() => {
                        stopListening();
                        setIsVoiceSearchActive(false);
                    }}
                    onSearchComplete={handleVoiceSearchComplete}
                />
            )}

            <ImageSearchModal
                isOpen={isImageSearchOpen}
                onClose={() => setIsImageSearchOpen(false)}
                onImageSelect={selectImage}
            />
        </div>
    );
};

export default Main;