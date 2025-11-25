import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import CustomInput from './index';

const meta = {
  title: 'UI/CustomInput',
  component: CustomInput,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    optional: true,
    showInfo: true,
    error: false,
    size: 40,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, width: '100%', gap: 16 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    error: { control: { type: 'boolean' } },
    optional: { control: { type: 'boolean' } },
    showInfo: { control: { type: 'boolean' } },
    editable: { control: { type: 'boolean' } },
    size: {
      control: { type: 'select' },
      options: [32, 40, 48],
    },
  },
} satisfies Meta<typeof CustomInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    size: 40,
    optional: true,
    showInfo: true,
  },
};

export const Size32: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    size: 32,
    optional: true,
    showInfo: true,
  },
};

export const Size48: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    size: 48,
    optional: true,
    showInfo: true,
  },
};

export const Filled: Story = {
  args: {
    label: 'Label',
    value: 'Placeholder',
    size: 40,
    optional: true,
    showInfo: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Label',
    value: 'Invalid input',
    error: true,
    helperText: 'Validation error',
    size: 40,
    optional: true,
    showInfo: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    editable: false,
    size: 40,
    optional: true,
    showInfo: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Label',
    value: 'Placeholder',
    editable: false,
    size: 40,
    optional: true,
    showInfo: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: 'Placeholder',
    size: 40,
  },
};

export const WithoutOptional: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    optional: false,
    showInfo: true,
    size: 40,
  },
};

export const WithoutInfo: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    optional: true,
    showInfo: false,
    size: 40,
  },
};

export const MultipleInputs: Story = {
  render: () => (
    <View style={{ gap: 16, width: '100%' }}>
      <CustomInput
        label="Email"
        placeholder="you@example.com"
        size={40}
        optional={false}
        showInfo={true}
      />
      <CustomInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        size={40}
        optional={false}
        showInfo={true}
      />
      <CustomInput
        label="Phone Number"
        placeholder="+1 (555) 000-0000"
        size={40}
        optional={true}
        showInfo={true}
      />
    </View>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 16, width: '100%' }}>
      <CustomInput
        label="Size 32"
        placeholder="Small input"
        size={32}
        optional={true}
        showInfo={true}
      />
      <CustomInput
        label="Size 40"
        placeholder="Default input"
        size={40}
        optional={true}
        showInfo={true}
      />
      <CustomInput
        label="Size 48"
        placeholder="Large input"
        size={48}
        optional={true}
        showInfo={true}
      />
    </View>
  ),
};

export const AllStates: Story = {
  render: () => (
    <View style={{ gap: 16, width: '100%' }}>
      <CustomInput
        label="Default State"
        placeholder="Placeholder"
        size={40}
        optional={true}
        showInfo={true}
      />
      <CustomInput
        label="Filled State"
        value="Some text"
        size={40}
        optional={true}
        showInfo={true}
      />
      <CustomInput
        label="Error State"
        value="Invalid input"
        error={true}
        helperText="Validation error"
        size={40}
        optional={true}
        showInfo={true}
      />
      <CustomInput
        label="Disabled State"
        placeholder="Placeholder"
        editable={false}
        size={40}
        optional={true}
        showInfo={true}
      />
      <CustomInput
        label="Read Only State"
        value="Read only value"
        editable={false}
        size={40}
        optional={true}
        showInfo={true}
      />
    </View>
  ),
};
