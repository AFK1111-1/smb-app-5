import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import TextInput from '.';

const meta = {
  title: 'UI/TextInput',
  component: TextInput,
  args: {
    label: 'Label',
    placeholder: 'Placeholder text...',
    helperText: '',
    error: false,
    disabled: false,
  },

  decorators: [
    (Story) => (
      <View style={{ padding: 20, width: '100%' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    secureTextEntry: { control: { type: 'boolean' } },
    multiline: { control: { type: 'boolean' } },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Username',
    value: 'jane_doe',
  },
};

export const Error: Story = {
  args: {
    label: 'Password',
    value: '123',
    error: true,
    helperText: 'Password must be at least 8 characters.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'API Key',
    value: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://',
    helperText: 'Please enter the full URL.',
  },
};
export const Optional: Story = {
  args: {
    label: 'Optional TextField',
    optional: true,
  },
};
