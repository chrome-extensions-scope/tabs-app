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
import { Layers, Settings, ArrowLeft } from "lucide-react"

import './App.css';

const SCREEN = {
	MAIN: 'MAIN',
	SETTINGS: 'SETTINGS',
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
	prefetchDNS('https://api.openai.com/v1/responses');
	const [tabList, setTabList] = useState<FilteredTab[]>([]);
	const [screen, setScreen] = useState<string>(SCREEN.MAIN);

	const groupTabs = async () => {
		const filteredTabs = utils.getFilteredTabs(tabList);
		if (filteredTabs.length <= 0) {
			return;
		}

		const result = await openAIAPI.categorizeTabs(filteredTabs);
		await chromeAPI.groupTabs(result);
	}

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

	const onSettingsClick = () => {
		setScreen(SCREEN.SETTINGS);
	};

	const onArrowLeftClick = () => {
		setScreen(SCREEN.MAIN);
	};

  return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="app flex h-full flex-col p-5">

				{screen === SCREEN.MAIN && <>
          <div className="header pb-5 flex justify-between">
            <Badge variant="secondary">{tabList.length} Tabs open</Badge>
            <Settings className="cursor-pointer" onClick={onSettingsClick} />
          </div>
				</>}

				{screen === SCREEN.SETTINGS && <>
          <div className="header pb-5">
            <ArrowLeft className="cursor-pointer" onClick={onArrowLeftClick} />
          </div>
        </>}

				{screen === SCREEN.MAIN && <>
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
									<ItemTitle className="w-3xs overflow-hidden text-ellipsis">{item.title}</ItemTitle>
									<ItemDescription className="w-3xs overflow-hidden text-ellipsis">
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
				</>}

				{screen === SCREEN.SETTINGS && <>
					<div className="mt-20 text-center text-xl font-semibold tracking-tight">Settings Screen - Coming Soon!</div>
				</>}

			</div>
		</ThemeProvider>
	)
}

export default App
