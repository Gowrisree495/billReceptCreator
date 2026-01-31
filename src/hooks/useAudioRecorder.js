import { useState, useRef, useCallback } from 'react';

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [error, setError] = useState(null);
    
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Determine supported MIME type
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
                ? 'audio/webm' 
                : 'audio/mp4';
            
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                
                // Revoke previous URL to prevent memory leaks
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }
                
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                setError('Recording failed');
                setIsRecording(false);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
            setError(err.name === 'NotAllowedError' 
                ? 'Microphone access denied' 
                : 'Failed to start recording');
            setIsRecording(false);
        }
    }, [audioUrl]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const clearRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
    }, [audioUrl]);

    return {
        isRecording,
        audioBlob,
        audioUrl,
        error,
        startRecording,
        stopRecording,
        clearRecording
    };
};
