import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import BigSelect from '../src/BigSelect'
import Translate from '../src/Translate'
import {ConfigProvider} from 'antd'
import 'antd/dist/antd.less'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
function App() {

  const [count, setCount] = useState(0)

  return (
    <ConfigProvider
    {...{
      locale: [zhCN, enUS][count%2],
      getPopupContainer() {
        return document.querySelector('.layout-right-content') || document.body
      },
    }}>
    <div>
      <BigSelect initOptions={[]}/>
    </div>
    <button onClick={() => setCount(val => ++val)}>点击切换语言</button>
    </ConfigProvider>
  )
}
ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
  ,
  
  document.querySelector('#root') as HTMLDivElement,
)
