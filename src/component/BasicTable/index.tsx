import React from "react";
import { Table, Form } from "antd";
import BasicForm from "../BasicForm";
import type { BasicFormPropsType } from "../BasicForm"

export interface BasicTablePropsType extends React.FunctionComponent {
  apiFn?: <T>(params: T) => Promise<any>;
  beforeRequestQueue?: (<T>(value: T) => any)[]
  afterResponseQueue?: (<T>(state: T) => any)[]
  formProps?: BasicFormPropsType
  MiddleComponent?: React.ReactNode
  [key: string]: any
}

const BasicTable = ({ apiFn, dataSource, formColumns, tableColumns, MiddleComponent, formProps, beforeRequestQueue = [], afterResponseQueue = [], children = [], ...restProps}: BasicTablePropsType, ref: React.Ref<unknown>): React.FC<BasicTablePropsType> => {
  console.log(' function calling ... ... ... ')
  // is Mouted
  const isMouted = React.useRef<boolean>(false);
  // 请求参数
  const [apiParams, setApiParams] = React.useState<Object>({})
  // 表单控制
  const [formStore] = Form.useForm()
  // table展示数据
  const [tableSource, setTableSource] = React.useState<unknown[]>([])
  // 请求数据方法
  const fetchHandler = React.useCallback(async () => {
    let fetchParams = apiParams

    if (beforeRequestQueue.length) {
      // 提供修改参数的功能
      // eslint-disable-next-line no-restricted-syntax
      for await (const rqFn of beforeRequestQueue) {
        fetchParams = rqFn(fetchParams)
      }
    }
    // fetch data
    let res = await apiFn?.(fetchParams)

    if (afterResponseQueue.length) {
      // 提供修改接口返回值的功能
      // eslint-disable-next-line no-restricted-syntax
      for await (const rpFn of afterResponseQueue) {
        // eslint-disable-next-line no-loop-func, no-return-assign
        res = rpFn(res)
      }
    }
    // 设置 table 数据
    setTableSource(res)
  }, [apiFn])

  // 发起请求
  React.useEffect(() => {
    // 设置组件加载状态state
    if (!isMouted.current) {
      isMouted.current = true
    }
    // 组件加载完成之后
    fetchHandler()
  }, [apiParams, fetchHandler])

  React.useImperativeHandle(ref, () => ({
    todo: setApiParams,
  }))

  // 处理 Table 的 props
  const generateTableByMergedProps = React.useCallback(() => {
    const mergedProps = {
      key: 'table',
      columns: tableColumns,
      ...restProps,
      dataSource: tableSource,
    }
    console.log('tableSource ==> ', tableSource)
    return tableColumns ? React.createElement(Table, mergedProps) : null 
  }, [tableSource, tableColumns])
  
  // 处理 Form 的 props
  const generateFormByMergedProps = React.useCallback(() => {
    const mergedProps = {
      key: 'form',
      ...formProps,
      columns: formColumns,
      form: formStore,
    }
    return React.createElement(BasicForm, mergedProps)
  }, [formProps, formColumns])

  // 生成 TableWithForm 组件
  const TableWithForm = React.useMemo(() => [
    generateFormByMergedProps(), 
    MiddleComponent || null,
    generateTableByMergedProps(),
  ]
  , [generateTableByMergedProps, generateFormByMergedProps])

  // TableWithForm with props => BasicTable 组件
  return React.createElement(React.Fragment, {}, [TableWithForm, ...children]) as unknown as React.FC<BasicTablePropsType>
}

export default React.forwardRef(BasicTable)