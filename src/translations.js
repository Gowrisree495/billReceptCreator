export const translations = {
    en: {
        customerName: "Customer Name",
        mobileNumber: "Mobile Number",
        itemName: "Item Name",
        quantity: "Quantity",
        totalAmount: "Total Amount",
        advanceAmount: "Advance Amount",
        deliveryDate: "Delivery Date",
        balance: "Balance Due",
        submit: "Send on WhatsApp",
        prompts: {
            customerName: "Who is this bill for?",
            mobileNumber: "What is the mobile number?",
            itemName: "What is the item name?",
            quantity: "How much quantity?",
            totalAmount: "What is the total amount?",
            advanceAmount: "How much advance received?",
        }
    },
    hi: {
        customerName: "साहब का नाम", // "Customer Name" in Hindi context usually "Grahak Ka Naam" or just "Naam"
        mobileNumber: "मोबाइल नंबर",
        itemName: "सामान का नाम",
        quantity: "कितना सामान (मात्रा)",
        totalAmount: "कुल राशि",
        advanceAmount: "जमा राशि (एडवांस)",
        deliveryDate: "कब देना है? (तारीख)",
        balance: "बकाया राशि",
        submit: "व्हाट्सएप पर भेजें",
        prompts: {
            customerName: "बिल किसके नाम पर है?",
            mobileNumber: "मोबाइल नंबर क्या है?",
            itemName: "सामान का नाम क्या है?",
            quantity: "कितना सामान है?",
            totalAmount: "कुल कितने रुपये हुए?",
            advanceAmount: "कितना एडवांस मिला?",
        }
    },
    te: {
        customerName: "కస్టమర్ పేరు",
        mobileNumber: "మొబైల్ నంబర్",
        itemName: "వస్తువు పేరు",
        quantity: "పరిమాణం",
        totalAmount: "మొత్తం ధర",
        advanceAmount: "ముందస్తు చెల్లింపు",
        deliveryDate: "డెలివరీ తేదీ",
        balance: "మిగిలిన బాకీ",
        submit: "వాట్సాప్‌లో పంపండి",
        prompts: {
            customerName: "బిల్లు ఎవరి పేరు మీద ఉంది?",
            mobileNumber: "మొబైల్ నంబర్ చెప్పండి?",
            itemName: "వస్తువు పేరు ఏమిటి?",
            quantity: "ఎంత పరిమాణం?",
            totalAmount: "మొత్తం ఎంత అయింది?",
            advanceAmount: "ఎంత అడ్వాన్స్ ఇచ్చారు?",
        }
    }
};

export const languages = [
    { code: 'en', label: 'English', voiceLang: 'en-IN' },
    { code: 'hi', label: 'हिंदी', voiceLang: 'hi-IN' },
    { code: 'te', label: 'తెలుగు', voiceLang: 'te-IN' }
];
