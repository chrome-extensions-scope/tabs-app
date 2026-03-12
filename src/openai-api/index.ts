// import OpenAI from 'openai';
// import { setDefaultOpenAIClient, Agent, run } from '@openai/agents';
// import type { FilteredTab, OpenAIResponse} from '../types';
//
// // 9 tabs
// const MODEL = 'gpt-5-nano'; // $0.05 = 21s, 30s
// // const MODEL = 'gpt-4o-mini';   // $0.15 = 11s, 8s
//
// // TODO fix it
// const client = new OpenAI({
// 	apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
// 	dangerouslyAllowBrowser: true,
// });
//
// setDefaultOpenAIClient(client);
//
// const prompt = `
// You are a helpful assistant that groups browser tabs by context.
//
// Rules:
// - Return valid JSON only.
// - Each group must have array of tabs with proper category.
// - Do not explain anything outside the JSON.
//
// Example input:
// [{"title": "React documentation", "url": "https://react.dev", "id": 1530656079},
//  {"title": "Cooking pasta recipe", "url": "https://cooking.com/pasta", "id": 1530656077}]
//
// Expected output:
// {
//   "Development": [
//     {"title": "React documentation", "id": 1530656079},
//   ],
//   "Cooking": [
//   	{"title": "Cooking pasta recipe", "id": 1530656077}
//   ]
// }`;
//
// const categorizeAgent = new Agent({
// 	name: 'Categorize Agent',
// 	instructions: prompt,
// 	model: MODEL, // optional – falls back to the default model
// 	tools: [],
// });
//
// export const categorizeTabs = async (tabs: FilteredTab[]): Promise<OpenAIResponse> => {
//
// 	const result = await run(
// 		categorizeAgent,
// 		JSON.stringify(tabs),
// 	);
// 	return JSON.parse(result.finalOutput || '');
// }
//
