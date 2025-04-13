import React, { useRef, useState } from 'react';
import { Users, Video, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tone from './assets/tone.mp3';

const SocialPlatformLanding = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null); 
    const [isPlaying, setIsPlaying] = useState(false); 

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-16 space-y-6">
                        <button
                            onClick={toggleAudio}
                            className="inline-flex items-center justify-center p-2 bg-white bg-opacity-80 rounded-full shadow-sm mb-4 hover:bg-indigo-100 transition"
                        >
                            <Sparkles className="h-6 w-6 text-indigo-500 mr-2" />
                            <span className="text-sm font-medium text-gray-600">
                                {isPlaying ? 'Stop Listening' : 'Listen Together'}
                            </span>
                        </button>

                        <audio ref={audioRef} src={Tone} />

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                            Connect. Create. Engage.
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600">
                            Welcome to your social hub.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button
                            className="group relative bg-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 text-gray-800 hover:text-white rounded-xl px-8 py-6 shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
                            onClick={() => navigate('/Creator-Auth')}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center">
                                <Video className="h-6 w-6 mr-3" />
                                <span className="text-lg font-semibold">Admin Access</span>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
                        </button>

                        <button
                            className="group relative bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl px-8 py-6 shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
                            onClick={() => navigate('/Create-Room', { replace: true })}
                        >
                            <Users className="h-6 w-6 mr-3" />
                            <span className="text-lg font-semibold">Create Room</span>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
                        </button>
                    </div>

                    <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-400 opacity-30 animate-pulse" />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-300 to-purple-400 opacity-20 animate-pulse delay-150" />
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-300 to-pink-400 opacity-25 animate-pulse delay-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPlatformLanding;
