import React, { useRef, useEffect, useState } from 'react';

const InstructionsRow = ({
    label,
    value,
    onChange,
    placeholder,
    onClick,  // For speakPrompt when clicking the label
    // Combined voice + recording props
    onVoiceRecordClick,
    isActive,  // true when either listening or recording
    isCleaning, // true when Gemini AI is processing
    audioUrl,
    onClearAudio
}) => {
    const textareaRef = useRef(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const borderColor = isActive ? "border-red-500" : "border-transparent";

    const handleContainerClick = () => {
        if (onClick) {
            onClick();
        } else if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleLabelClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        }
    };

    // Auto-resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Audio playback failed:', err);
                });
            }
        }
    };

    // Handle audio ended event
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setIsPlaying(false);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
        }
    }, [audioUrl]);

    // Update playing state when audio starts
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
            return () => {
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('pause', handlePause);
            };
        }
    }, [audioUrl]);

    return (
        <div>
            <div
                className={`relative flex flex-col bg-white dark:bg-slate-900 rounded-xl p-4 border-2 transition-colors duration-200 ${borderColor} focus-within:border-emerald-500 dark:focus-within:border-slate-700 border-gray-200 dark:border-transparent shadow-sm dark:shadow-none`}
                onClick={handleContainerClick}
            >
                {/* Header with label and controls */}
                <div className="flex items-center justify-between mb-2">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={handleLabelClick}
                    >
                        <div className="flex-shrink-0 mr-3 text-amber-500">
                            <span className="material-icons text-3xl">description</span>
                        </div>
                        <label className="block text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold cursor-pointer">
                            {label}
                        </label>
                    </div>

                    {/* Control buttons */}
                    <div className="flex items-center gap-2">
                        {/* Single mic button for both speech-to-text AND audio recording */}
                        {onVoiceRecordClick && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onVoiceRecordClick();
                                }}
                                className={`p-3 rounded-full transition-all ${isActive ? 'bg-red-600 animate-pulse text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                                title={isActive ? "Stop Recording" : "Voice Input & Record"}
                            >
                                <span className="material-icons">{isActive ? 'stop_circle' : 'mic_none'}</span>
                            </button>
                        )}

                        {/* Play audio button - only show when audio is available and not currently recording */}
                        {audioUrl && !isActive && (
                            <>
                                <button
                                    onClick={handlePlayAudio}
                                    className={`p-3 rounded-full transition-all ${isPlaying ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                                    title={isPlaying ? "Stop Playback" : "Play Recording"}
                                >
                                    <span className="material-icons">{isPlaying ? 'stop' : 'play_arrow'}</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (audioRef.current) {
                                            audioRef.current.pause();
                                            audioRef.current.currentTime = 0;
                                        }
                                        setIsPlaying(false);
                                        onClearAudio?.();
                                    }}
                                    className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                                    title="Delete Recording"
                                >
                                    <span className="material-icons">delete</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent text-gray-900 dark:text-white text-lg font-medium outline-none placeholder-gray-400 dark:placeholder-slate-600 resize-none min-h-[80px]"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                />

                {/* Audio element for playback - always render when URL exists */}
                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        preload="metadata"
                        style={{ display: 'none' }}
                    />
                )}

                {/* Recording indicator */}
                {isActive && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-bold">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        Recording & Transcribing...
                    </div>
                )}

                {/* AI Cleaning indicator */}
                {isCleaning && (
                    <div className="flex items-center gap-2 mt-2 text-blue-500 text-sm font-bold">
                        <span className="material-icons text-lg animate-spin">sync</span>
                        ✨ Extraction in progress - cleaning instructions...
                    </div>
                )}

                {/* Audio saved indicator */}
                {audioUrl && !isActive && !isCleaning && (
                    <div className="flex items-center gap-2 mt-2 text-emerald-500 text-sm font-medium">
                        <span className="material-icons text-lg">check_circle</span>
                        Audio saved - tap play to listen
                    </div>
                )}
            </div>
            <div className="mb-4"></div>
        </div>
    );
};

export default InstructionsRow;
