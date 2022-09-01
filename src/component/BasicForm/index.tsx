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
import type { NamePath, Callbacks } from "rc-field-form/lib/interface";
import { stringHelper } from "../../_util";

export type CustomFormItemType = {
  antdComponentName?: string;
  antdComponentProps?: {
    children?: React.ReactElement;
    [key: string]: unknown;
  };
};
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
  [key: string]: any;
} & CustomFormItemType;

export interface BasicFormPropsType extends Callbacks {
  /**
   * @description      表单实例
   * @default          React.RefObject<T>
   */
  form: any;
  children?: React.ReactElement;
  /**
   * @description      配置化表单列表
   * @default          undefined
   */
  formItemList: FormItemType[];
}

// antd Componet Map
const componentMap: Map<string, React.ReactElement> = new Map([
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
}: BasicFormPropsType): React.FC<BasicFormPropsType> => {
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
      formItemList?.map((item: FormItemType): React.ReactElement => {
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
            stringHelper.toFirstWordsUpper(antdComponentName)
          ) ??
            null);
        // generate Component with Form.Item children
        const formItemChildren =
          (antdComponent
            ? React.createElement(
                antdComponent as any,
                antdComponentProps,
                antdComponentProps?.children
              )
            : customRender?.(restItemProps)) ?? null;
        // generate Component with Form.Item
        const retRes = React.createElement(
          Form.Item,
          { ...restItemProps, key: restItemProps.name },
          formItemChildren
        );
        // return to render Form children
        return retRes;
      }),
    [formItemList]
  );

  // Mounted
  React.useEffect(() => {
    isMouted.current = true;
  }, []);

  // return to render Form
  return React.createElement(
    Form,
    mergedProps(),
    children || generateFormItemByFormItemList
  ) as unknown as React.FC<BasicFormPropsType>;
};

export default BasicForm;
