
export type ChromeTab = chrome.tabs.Tab;

export type FilteredTab = Pick<ChromeTab, 'id' | 'title' | 'url'>;

export type OpenAIResponse = {
	[key: string]: Pick<ChromeTab, 'id' | 'title'>[]
}

export type GroupTabsPayload = {
	[key: string]: Pick<ChromeTab, 'id' | 'title'>[]
}
