import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import Searchbar from '.';

const SearchbarWrapper = (args: any) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <Searchbar
      placeholder={args.placeholder}
      loading={args.loading}
      mode={args.mode}
      elevation={args.elevation}
      value={value}
      onChangeText={(text: string) => {
        setValue(text);
        args.onChangeText?.(text);
      }}
      onIconPress={args.onIconPress}
      onSubmitEditing={args.onSubmitEditing}
    />
  );
};

const meta = {
  title: 'UI/Searchbar',
  component: Searchbar,
  render: SearchbarWrapper,
  args: {
    placeholder: 'Search for anything...',
    value: '',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    placeholder: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    onChangeText: { action: 'text changed' },
    onIconPress: { action: 'icon pressed' },
    onSubmitEditing: { action: 'submitted' },
    loading: { control: { type: 'boolean' } },
    elevation: { control: { type: 'number', min: 0, max: 24 } },
    mode: {
      control: { type: 'select' },
      options: ['bar', 'view'],
    },
  },
} satisfies Meta<typeof Searchbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPrefilledText: Story = {
  args: {
    value: 'Search result 02',
  },
};

export const Loading: Story = {
  args: {
    placeholder: 'Searching...',
    loading: true,
  },
};

export const Elevated: Story = {
  args: {
    elevation: 4,
  },
};
