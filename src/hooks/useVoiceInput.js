import { useState, useEffect, useCallback, useRef } from 'react';

const mapIndianNumerals = (text) => {
    const numeralMap = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
        '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4',
        '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౺': '9'
    };
    return text.split('').map(char => numeralMap[char] || char).join('');
};

export const useVoiceInput = (currentLang, onResult) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const onResultRef = useRef(onResult);

    // Keep the callback ref current
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    const [voiceError, setVoiceError] = useState(null);

    const startListening = useCallback(() => {
        setVoiceError(null);
        if (recognitionRef.current && !isListening) {
            try {
                setIsListening(true); // Optimistic update
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start failed", e);
                setIsListening(false);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            // setIsListening(false); // Let onend handle this to be safe, or do optimistic input?
            // "onend" will eventually fire, but for UI responsiveness on 'stop' click, 
            // the user might expect immediate feedback, but 'stop' is usually fast.
            // Let's rely on onend for 'false' state to ensure the engine is actually done,
            // but for 'start' we needed it fast to show 'red'.
        }
    }, [isListening]);

    // Initialize recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true; // Enable interim results for real-time feedback
        recognition.lang = currentLang;

        // recognition.onstart = () => setIsListening(true); // We handle this manually in startListening now to avoid delay/race

        recognition.onend = () => {
            console.log("Voice Input Ended");
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (interimTranscript) {
                console.log("Interim Voice:", interimTranscript);
            }

            if (finalTranscript) {
                console.log("Final Voice Result:", finalTranscript);
                setVoiceError(null);

                const processedText = mapIndianNumerals(finalTranscript);
                if (onResultRef.current) {
                    onResultRef.current(processedText);
                }
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                console.warn("Voice input: No speech detected.");
                setVoiceError('no-speech');
            } else {
                console.error("Speech recognition error", event.error);
                setVoiceError(event.error);
            }
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [currentLang]);

    return { isListening, startListening, stopListening, voiceError };
};
