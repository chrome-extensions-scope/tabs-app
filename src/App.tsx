import { useState, useEffect } from 'react'
import { prefetchDNS, useFormStatus } from 'react-dom';
import debounce from 'lodash.debounce';
import * as chromeAPI from './chrome-api'
import * as geminiAPI from './gemini-api';
import * as utils from './utils';
import type { FilteredTab } from './types';
import { Button } from '@/components/ui/button.tsx';
import { EmptyTab } from '@/components/ui/EmptyTab.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ThemeProvider } from '@/components/ui/theme-provider.tsx';
import {
	Item,
	// ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { Layers } from "lucide-react"

import './App.css';

const SCREEN = {
	MAIN: 'MAIN',
}

function Submit() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending} className="w-full cursor-pointer">
			{pending ? <><Spinner /> Grouping...</> : <><Layers /> Group Tabs</>}
		</Button>
	);
}

function App() {
	prefetchDNS('https://generativelanguage.googleapis.com');
	const [tabList, setTabList] = useState<FilteredTab[]>([]);
	const [screen, setScreen] = useState<string>(SCREEN.MAIN);

	const groupTabs = async () => {
		const filteredTabs = utils.getFilteredTabs(tabList);
		if (filteredTabs.length <= 0) {
			return;
		}

		const result = await geminiAPI.categorizeTabs(filteredTabs);
		await chromeAPI.groupTabs(result);
	}

	useEffect(() => {
		const syncTabs = async () => {
			const tabList = await chromeAPI.getTabsCurrentWindow();
			const filteredTabs = utils.getFilteredTabs(tabList);

			setTabList(filteredTabs);

			filteredTabs.map(tab => {
				if (tab.groupId && tab.groupId >= 0) {
					chrome.tabGroups.get(tab.groupId).then(console.log);
				}
			})
		};

		async function setup() {
			await syncTabs();

			chrome.tabs.onRemoved.addListener(syncTabs);
			chrome.tabs.onUpdated.addListener(debounce(syncTabs, 500));
			chrome.tabGroups.onCreated.addListener((e) => {});
		}
		setup();

		return () => {
			chrome.tabs.onRemoved.removeListener(syncTabs);
			chrome.tabs.onUpdated.removeListener(syncTabs);
		}
	}, []);

  return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="app flex h-full flex-col p-5">

				<div className="header pb-5 flex justify-between">
					<Badge variant="secondary">{tabList.length} Tabs open</Badge>
				</div>

				<div className="main flex-grow mb-5 overflow-y-scroll">
					{tabList.map((item) =>
						<Item key={item.id} variant="outline" className="mb-3">
							<ItemMedia className="self-center!">
								{!item.favIconUrl ? <EmptyTab /> : <picture>
									<img
										src={item.favIconUrl}
										style={{ height: '24px', width: '24px' }}
										alt="icon"
									/>
								</picture>}
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="w-3xs overflow-hidden text-ellipsis whitespace-nowrap block">
									{item.title}
								</ItemTitle>
								<ItemDescription className="w-3xs overflow-hidden text-ellipsis whitespace-nowrap">
									{item.url}
								</ItemDescription>
							</ItemContent>
						</Item>)}
					{tabList.length === 0 && <div className="mt-10 text-center text-xl font-semibold tracking-tight">No tabs opened</div>}
				</div>

				<div className="footer">
					<form className="form mb-5" action={groupTabs}>
						<Submit/>
					</form>
					<p className="mb-3 text-muted-foreground text-center">Click and don't close this window for grouping your tabs</p>
				</div>
			</div>
		</ThemeProvider>
	)
}

export default App
