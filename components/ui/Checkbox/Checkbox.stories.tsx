import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import Checkbox from '.';

// The main configuration for the Checkbox stories
const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  args: {
    label: 'Checkbox Label',
    status: 'unchecked',
    disabled: false,
    labelPlacement: 'start',
  },
  // Decorators wrap the story in a View with padding and gap for better presentation
  decorators: [
    (Story) => (
      <View style={{ padding: 20, gap: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  // Defines the controls for the props in the Storybook UI
  argTypes: {
    label: { control: { type: 'text' } },
    status: {
      control: { type: 'radio' },
      options: ['checked', 'unchecked', 'indeterminate'],
    },
    disabled: { control: { type: 'boolean' } },
    labelPlacement: {
      control: { type: 'radio' },
      options: ['start', 'end'],
    },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Unchecked',
    status: 'unchecked',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    status: 'checked',
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate',
    status: 'indeterminate',
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'Disabled Unchecked',
    status: 'unchecked',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked',
    status: 'checked',
    disabled: true,
  },
};

export const WithLabelEnd: Story = {
  args: {
    label: 'Label at End',
    labelPlacement: 'end',
  },
};

export const NoLabel: Story = {
  args: {
    label: '',
  },
};

export const Interactive: Story = {
  args: {
    label: 'Click to Toggle',
  },
  render: (args) => {
    const [status, setStatus] = useState<
      'checked' | 'unchecked' | 'indeterminate'
    >('unchecked');

    const handlePress = () => {
      // Create a dummy event object for the action logger if needed
      args.onPress?.({} as any);
      setStatus(status === 'checked' ? 'unchecked' : 'checked');
    };

    return <Checkbox {...args} status={status} onPress={handlePress} />;
  },
};
