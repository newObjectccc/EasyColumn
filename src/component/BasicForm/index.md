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

Demo:

```tsx
import React from "react";
import { Form, Input, Button, InputNumber } from "antd";
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
    antdComponentName: "Input",
    antdComponentProps: {
      placeholder: "请输入姓名",
    },
  },
  {
    name: "userAge",
    label: "年龄",
    customRender: (form) => (
      <InputNumber min={1} max={200} placeholder="请输入" />
    ),
  },
  {
    name: "skills",
    label: "技能等级",
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
    name: "judgement",
    label: "自我评价",
    customRender: (form) => <Input placeholder="请输入" />,
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

[其他属性同 antd Form](https://ant.design/components/select-cn/#API)
