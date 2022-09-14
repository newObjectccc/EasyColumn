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

Demo:

```tsx
import React from "react";
import { BasicTable } from "en-volant";
import Mock from 'mockjs';

// 封装一个可插拔的自定义业务 hook
const useDefaultIndexColumnTableStat = (
    tableColumns,
    pagination,
    idxColumn,
  ) => {
  const [pageNo , setPageNo] = React.useState(pagination.current ?? 1)
  const [pageSize , setPageSize] = React.useState(pagination.pageSize ??10)
  const cacheFatherPaginaitonChangeEvent = React.useRef(null) // 缓存父组件传入onChange
  
  const onPaginationChange = (page, size) => {
    if (pageSize !== size) setPageSize(size);
    if (pageNo !== page) setPageNo(page);
    cacheFatherPaginaitonChangeEvent.current?.(page, size)
  }

  // merge pagination 参数
  const mergedPagination = React.useMemo(() => {
    if (!cacheFatherPaginaitonChangeEvent.current && typeof pagination?.onChange === 'function') {
      cacheFatherPaginaitonChangeEvent.current = pagination.onChange
    }  
    return {
      ...pagination,
      onChange: onPaginationChange,
    }
  }, [pagination]) 

  // 原 columns 基础上添加序号 column
  const withIdxColumns = [
      idxColumn ?? {
        dataIndex: 'indexNumber',
        title: '序号',
        render: (text, record, index) => (pageNo - 1) * pageSize + index + 1,
      }, 
      ...(tableColumns ?? []),
    ]

  return [withIdxColumns, mergedPagination]
}
// 使用封装的业务 hook 实现业务
const TableWithDefaultIndexColumn = React.forwardRef(({tableColumns, pagination = {}, ...restProps}, ref) => {
  // 使用自定义状态钩子
  const [withIdxColumns, mergedPagination] = useDefaultIndexColumnTableStat(tableColumns, pagination)
  // return
  return <BasicTable {...restProps} ref={ref} tableColumns={withIdxColumns} pagination={mergedPagination} />
})

// Demo
export default () =>{
  
  const tableRef = React.useRef(null)
  
  const fetchData = () => {
    const data = Mock.mock({
      "list|95": [{
        "name": "@cname",
        "age|18-38": 38,
        "score|1-100": 100,
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
        ]

  return (
    <TableWithDefaultIndexColumn
        rowKey="name"
        ref={tableRef}
        apiFn={fetchData}
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
  formColumns?: FormItemType;
  /**
   * @description      表格列的配置，同 antd Table 的  columns
   * @default          ColumnsType
   */
  tableColumns?: ColumnsType;
  /**
   * @description      支持所有 antd Table 的属性
   * @default          (p: Object) => Promise<unkonwn[]>
   */
  [key: string]: any;
}

```

[其他属性同 antd Table](https://ant.design/components/select-cn/#API)
