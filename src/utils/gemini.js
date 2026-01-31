/**
 * Gemini AI Service for Instructions Extraction
 * Using direct fetch to avoid dependency installation issues.
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Extracts concise instructions from a raw voice transcript.
 * @param {string} transcript - The raw text from speech-to-text.
 * @param {string} language - The current language (en, hi, te).
 * @param {string} apiKey - The Gemini API key.
 */
export const extractInstructions = async (transcript, language = 'en', apiKey) => {
    if (!apiKey) {
        console.warn("Gemini API key is missing. Skipping AI cleaning.");
        return transcript;
    }

    if (!transcript || transcript.trim().length < 10) {
        return transcript; // Too short to be rambling
    }

    const prompts = {
        en: "You are an assistant for a shopkeeper. Extract only the specific delivery or special instructions from this transcript: '{transcript}'. Ignore greetings, side talk, or filler words. Keep it very concise. If no instructions are found, return the original text.",
        hi: "आप एक दुकानदार के सहायक हैं। इस ट्रांसक्रिप्ट से केवल विशिष्ट डिलीवरी या विशेष निर्देश निकालें: '{transcript}'। अभिवादन, इधर-उधर की बातें हटा दें। इसे बहुत संक्षिप्त रखें। यदि कोई निर्देश नहीं मिलता है, तो मूल टेक्स्ट वापस करें।",
        te: "మీరు ఒక దుకాణదారునికి సహాయకుడిగా ఉన్నారు. ఈ టెక్స్ట్ నుండి కేవలం డెలివరీ లేదా ప్రత్యేక సూచనలను మాత్రమే సేకరించండి: '{transcript}'. ఇతర మాటలు, పలకరింపులు తొలగించండి. చాలా క్లుప్తంగా ఉంచండి. ఏ సూచనలు లేకపోతే, అసలు టెక్స్ట్ తిరిగి ఇవ్వండి."
    };

    const promptBase = prompts[language] || prompts.en;
    const prompt = promptBase.replace("{transcript}", transcript);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1, // Low temperature for consistent extraction
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 100,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gemini API call failed");
        }

        const data = await response.json();
        const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return extractedText ? extractedText.trim() : transcript;
    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        return transcript; // Fallback to raw text on error
    }
};
