import React from 'react';
import {
  RadioButton as PaperRadioButton,
  RadioButtonGroupProps,
} from 'react-native-paper';
import RadioGroupItem from './RadioGroupItem';

export interface RadioButtonItem {
  value: string;
  label: string;
}

export interface RadioGroupProps
  extends Omit<RadioButtonGroupProps, 'children'> {
  items: RadioButtonItem[];
}

const RadioGroup = (props: RadioGroupProps) => {
  const { items, ...groupRest } = props;
  return (
    <PaperRadioButton.Group {...groupRest}>
      {items.map((item, index) => (
        <RadioGroupItem key={index} label={item.label} value={item.value} />
      ))}
    </PaperRadioButton.Group>
  );
};

export default RadioGroup;
