import React from 'react';

interface PaginationType {
  current?: number;
  pageSize?: number;
  onChange?: (page: number, size: number) => void;
  [key: string]: any;
}

type SetPageType = (no?: number, size?: number) => void

type UseTablePaginationType = [number, number, PaginationType, SetPageType];

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
    return {
      ...(pagination ?? {}),
      current: pageNo,
      pageSize,
      onChange: onPaginationChange,
    }
  }, [pagination, pageNo, pageSize])

  return [pageNo, pageSize, mergedPagination, setPage] as UseTablePaginationType
}

export default {}