import React, { useContext, useEffect, useRef, useState } from "react";
import type { SelectProps} from 'antd';
import {Select, ConfigProvider} from 'antd'
import type { DefaultOptionType } from "antd/lib/select";
import locale from './locale'
import CONSTANT from '../../const'

const {DEFAULT_LANG} = CONSTANT
export interface BigSelectProps {
  /**
   * @description      options 初始列表
   * @default          []
   */
  initOptions: {
    [key:string]: any
    label: string,
    value: string,
  }[]
  /**
   * @description      数据加载接口, 需包装成符合如下参数的函数
   * @default          undefined
   */
  api?: (params: {
    pageNo: number,
    pageSize: number,
  }) => Promise<[boolean, {
    pageInfo: {
      total: number
    }
    data: DefaultOptionType[]
  }
]>
}

type BigSelectPropsBase = BigSelectProps & SelectProps
export default ({initOptions = [], onPopupScroll, api , ...rest}: BigSelectPropsBase) => {
  const {ConfigContext} = ConfigProvider
  const antdConfig = useContext(ConfigContext)
  const lang = (antdConfig.locale?.locale ?? DEFAULT_LANG )as LOCALE
  const translate = locale[lang]
  const [options, setOptions] = useState<DefaultOptionType[]>(initOptions)
  const [loadingTrigger, setLoadingTrigger] = useState(0)
  const [loadingState, setLoadingState] = useState(false)
  const paramsRef = useRef({
    loading: false,
    pageNo: 1,
    total: 100,
    pageSize: 10,
  })

  const handlePopupScroll: React.UIEventHandler<HTMLDivElement> = e =>  {
    const target = e.currentTarget
    if (onPopupScroll) {
      onPopupScroll(e)
    }
    const {scrollTop} = target
    const {clientHeight} = target
    const {scrollHeight} = target

    if (scrollTop + clientHeight >= scrollHeight - 28) {
      setLoadingTrigger(val => ++val)
    }
  }
  async function loadNextPage() {
    const params = paramsRef.current
    if (api) {
      if (options.length < params.total) {
        if (!params.loading) {
          params.loading = true
          setLoadingState(true)
          const [err, result] = await api({
            pageNo: params.pageNo,
            pageSize: params.pageSize,
          })
          setLoadingState(false)
          if (err) {
            return
          }
          params.total = result.pageInfo.total
          params.loading = false
          params.pageNo++
          if (result!.data) {
            setOptions([...options, ...result!.data])
          }
        }
      }
    } else {
      params.loading = false
    }
  }
  useEffect(() => {
    loadNextPage()
  }, [loadingTrigger])
  return (
    <Select {...{
      placeholder: translate.placeholder,
      ...rest,
      loading: loadingState,
      options,
      onPopupScroll: handlePopupScroll,
    }}/>
  )
}
