import { useState, useEffect } from 'react'
import * as chromeAPI from './chrome-api'
import * as openAIAPI from './openai-api';
import './App.css'

function App() {
  const [tabList, setTabList] = useState<chrome.tabs.Tab[]>([])

	const groupTabs = async () => {
		const filteredTabs = tabList
			.map((tab) => ({ id: tab.id, url: tab.url, title: tab.title }))
			.filter(item => item.url !== 'chrome://newtab/')

		// @ts-ignore
		const result = await openAIAPI.categorizeTabs(filteredTabs);
		await chromeAPI.groupTabs(result);
	}

	const removeAllTabsExceptCurrent = async () => {
		const tabs = await chromeAPI.removeAllTabsExceptCurrent();
		setTabList(tabs);
	}

	useEffect(() => {
		async function f() {
			const tabs = await chromeAPI.getTabsCurrentWindow();
			setTabList(tabs);
		}

		f();
	}, [])

  return (
    <>
			<h2>Tabs app v0</h2>
			<div className="container">
				<button onClick={removeAllTabsExceptCurrent}>Remove All</button>
				<button onClick={groupTabs}>Group</button>
			</div>
      <div className="container">
				{tabList
					.map((item) =>
						<div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0px' }}>
							{<picture>
                  <img
                    src={item.favIconUrl || 'https://cdn-icons-png.flaticon.com/128/3585/3585596.png'}
                    style={{ height: '32px', width: 'auto', display: 'inline-block' }}
                    alt="icon"
                  />
								</picture>}
							<p>{item.title}</p>
						</div>)}
      </div>
			<div className="container" style={{ paddingTop: '10px' }}>
				<textarea style={{ width : '100%', height: '70px' }} placeholder="Ask anything about your tabs"></textarea>
				<button>Ask</button>
			</div>
    </>
  )
}

export default App
