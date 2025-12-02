import { useState, useEffect } from 'react'
import { prefetchDNS, useFormStatus } from 'react-dom';
import * as chromeAPI from './chrome-api'
import * as openAIAPI from './openai-api';
import * as utils from './utils';
import type { FilteredTab } from './types';
import { Button } from '@/components/ui/button.tsx';
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

function Submit() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending} className="w-full cursor-pointer">
			{pending ? <><Spinner /> Grouping...</> : <><Layers /> Group Tabs</>}
		</Button>
	);
}

function App() {
	prefetchDNS('https://api.openai.com/v1/responses');
	const [tabList, setTabList] = useState<FilteredTab[]>([]);

	const groupTabs = async () => {
		const filteredTabs = utils.getFilteredTabs(tabList);
		if (filteredTabs.length <= 0) {
			return;
		}

		const result = await openAIAPI.categorizeTabs(filteredTabs);
		await chromeAPI.groupTabs(result);
	}

	// const removeAllTabsExceptCurrent = async () => {
	// 	const tabs = await chromeAPI.removeAllTabsExceptCurrent();
	// 	setTabList(tabs);
	// }

	useEffect(() => {
		const syncTabs = async () => {
			const tabList = await chromeAPI.getTabsCurrentWindow();
			const filteredTabs = utils.getFilteredTabs(tabList);
			setTabList(filteredTabs);
		};

		async function setup() {
			await syncTabs();

			chrome.tabs.onCreated.addListener(syncTabs);
			chrome.tabs.onRemoved.addListener(syncTabs);
		}
		setup();

		return () => {
			chrome.tabs.onCreated.removeListener(syncTabs);
			chrome.tabs.onRemoved.removeListener(syncTabs);
		}
	}, []);

	console.log('tabList', tabList);

  return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="app flex h-full flex-col p-5">
				<div className="header pb-5">
					<Badge variant="secondary">{tabList.length} Tabs open</Badge>
				</div>

				<div className="main flex-grow mb-5 overflow-y-scroll">
					{tabList.map(item =>
						<Item key={item.id} variant="outline" className="mb-3">
							<ItemMedia>
								<picture>
									<img
										src={item.favIconUrl || 'https://cdn-icons-png.flaticon.com/128/3585/3585596.png'}
										style={{ height: '32px', width: 'auto', display: 'inline-block' }}
										alt="icon"
									/>
								</picture>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>{item.title}</ItemTitle>
								<ItemDescription>
									{item.url}
								</ItemDescription>
							</ItemContent>
						</Item>)}
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
