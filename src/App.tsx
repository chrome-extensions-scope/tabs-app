import { useState, useEffect } from 'react'
import { prefetchDNS, useFormStatus } from 'react-dom';
import * as chromeAPI from './chrome-api'
import * as openAIAPI from './openai-api';
import * as utils from './utils';
import type { FilteredTab } from './types';
import './App.css';


function Submit() {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending}>
			{pending ? 'Grouping...' : 'Group Tabs'}
		</button>
	);
}

function App() {
	prefetchDNS('https://api.openai.com/v1/responses');
	const [tabList, setTabList] = useState<FilteredTab[]>([]);

	const groupTabs = async () => {
		const filteredTabs = utils.getFilteredTabs(tabList);
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

  return (
    <>
			<form className="container" action={groupTabs}>
				{/*<button onClick={removeAllTabsExceptCurrent}>Remove All</button>*/}
				<Submit />
			</form>

      <div className="container">
				{tabList
					.map((item) =>
						<div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0px' }}>
							{/*{<picture>*/}
              {/*    <img*/}
              {/*      src={item.favIconUrl || 'https://cdn-icons-png.flaticon.com/128/3585/3585596.png'}*/}
              {/*      style={{ height: '32px', width: 'auto', display: 'inline-block' }}*/}
              {/*      alt="icon"*/}
              {/*    />*/}
							{/*	</picture>}*/}
							<p>{item.title}</p>
						</div>)}
      </div>
			{/*<div className="container" style={{ paddingTop: '10px' }}>*/}
			{/*	<textarea style={{ width : '100%', height: '70px' }} placeholder="Ask anything about your tabs"></textarea>*/}
			{/*	<button>Ask</button>*/}
			{/*</div>*/}
    </>
  )
}

export default App
