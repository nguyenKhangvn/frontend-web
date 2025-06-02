export const environment = {
    production: false,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    geminiApiUrl: import.meta.env.VITE_GEMINI_API_URL || '',
};

// console.log('GEMINI_API_KEY:', environment.geminiApiKey);
// console.log('GEMINI_API_URL:', environment.geminiApiUrl);

