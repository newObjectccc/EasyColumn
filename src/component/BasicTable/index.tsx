import React from "react";
import { Table, Form } from "antd";
import BasicForm from "../BasicForm";
import type { BasicFormPropsType, FormItemType } from "../BasicForm"
import { useTablePagination } from "./hook";

export interface BasicTablePropsType extends React.FunctionComponent {
  /**
   * @description      请求接口
   * @default          (p: Object) => Promise<unkonwn[]>
   */
  apiFn?: <T>(params: T) => Promise<any>;
  /**
   * @description      发起请求前调用队列，一般用于处理参数
   * @default          Array<(state: Object) => Promise<Object> | Object >
   */
  beforeRequestQueue?: (<T>(value: T) => any)[];
  /**
   * @description      响应后立即调用队列，一般用于处理接口数据
   * @default          Array<(state: Array<Object>) => Promise<unkonwn[]> >
   */
  afterResponseQueue?: (<T>(state: T) => any)[];
  /**
   * @description      支持 BasicForm 和 antd Form 的 props
   * @default          BasicFormPropsType
   */
  formProps?: BasicFormPropsType;
  /**
   * @description      介于 BasicForm 和 Table 之间的可渲染区域
   * @default          React.ReactNode
   */
  MiddleComponent?: React.ReactNode;
  /**
   * @description      渲染 BaiscForm 表单项，支持基于表单值请求 Table 数据
   * @default          FormItemType
   */
  formColumns?: FormItemType[];
  /**
   * @description      表格列的配置，同 antd Table 的  columns
   * @default          ColumnsType antd
   */
  tableColumns?: any;
  /**
   * @description      是否显示内置 ConfirmGroup 组件
   * @default          undefined
   */
   formHoCs?: ((form: typeof BasicForm) => (props: any) => React.ReactElement<any>)[];
  /**
   * @description      支持所有 antd Table 的属性
   * @default          (p: Object) => Promise<unkonwn[]>
   */
  [key: string]: any;
}

const BasicTable = ({ formHoCs, apiFn, dataSource, formColumns, tableColumns, MiddleComponent, formProps, beforeRequestQueue = [], afterResponseQueue = [], children = [], ...restProps }: BasicTablePropsType, ref: React.Ref<unknown>) => {
  // is Mouted
  const isMouted = React.useRef<boolean>(false);
  // 请求参数
  const [apiParams, setApiParams] = React.useState<Object>({})
  // 表单控制
  const [formStore] = Form.useForm()
  // table展示数据  默认展示 dataSource 传入的数据
  const [tableSource, setTableSource] = React.useState<unknown[]>(dataSource ?? [])
  // 使用 pagination 钩子
  const {pagination} = restProps
  const [pageNo, pageSize, mergedPagination] = useTablePagination(pagination)

  // 请求数据方法
  const fetchHandler = async () => {
    let fetchParams = {...apiParams, pageNo, pageSize}

    if (beforeRequestQueue.length) {
      // 提供修改参数的功能
      // eslint-disable-next-line no-restricted-syntax
      for await (const rqFn of beforeRequestQueue) {
        fetchParams = await rqFn(fetchParams)
      }
    }
    // fetch data
    let res = await apiFn?.(fetchParams)

    if (afterResponseQueue.length) {
      // 提供修改接口返回值的功能
      // eslint-disable-next-line no-restricted-syntax
      for await (const rpFn of afterResponseQueue) {
        // eslint-disable-next-line no-loop-func, no-return-assign
        res = await rpFn(res)
      }
    }
    // 设置 table 数据
    setTableSource(res)
  }

  // 发起请求
  React.useEffect(() => {
    // 设置组件加载状态state
    if (!isMouted.current) {
      isMouted.current = true
    }
    // 组件加载完成之后
    fetchHandler()
  }, [apiParams, pageNo, pageSize])

  React.useImperativeHandle(ref, () => ({
    todo: setApiParams,
  }))

  // 处理 Table 的 props
  const generateTableByMergedProps = React.useCallback(() => ({
    key: '#__table__',
    ...restProps,
    pagination: mergedPagination,
    columns: tableColumns,
    dataSource: tableSource as Array<any>,
  }), [tableSource, tableColumns])

  // 处理 Form 的 props
  const generateFormByMergedProps = React.useCallback(() => ({
    key: '#__form__',
    layout: 'inline',
    ...formProps,
    // 覆写 onFinish 监听  Form 值更新 apiParams
    onFinish: (values: {[key: string]: any}) => {
      setApiParams(values)
      formProps?.onFinish?.(values)
    },
    formItemList: formColumns,
    form: formStore,
  }), [formProps, formColumns])

  // generate BasicForm with HoCs
  const BasicFormMergedHoCs = React.useMemo(()=> {
    let mergedHoCs = BasicForm
    if (Array.isArray(formHoCs) && formHoCs.length > 0) {
      formHoCs.forEach(formHoC => {
        if (typeof formHoC === 'function') {
          mergedHoCs = formHoC(mergedHoCs) as typeof BasicForm
        }
      })
    }
    return mergedHoCs
  }, [formHoCs])

  // 生成 TableWithForm 组件
  const TableWithForm = React.useMemo(() => [
      React.createElement(BasicFormMergedHoCs, generateFormByMergedProps()),
      MiddleComponent || null,
      React.createElement(Table, generateTableByMergedProps()),
    ]
    , [generateTableByMergedProps, BasicFormMergedHoCs])

  // TableWithForm with props => BasicTable 组件
  return React.createElement(React.Fragment, {}, [...TableWithForm, ...children])
}

export default React.forwardRef(BasicTable)
export { useTablePagination }