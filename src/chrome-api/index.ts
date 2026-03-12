import type { ChromeTab, GroupTabsPayload } from '../types';

export const getTabsCurrentWindow = async (): Promise<ChromeTab[]> => {
	return await window.chrome.tabs.query({ currentWindow: true });
}

export const removeTabs = async (tabsIds: number[]): Promise<void> => {
	return await window.chrome.tabs.remove(tabsIds);
}

export const removeAllTabsExceptCurrent = async (): Promise<ChromeTab[]> => {
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

export const groupTabs = async (prop: GroupTabsPayload): Promise<void> => {
	Object
		.entries(prop)
		.map(async ([category, tabs]) => {
			const tabIds = tabs
				.map(item => item.id)
				.filter((id): id is number => id !== undefined);

			// @ts-ignore
			const groupId = await window.chrome.tabs.group({ tabIds,  });
			// @ts-ignore
			window.chrome.tabGroups.update(groupId, { title: category });
			return groupId;
		})
}


