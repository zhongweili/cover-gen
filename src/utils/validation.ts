export const validateApiKey = (apiKey: string): boolean => {
  return apiKey.trim().length > 0;
};

export const validatePrompt = (prompt: string): boolean => {
  return prompt.trim().length >= 10;
};

export const validateGenerationCount = (count: number): boolean => {
  return count >= 1 && count <= 4;
}; 
