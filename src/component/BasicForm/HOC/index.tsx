import React from "react";
import { Button } from "antd";
import type { BasicFormPropsType } from "..";
import locale from '../locale'
import { useLocale } from '../../../hook'

export interface ConfirmBasicFormType extends BasicFormPropsType {
  onSubmit?: <T extends any>(val: T) => T
  onReset?: () => void
  confirmWrapper?: React.ReactElement<any>
  clsName?: string | (() => string) | string[] | {[key: string]: boolean}
  [key: string]: any
}


const ConfirmGroup = ({onReset, form, confirmWrapper}: ConfirmBasicFormType) => {
  const [textMap] = useLocale(locale)
  // 支持自定义 Wrapper
  if (!confirmWrapper) {
    confirmWrapper = <div style={{display: 'flex'}} />
  }
  const confirmComponent = React.cloneElement(confirmWrapper, {}, 
    <Button type="primary" htmlType="submit">{textMap.confirm}</Button>,
    <Button style={{ margin: '0 8px' }} onClick={() => {
      form?.resetFields?.()
      onReset?.()
    }}>{textMap.reset}</Button>,
  )
  return confirmComponent
}


export const withConfirmBasicFormHoC = (basicForm: React.FC<any>)  => (customProps: ConfirmBasicFormType) => {
    const {onSubmit, onReset, form, confirmWrapper, formItemList = [], ...restProps} = customProps

    const formItemListWithConfirm = [...formItemList, {
      key: '#__confirm__',
      // eslint-disable-next-line react/no-unstable-nested-components
      customRender: () => <ConfirmGroup onReset={onReset} form={form} confirmWrapper={confirmWrapper} />,
    }]

    const onFinishHandler = React.useCallback((values: unknown) => {
      onSubmit?.(values)
    }, [onSubmit])

    return React.createElement(basicForm, {...restProps, form, formItemList: formItemListWithConfirm, onFinish: onFinishHandler})
  }
