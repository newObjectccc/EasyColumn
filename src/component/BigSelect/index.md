---
title: BigSelect
nav:
  path: /component
  title: BigSelect 长列表组件
group:
  path: /
  title: 组件
---

## BigSelect
专为有长列表optioin选项的`select`开发

Demo:

```tsx
import React from 'react';
import { BigSelect } from 'en-volant';

let start = 1
export default () => {
  async function api(params: {pageNo: number, pageSize: number}): Promise<[boolean, any]> {
        start += 20
        await new Promise(res => {
          setTimeout(() => {
            res(1)
          }, 500)
        })
        return [false,  {
          pageInfo: {
            total: Infinity,
          },
          data: Array.from({length: 20}, (k,i) => ({
              label: `label${start + (i + 1)}`,
              value: start + i + 1,
            })),
        }]
      }
  return (
    <>
      <h1>选择标签示例</h1>
      <BigSelect placeholder='请选择' initOptions={[
        {
          label: 'label1',
          value: '1',
        },
      ]}
      api={api}
      />
    </>
  )


};
```

## API
<API hideTitle/>

[其他属性同antd Select](https://ant.design/components/select-cn/#API)

