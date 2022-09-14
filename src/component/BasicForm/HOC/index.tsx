import React from "react";

// eslint-disable-next-line import/prefer-default-export
export const withConfirmBasicFormHoC = (basicForm: React.FC) => {
  const withConfirmStatProps = {
    children: 'xxx',
  }
  const ComponentWithStat = React.createElement(basicForm, withConfirmStatProps)
  return ComponentWithStat
}