import { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import Avatar from './Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  args: {
    size: 100,
    uri: null,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, gap: 16, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'number' },
    },
    uri: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    uri: null,
  },
};

export const WithRemoteImage: Story = {
  args: {
    size: 120,
    uri: 'https://placehold.co/100',
  },
};

export const BrokenImage: Story = {
  args: {
    size: 120,
    uri: 'https://invalid-url-to-trigger-error.com/avatar.png',
  },
};
