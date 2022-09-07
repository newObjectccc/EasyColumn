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
import { Button } from 'antd';
import { BasicTable } from "en-volant";

export default () =>{
  const tableRef = React.useRef(null)
  const [list, setList] = React.useState([
      {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
        f: 1,
      },
      {
        a: 2,
        b: 2,
        c: 2,
        d: 2,
        e: 2,
        f: 2,
      },
    ])
  const fetchData = React.useCallback(() => list, [list])
  React.useEffect(() => {

  }, [])
  return (
    <>
      <Button onClick={() => setList([...list, {a: list.at(-1).a + 1, b: list.at(-1).b + 1, c: list.at(-1).c + 1, d: list.at(-1).e + 1, f: list.at(-1).f + 1}])}>click</Button>
      <BasicTable
        rowKey="a"
        ref={tableRef}
        apiFn={fetchData}
        tableColumns={[
          {dataIndex: 'a', title: 'a'},
          {dataIndex: 'b', title: 'b'},
          {dataIndex: 'c', title: 'c'},
          {dataIndex: 'd', title: 'd'},
          {dataIndex: 'e', title: 'e'},
          {dataIndex: 'f', title: 'f'},
        ]}
        beforeRequestQueue={[(prms) => ({...prms, addition: 'add'})]}
      />
    </>
  )
}

```

## API

<API hideTitle />

```javascript
 
```

[其他属性同 antd Table](https://ant.design/components/select-cn/#API)
