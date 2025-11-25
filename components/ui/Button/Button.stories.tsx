import { Meta, StoryObj } from '@storybook/react';
import Button from '.';
import { View } from 'react-native';

const meta = {
  title: 'UI/Buttons',
  component: Button,
  args: {
    children: 'Button Text',
    buttonColor: 'primary',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    onPress: { action: 'pressed' },
    mode: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained', 'elevated', 'contained-tonal'],
    },
    buttonColor: {
      control: { type: 'radio' },
      options: ['primary', 'error'],
    },
    iconPosition: {
      control: { type: 'radio' },
      options: ['left', 'right'],
    },
    children: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  args: {
    mode: 'contained',
    children: 'Contained Button',
  },
};

export const Outlined: Story = {
  args: {
    mode: 'outlined',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    mode: 'text',
    children: 'Text Button',
  },
};

export const ContainedError: Story = {
  args: {
    mode: 'contained',
    children: 'Contained Error',
    buttonColor: 'error',
  },
};

export const OutlinedError: Story = {
  args: {
    mode: 'outlined',
    children: 'Outlined Error',
    buttonColor: 'error',
  },
};

export const TextError: Story = {
  args: {
    mode: 'text',
    children: 'Text Error',
    buttonColor: 'error',
  },
};

export const Disabled: Story = {
  args: {
    mode: 'contained',
    children: 'Disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    mode: 'contained',
    children: 'Submitting',
    loading: true,
  },
};

export const WithIconLeft: Story = {
  args: {
    mode: 'contained',
    children: 'Icon Left',
    icon: 'camera',
    iconPosition: 'left',
  },
};

export const WithIconRight: Story = {
  args: {
    mode: 'contained',
    children: 'Icon Right',
    icon: 'send',
    iconPosition: 'right',
  },
};

export const ErrorWithIcon: Story = {
  args: {
    mode: 'contained',
    buttonColor: 'error',
    children: 'Error with Icon',
    icon: 'alert-circle',
  },
};
