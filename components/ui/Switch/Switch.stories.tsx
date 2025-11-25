import React, { useState, useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import Switch from '.';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    labelPlacement: {
      control: 'radio',
      options: ['start', 'end'],
    },
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onValueChange: { action: 'onValueChange' },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

const InteractiveSwitchTemplate: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    const handleValueChange = (newValue: boolean) => {
      setValue(newValue);
      if (args.onValueChange) {
        args.onValueChange(newValue);
      }
    };

    return <Switch {...args} value={value} onValueChange={handleValueChange} />;
  },
};

export const Default: Story = {
  ...InteractiveSwitchTemplate,
  args: {
    label: 'Enable Feature',
    labelPlacement: 'start',
    value: true,
  },
};

export const LabelEnd: Story = {
  ...InteractiveSwitchTemplate,
  args: {
    label: 'Airplane Mode',
    labelPlacement: 'end',
    value: false,
  },
};

export const NoLabel: Story = {
  ...InteractiveSwitchTemplate,
  args: {
    value: false,
  },
};

export const DisabledOff: Story = {
  args: {
    label: 'Feature Locked',
    value: false,
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    label: 'Always Enabled',
    value: true,
    disabled: true,
  },
};
