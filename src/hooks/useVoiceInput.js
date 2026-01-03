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

    // Initialize recognition only when language changes
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLang;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript;
            if (transcript) {
                const processedText = mapIndianNumerals(transcript);
                if (onResultRef.current) {
                    onResultRef.current(processedText);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [currentLang]); // Dependency on currentLang ONLY

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start failed", e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return { isListening, startListening, stopListening };
};
