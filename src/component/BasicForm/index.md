---
title: BasicForm
nav:
  path: /component
  title: BasicForm 表单组件
group:
  path: /
  title: 组件
---

### BasicForm

配置式表单，通过配置或操作表单的 formItemList 来动态的操作表单
如果你使用 customRender 渲染组件，建议将组件进行逻辑封装并处理 onChange 和 value 的逻辑
因为 antd 的 Form 对于添加了 name 属性的 Form.Item 进行 onChange 和 value 来实现状态管理的，除非你并不打算用 Form Store 来管理表单项的值

Demo:

```tsx
import React from "react";
import { Form, Input, Button, InputNumber, PageHeader } from "antd";
import { BasicForm } from "en-volant";

const formItemList = [
  {
    name: "type",
    label: "性别",
    initialValue: 1,
    antdComponentName: "Select",
    antdComponentProps: {
      options: [
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 2,
        },
      ],
    },
  },
  {
    name: "userName",
    label: "姓名",
    rules: [{ required: true, message: "用户姓名必填" }],
    antdComponentName: "Input",
    antdComponentProps: {
      placeholder: "请输入姓名",
    },
  },
  {
    name: "userAge",
    label: "年龄",
    rules: [{ required: true, message: "用户年龄必填" }],
    customRender: (form) => (
      <InputNumber min={1} max={200} placeholder="请输入" />
    ),
  },
  {
    name: "skills",
    label: "技能等级",
    initialValue: 0,
    antdComponentName: "Slider",
    antdComponentProps: {
      marks: {
        0: "A",
        20: "B",
        40: "C",
        60: "D",
        80: "E",
        100: "F",
      },
    },
  },
  {
    name: "btn",
    label: " ",
    colon: false,
    customRender: (form) => (
      <Button onClick={() => alert("嘻嘻嘻")}>可以自定义添加一个按钮</Button>
    ),
  },
  {
    name: "subtitle",
    label: " ",
    colon: false,
    customRender: (form) => (
      <PageHeader title="子标题" subTitle="或者你想要自定义添加一个子标题" />
    ),
  },
  {
    name: "judgement",
    label: "自我评价",
    rules: [{ required: true, message: "用户自我评价必填" }],
    customRender: (form) => <Input placeholder="请输入" />,
  },
  {
    label: " ",
    colon: false,
    wrapperCol: { offset: 3 },
    customRender: (form) => (
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    ),
  },
];
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

export default () => {
  const [formRef] = Form.useForm();
  const [formItems, setFormItems] = React.useState(formItemList);
  // 一些简单的字段依赖的逻辑
  const onFormValuesChange = (changed, all) => {
    if (changed.type === 2) {
      formRef.setFields([{ name: "userName", value: "婷婷" }]);
    }
    if (changed.type === 1) {
      formRef.setFields([{ name: "userName", value: "立立" }]);
    }
    if (changed.userAge > 20) {
      formRef.setFields([{ name: "skills", value: 40 }]);
    }
    if (changed.userAge > 30) {
      formRef.setFields([{ name: "skills", value: 60 }]);
    }
    if (changed.userAge > 40) {
      formRef.setFields([{ name: "skills", value: 80 }]);
    }
  };
  // 增加和删除表单项
  const controlFormItemList = (action) => {
    if (action === "delete" && formItems.length > 0) {
      formItems.pop();
    }
    if (action === "add") {
      // eslint-disable-next-line no-alert
      const antdCompName = prompt("请输入要添加的 antd 表单组件", "Input");
      formItems.push({
        name: `userAge${formItems.length}`,
        label: `这是增加的第${formItems.length + 1}条`,
        antdComponentName: antdCompName,
      });
    }
    setFormItems([...formItems]);
  };
  // 展示表单值
  const showFormValues = () => {
    const res = formRef.getFieldsValue(true);
    alert(JSON.stringify(res));
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Button danger onClick={() => controlFormItemList("delete")}>
          删除一项
        </Button>
        <Button
          type="primary"
          style={{ margin: "0 20px 20px" }}
          onClick={() => controlFormItemList("add")}
        >
          增加一项
        </Button>
        <Button type="success" onClick={showFormValues}>
          展示表单值
        </Button>
      </div>
      <BasicForm
        form={formRef}
        onValuesChange={onFormValuesChange}
        formItemList={formItems}
        {...formItemLayout}
      />
    </>
  );
};
```

## API

<API hideTitle />

```javascript
  // 对应具体的 Antd 组件的属性
  export type CustomFormItemType = {
    antdComponentName?: string;
    antdComponentProps?: {
      children?: React.ReactElement;
      [key: string]: unknown; // 这一层的属性都会编译到具体的 Antd 的组件上
    };
  };

  // 对应 Form.Item 上的属性
  export type FormItemType = {
    customRender?: (
      itemProps: Omit<FormItemType, keyof CustomFormItemType>
    ) => React.ReactElement;
    name?: NamePath & React.Key;
    rules?: any;
    dependencies?: any;
    colon?: boolean;
    extra?: React.ReactElement;
    getValueFromEvent?: (...args: any[]) => any;
    getValueProps?: (value: any) => any;
    [key: string]: any;  // 这一层的属性都会编译到 Form.Item 上
  } & CustomFormItemType
```

[其他属性同 antd Form](https://ant.design/components/select-cn/#API)
