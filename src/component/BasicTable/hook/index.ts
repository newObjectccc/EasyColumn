import React from 'react';

interface PaginationType {
  current?: number;
  pageSize?: number;
  onChange?: (page: number, size: number) => void;
  [key: string]: any;
}

type UseTablePaginationType = [number, number, PaginationType]

export const useTablePagination = (pagination: PaginationType) => {
  const [pageNo , setPageNo] = React.useState(pagination?.current ?? 1)
  const [pageSize , setPageSize] = React.useState(pagination?.pageSize ?? 10)

  // 缓存父组件传入onChange
  const cacheFatherPaginaitonChangeEvent = React.useRef<(page: number, size: number) => void>()
  
  const onPaginationChange = (page: number, size: number) => {
    setPageSize(size)
    setPageNo(page)
    // 触发原本的 onChange
    cacheFatherPaginaitonChangeEvent.current?.(page, size)
  }

  // merge pagination 参数
  const mergedPagination = React.useMemo(() => {
    if (typeof pagination?.onChange === 'function') {
      cacheFatherPaginaitonChangeEvent.current = pagination.onChange
    }  
    return {
      ...(pagination ?? {}),
      onChange: onPaginationChange,
    }
  }, [pagination])

  return [pageNo, pageSize, mergedPagination] as UseTablePaginationType
}

export default {}