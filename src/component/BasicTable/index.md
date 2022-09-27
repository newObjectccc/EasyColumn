---
title: BasicTable
nav:
  path: /component
  title: BasicTable 表单组件
group:
  path: /
  title: 组件
---

### BasicTable

自带序号列的列表:

```tsx
import React from "react";
import {Button} from 'antd'
import { BasicTable } from "en-volant";
import Mock from 'mockjs';
import {withConfirmBasicFormHoC} from '../BasicForm/HOC'
import {useTablePagination} from './hook'

// 使用封装的业务 hook 实现业务
const TableWithDefaultIndexColumn = React.forwardRef(({tableColumns = [], pagination = {}, ...restProps}, ref) => {
  const [pageNo, pageSize, mergedPagination] = useTablePagination(pagination)
  // 原 columns 基础上添加序号 column
  const withIdxColumns = [
    {
      dataIndex: 'indexNumber',
      title: '序号',
      render: (text, record, index) => (pageNo - 1) * pageSize + index + 1,
    }, 
    ...tableColumns,
  ]
  // return
  return <BasicTable {...restProps} ref={ref} tableColumns={withIdxColumns} pagination={mergedPagination} />
})

// Demo
export default () =>{
  
  const tableRef = React.useRef(null)
  const [rowSelection, setRowSelection] = React.useState({})
  const fetchData = (params) => {
    console.log('params ===> ', params)
    const data = Mock.mock({
      "list|95": [{
        "name": "@cname",
        "age|18-38": 38,
        "score|1-100": 100,
        "id|+1": 1,
      }],
    })
    return new Promise((res, rej) => {res(data.list)})
  }

  React.useEffect(() => {
    console.log('tableRef ===> ', tableRef)
  }, [])

  const formItems = [
    {
      name: "type",
      label: "性别",
      antdComponentName: "Select",
      antdComponentProps: { options: [{ label: "男", value: 1 }, { label: "女", value: 2 }] },
    },
    {
      name: "userName",
      label: "姓名",
      antdComponentName: "Input",
      antdComponentProps: { placeholder: "请输入姓名" },
    },
    {
      name: "score",
      label: "分数",
      antdComponentName: "InputNumber",
      antdComponentProps: { placeholder: "请输入分数" },
    },
    {
      name: "age",
      label: "年龄",
      antdComponentName: "InputNumber",
      antdComponentProps: { placeholder: "请输入年龄" },
    },
  ]

  return (
    <>
      <Button onClick={() => tableRef.current.setSeletedRowKeys([1,2,3,4])} >点我选中1,2,3,4</Button>
      <Button onClick={() => tableRef.current.resetPageStat(2, 20)} >点我跳转第二页，并显示20条</Button>
      <TableWithDefaultIndexColumn
        rowKey="id"
        ref={tableRef}
        apiFn={fetchData}
        formProps={{
          onSubmit: (val) => alert(JSON.stringify(val)),
        }}
        rowSelection={rowSelection}
        pagination={{onChange: (page, size) => console.log('page, size ===>', page, size)}}
        formHoCs={[withConfirmBasicFormHoC]}
        formColumns={formItems}
        tableColumns={[{dataIndex: 'name', title: 'Name'}, {dataIndex: 'age', title: 'Age'}, {dataIndex: 'score', title: 'Score'}]}
      />
    </>
  )
}

```

Demo2:

```tsx
import React from "react";
import { BasicTable } from "en-volant";
import Mock from 'mockjs';
import {withPaginationBasicFormHoC, withConfirmBasicFormHoC} from '../BasicForm/HOC'

// Demo
export default () =>{
  
  const tableRef = React.useRef(null)
  
  const fetchData = () => {
    const data = Mock.mock({
      "list|95": [{
        "name": "@cname",
        "age|18-38": 38,
        "score|1-100": 100,
        "id|+1": 1,
      }],
    })
    return new Promise((res, rej) => {res(data.list)})
  }

  React.useEffect(() => {
    console.log('tableRef ===> ', tableRef)
  }, [])

  const formItems = [
    {
      name: "type",
      label: "性别",
      antdComponentName: "Select",
      antdComponentProps: { options: [{ label: "男", value: 1 }, { label: "女", value: 2 }] },
    },
    {
      name: "userName",
      label: "姓名",
      antdComponentName: "Input",
      antdComponentProps: { placeholder: "请输入姓名" },
    },
    {
      name: "score",
      label: "分数",
      antdComponentName: "InputNumber",
      antdComponentProps: { placeholder: "请输入分数" },
    },
    {
      name: "age",
      label: "年龄",
      antdComponentName: "InputNumber",
      antdComponentProps: { placeholder: "请输入年龄" },
    },
  ]

  return (
    <BasicTable
      rowKey="id"
      ref={tableRef}
      apiFn={fetchData}
      formProps={{
        onSubmit: (val) => alert(JSON.stringify(val)),
      }}
      formHoCs={[withPaginationBasicFormHoC, withConfirmBasicFormHoC]}
      formColumns={formItems}
      tableColumns={[{dataIndex: 'name', title: 'Name'}, {dataIndex: 'age', title: 'Age'}, {dataIndex: 'score', title: 'Score'}]}
    />
  )
}

```

## API

<API hideTitle />

```javascript
export interface BasicTablePropsType extends React.FunctionComponent {
  /**
   * @description      请求接口
   * @default          (p: Object) => Promise<unkonwn[]>
   */
  rowKey: string | ((record: any) => string);
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
```

[其他属性同 antd Table](https://ant.design/components/select-cn/#API)
