
export const getTabsCurrentWindow = async (): Promise<chrome.tabs.Tab[]> => {
	return await window.chrome.tabs.query({ currentWindow: true });
}

export const removeTabs = async (tabsIds: number[]): Promise<void> => {
	return await window.chrome.tabs.remove(tabsIds);
}

export const removeAllTabsExceptCurrent = async (): Promise<chrome.tabs.Tab[]> => {
	const tabs = await getTabsCurrentWindow();
	const activeTabs = tabs.filter(tab => !tab.active);
	const tabIds = activeTabs.map(tab => tab.id);

	try {
		await removeTabs(tabIds as number[]);
	} catch (error) {
		console.error('Error removing tabs:', error);
	}

	return activeTabs;
}

type GroupTabProp = {
	id: number,
	title: string,
}

type CategorizeTabsResponse = {
	[key: string]: GroupTabProp[]
}

export const groupTabs = async (prop: CategorizeTabsResponse): Promise<void> => {
	const result = Object
		.entries(prop)
		.map(async ([category, tabs]) => {
			// @ts-ignore
			const groupId = await window.chrome.tabs.group({ tabIds: tabs.map(item => item.id) });
			// @ts-ignore
			window. chrome.tabGroups.update(groupId, { title: category });
			return groupId;
		})

	console.log('result', result);
	// return result;
}


