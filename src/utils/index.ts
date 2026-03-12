import type { FilteredTab } from '../types';

export const getFilteredTabs = (tabs: FilteredTab[]): FilteredTab[] => {
	return tabs
		.filter(item => !item.url?.includes('chrome://'));
};
