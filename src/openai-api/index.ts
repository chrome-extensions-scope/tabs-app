import OpenAI from "openai";

const MODEL = 'gpt-5-nano';

// TODO fix it
const client = new OpenAI({
	apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
	dangerouslyAllowBrowser: true,
});


type Tab = {
	id: number,
	title: string,
}

type CategorizeTabsResponse = {
	[key: string]: Tab[]
}

export const categorizeTabs = async (tabs: chrome.tabs.Tab[]): Promise<CategorizeTabsResponse> => {
	const prompt = `
You are a helpful assistant that groups browser tabs by context.

Rules:
- Return valid JSON only.
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
}

Now group the following tabs:
${JSON.stringify(tabs)}
`;

	const response = await client.responses.create({
		model: MODEL,
		input: prompt,
	});

	return JSON.parse(response.output_text);
}

