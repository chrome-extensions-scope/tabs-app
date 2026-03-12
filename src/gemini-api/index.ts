import { GoogleGenAI } from '@google/genai';
import type { FilteredTab, OpenAIResponse} from '../types';

const MODEL = 'gemini-2.5-flash';
const ai = new GoogleGenAI({
	apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const prompt = `
You are a helpful assistant that groups browser tabs by context.

Rules:
- Return valid JSON only.
- Respond with pure JSON, no markdown formatting
- Give me the data in JSON format without the code block
- Each group must have array of tabs with proper category.
- Do not explain anything outside the JSON.

Example input:
[{"title": "React documentation", "url": "https://react.dev", "id": 1530656079},
 {"title": "Cooking pasta recipe", "url": "https://cooking.com/pasta", "id": 1530656077}]

Expected output:
{
  "Development": [
    {"title": "React documentation", "id": 1530656079},
  ],
  "Cooking": [
  	{"title": "Cooking pasta recipe", "id": 1530656077}
  ]
}`;

export const categorizeTabs = async (tabs: FilteredTab[]): Promise<OpenAIResponse> => {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: JSON.stringify(tabs),
		config: {
			systemInstruction: prompt,
		},
	});

	return JSON.parse(response.text || '');
}
