import { useState, useEffect, useMemo, useCallback } from 'react';
import { translations, languages } from '../translations';
import { useVoiceInput } from './useVoiceInput';
import { formConfig } from '../formConfig';

export const useBillLogic = () => {
    const [lang, setLang] = useState('te');
    const [voiceLang, setVoiceLang] = useState('te-IN');
    const [activeField, setActiveField] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [theme, setTheme] = useState('light');

    const [data, setData] = useState({
        customerName: '',
        mobileNumber: '',
        itemName: '',
        quantity: '',
        totalAmount: '',
        advanceAmount: '',
        deliveryDate: ''
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Voice Result Handler
    const handleVoiceResult = useCallback((text) => {
        if (activeField) {
            setData(prev => ({ ...prev, [activeField]: text }));
            setActiveField(null);
        }
    }, [activeField]);

    // Voice Hook
    const { isListening, startListening, stopListening, voiceError } = useVoiceInput(voiceLang, handleVoiceResult);

    // Sync activeField with listening state
    useEffect(() => {
        if (!isListening && activeField) {
            setActiveField(null);
        }
    }, [isListening, activeField]);

    const t = translations[lang];

    // Logic Actions
    const handleLangSwitch = (code) => {
        setLang(code);
        const lang = languages.find(x => x.code === code);
        if (lang) setVoiceLang(lang.voiceLang);
    };

    const speakPrompt = (promptKey) => {
        if (isMuted) return;
        const text = t.prompts[promptKey];
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const matchingVoice = voices.find(v => v.lang === voiceLang || v.lang.replace('_', '-') === voiceLang);
            if (matchingVoice) utterance.voice = matchingVoice;
            utterance.lang = voiceLang;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleMicClick = (fieldKey) => {
        if (activeField === fieldKey && isListening) {
            stopListening();
            setActiveField(null);
        } else {
            setActiveField(fieldKey);
            startListening();
        }
    };

    const handlePositiveNumberChange = (field, value) => {
        if (value === '') {
            setData(prev => ({ ...prev, [field]: value }));
            return;
        }
        const num = parseFloat(value);
        if (!isNaN(num) && num >= 0) {
            setData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Validation Helper
    const validateField = (field, value) => {
        const config = formConfig[field];
        if (!config || !config.validation) return '';

        if (config.validation.required && !value.trim()) {
            return 'Field is required';
        }
        if (config.validation.minLength && value.length < config.validation.minLength) {
            return config.validation.errorMessage;
        }
        if (config.validation.pattern && !config.validation.pattern.test(value)) {
            return config.validation.errorMessage;
        }
        return '';
    };

    // Generic handler for text fields to keep components clean
    const handleChange = (field, value) => {
        setData(prev => {
            const newData = { ...prev, [field]: value };

            // Validate on change
            const error = validateField(field, value);
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: error
            }));

            // Check overall form validity
            const newErrors = { ...errors, [field]: error };
            const isValid = Object.keys(formConfig).every(key => {
                const config = formConfig[key];
                if (!config?.validation) return true;
                const fieldVal = key === field ? value : newData[key]; // Use fresh value for current field
                return !validateField(key, fieldVal);
            });
            setIsFormValid(isValid);

            return newData;
        });
    };

    const handleSendWhatsApp = () => {
        const { customerName, mobileNumber, itemName, quantity, totalAmount, advanceAmount, deliveryDate } = data;
        // Recalculate balance for the message to be sure
        const currentBalance = Math.max(0, (parseFloat(totalAmount) || 0) - (parseFloat(advanceAmount) || 0));

        const msg = `━━━━━━━━━━━━━━
✨      *BILL RECEIPT* ✨
━━━━━━━━━━━━━━

👤  *Customer:* ${customerName}
🛍️  *Item:* ${itemName}
🔢  *Quantity:* ${quantity}

------------------------------------
💰  *Total:* ₹${totalAmount}
💳  *Advance:* ₹${advanceAmount}
🔴  *Balance:* *₹${currentBalance}* 
------------------------------------

📅  *Delivery:* ${deliveryDate}

━━━━━━━━━━━━━━
🙏  *Thank you for shopping!*  🙏
     Have a great day!`.trim();

        const encodedMsg = encodeURIComponent(msg);
        const url = `https://api.whatsapp.com/send?phone=+91${mobileNumber}&text=${encodedMsg}`;
        window.open(url, '_blank');
    };

    // Derived State
    const balance = useMemo(() => {
        const total = parseFloat(data.totalAmount) || 0;
        const advance = parseFloat(data.advanceAmount) || 0;
        return Math.max(0, total - advance);
    }, [data.totalAmount, data.advanceAmount]);


    const toggleMute = () => setIsMuted(prev => !prev);
    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newTheme;
        });
    };

    // Initialize theme on mount
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return {
        state: { lang, data, activeField, isListening, balance, isMuted, theme, errors, isFormValid },
        actions: {
            setData,
            handleLangSwitch,
            handleMicClick,
            speakPrompt,
            handlePositiveNumberChange,
            handleChange,
            handleSendWhatsApp,
            toggleMute,
            toggleTheme
        },
        t,
        languages
    };
};
