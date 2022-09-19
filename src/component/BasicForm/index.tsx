import React from "react";
import {
  Form,
  Select,
  Input,
  Slider,
  Radio,
  TimePicker,
  Switch,
  Upload,
  InputNumber,
  Rate,
  TreeSelect,
  Checkbox,
  Transfer,
} from "antd";
import { stringHelper } from "../../_util";

export type CustomFormItemType = {
  antdComponentName?: string;
  antdComponentProps?: {
    children?: React.ReactNode;
    [key: string]: unknown;
  };
};
export type FormItemType = {
  customRender?: (
    itemProps: Omit<FormItemType, keyof CustomFormItemType>
  ) => React.ReactNode;
  name?: string | number | (string | number)[] & React.Key;
  rules?: any;
  dependencies?: any;
  colon?: boolean;
  extra?: React.ReactNode;
  getValueFromEvent?: (...args: any[]) => any;
  getValueProps?: (value: any) => any;
  [key: string]: any;
} & CustomFormItemType;

export interface BasicFormPropsType {
  /**
   * @description      表单实例
   * @default          React.RefObject<T>
   */
  form?: any;
  children?: React.ReactNode;
  /**
   * @description      配置化表单列表
   * @default          undefined
   */
  formItemList?: FormItemType[];
  [key: string]: any
}

// antd Componet Map
const componentMap: Map<string, React.ReactNode> = new Map([
  ["Select", Select],
  ["Input", Input],
  ["TimePicker", TimePicker],
  ["Upload", Upload],
  ["InputNumber", InputNumber],
  ["Switch", Switch],
  ["Radio", Radio],
  ["Slider", Slider],
  ["Rate", Rate],
  ["TreeSelect", TreeSelect],
  ["Checkbox", Checkbox],
  ["Transfer", Transfer],
] as any);

// BasicForm Componet
const BasicForm = ({
  formItemList,
  form,
  children,
  ...restProps
}: BasicFormPropsType) => {
  // is Mouted status
  const isMouted = React.useRef(false);

  // 根据 formItemList 变化重置 Form Store
  const updateFormStoreValueByFormItemList = (): void => {
    const formValues: { [key: string]: any } = form.getFieldsValue(true);
    const formItemListName = formItemList?.map((item) => item.name) ?? [];
    // eslint-disable-next-line array-callback-return
    Object.keys(formValues ?? {}).map((key: string) => {
      // 删除 Form Store 中多余的 item
      if (!formItemListName.includes(key)) {
        delete formValues[key];
      }
    });
    form.setFieldsValue(formValues);
  };

  // 需要在DOM更新前的一次性操作
  React.useLayoutEffect(() => {
    if (isMouted.current) {
      // formItemList
      updateFormStoreValueByFormItemList();
    }
  }, [formItemList]);

  // 合并自定义 props 和基础 props
  const mergedProps = React.useCallback(() => {
    const basicFormProps = {
      form,
      ...restProps,
    };
    return basicFormProps;
  }, [restProps]);

  // 生成 Form.Item
  const generateFormItemByFormItemList = React.useMemo(
    () =>
      formItemList?.map((item: FormItemType): React.ReactNode => {
        const {
          antdComponentName,
          customRender,
          antdComponentProps,
          ...restItemProps
        } = item;
        // get antdComponent by antdComponentName
        const antdComponent =
          antdComponentName &&
          (componentMap.get(
            stringHelper.toFirstWordsUpper(antdComponentName), // 首字母大写
          ) ??
            null);
        // generate Component with Form.Item children
        const formItemChildren =
          (antdComponent
            ? React.createElement(
                antdComponent as any,
                antdComponentProps,
                antdComponentProps?.children, // 可通过 children 字段设置组件
              )
            : customRender?.(restItemProps)) ?? null;
        // generate Component with Form.Item
        const retRes = React.createElement(
          Form.Item,
          {
            ...restItemProps,
            key: restItemProps.name ?? btoa(encodeURIComponent(customRender!.toString())), // btoa 在 chrome下参数里有非ASCII字符会崩溃，所以用 encodeURIComponent 转义一次
          }, // btoa(customRender!.toString()) 若没有 name 则根据 customRender 生成 base64 编码的 key
          formItemChildren, // 传入 antd 组件
        );
        // return to render Form children
        return retRes;
      }),
    [formItemList], // formItemList 通过变化控制渲染逻辑
  );

  // Mounted
  React.useEffect(() => {
    isMouted.current = true;
  }, []);

  // return to render Form
  return React.createElement(
    Form,
    mergedProps(),
    children || generateFormItemByFormItemList,
  );
};

export default BasicForm;
