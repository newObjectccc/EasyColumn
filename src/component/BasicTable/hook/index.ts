import type { Key } from 'react';
import React from 'react';

interface PaginationType {
  current?: number;
  pageSize?: number;
  onChange?: (page: number, size: number) => void;
  [key: string]: any;
}

type SetPageType = (no?: number, size?: number) => void

type UseTablePaginationType = [number, number, PaginationType, SetPageType];
// Antd Table 组件的 pagination 自定义 hook
export const useTablePagination = (pagination: PaginationType) => {
  const [pageNo , setPageNo] = React.useState(pagination?.current ?? 1)
  const [pageSize , setPageSize] = React.useState(pagination?.pageSize ?? 10)
  // const [mergedPagination, setMergedPagination] = React.useState(pagination ?? {})

  // 缓存父组件传入onChange
  const cacheFatherPaginaitonChangeEvent = React.useRef<(page: number, size: number) => void>()
  /**
   *  
   * @param no 改变页码，undefined 表示不变
   * @param size 改变每页展示数量，undefined 表示不变
   */
  const setPage: SetPageType = (no, size) => {
    if (no !== undefined) setPageNo(no)
    if (size !== undefined) setPageSize(size)
    // 触发原本的 onChange
    cacheFatherPaginaitonChangeEvent.current?.(no ?? pageNo, size ?? pageSize)
  }
  
  const onPaginationChange = (page: number, size: number) => {
    setPage(page, size)
  }

  // merge pagination 参数
  const mergedPagination = React.useMemo(() => {
    if (typeof pagination?.onChange === 'function') {
      cacheFatherPaginaitonChangeEvent.current = pagination.onChange
    }
    return pagination ?  {
      ...pagination,
      current: pageNo,
      pageSize,
      onChange: onPaginationChange,
    } : pagination
  }, [pagination, pageNo, pageSize])

  return [pageNo, pageSize, mergedPagination, setPage] as UseTablePaginationType
}

interface RowSelectionType {
  type?: 'checkbox' | 'radio'
  selectedRowKeys?: Key[]
  onChange?: (selectedRowKeys: Key[], selectedRows: object[], info: { type: any }) => void
  [key: string]: any
}
interface selectionsControllerType {
  rows: object[]
  rowKeys: Key[]
  setRowKeys: (keys: Key[]) => void
}
type UseTableRowSelection = [RowSelectionType, selectionsControllerType]
// Antd Table 组件的 rowSelection 自定义 hook
export const useTableRowSelection = (rowSelection: RowSelectionType, rowKey: string | ((record: object) => string)) => {
  const cacheSelectedRows = React.useRef([]) // 缓存选中的 Rows
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Array<string|number>>([])
  
  React.useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedRowKeys(rowSelection.selectedRowKeys)
    }
  }, [rowSelection])

  const selectionsController: selectionsControllerType = React.useMemo(() => ({
    rows: cacheSelectedRows.current,
    rowKeys: selectedRowKeys,
    // 从外部设置 Row 和 rowKeys
    setRowKeys: (keys: Key[]) => {
      cacheSelectedRows.current = cacheSelectedRows.current.filter(row => keys.includes(row[typeof rowKey === 'function' ? rowKey(row) : rowKey]))
      setSelectedRowKeys(keys)
    },
  }), [selectedRowKeys])

  const mixOnChangeDecorator = (fn: typeof rowSelection.onChange) => (...restArgs: [Key[], object[], any]) => {
    setSelectedRowKeys([...restArgs.at(0)])
    cacheSelectedRows.current = restArgs.at(1)
    fn?.call?.(undefined, ...restArgs)
  }
  
  const mergedRowSelection = React.useMemo(() => {
    const merged = rowSelection ? {
      ...rowSelection,
      selectedRowKeys,
      onChange: mixOnChangeDecorator(rowSelection?.onChange),
    } : rowSelection
    return merged
  }, [rowSelection, selectedRowKeys])

  return [mergedRowSelection, selectionsController] as unknown as UseTableRowSelection
}

export default {}