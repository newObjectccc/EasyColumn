import { ConfigProvider } from 'antd';
import React from 'react';

import CONSTANT from '../const'

const {DEFAULT_LANG} = CONSTANT

export function useLocale(locale: {[key: string]: {[key: string]: string}}) {
  const {ConfigContext} = ConfigProvider
  const antdConfig = React.useContext(ConfigContext)
  const lang = (antdConfig.locale?.locale ?? DEFAULT_LANG )as LOCALE
  const translate = locale[lang]

  return [translate]
}

export default {}