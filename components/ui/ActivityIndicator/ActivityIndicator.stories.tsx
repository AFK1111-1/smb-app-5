import { Meta, StoryObj } from '@storybook/react';
import ActivityIndicator from '.';
import { View } from 'react-native';

const meta = {
  title: 'UI/ActivityIndicator',
  component: ActivityIndicator,
  args: {
    size: 24,
    color: 'primary',
  },
  decorators: [
    (Story) => (
      <View
        style={{
          padding: 20,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'number' },
    },
    color: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof ActivityIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: {
    size: 40,
  },
};

export const Colored: Story = {
  args: {
    color: 'red',
  },
};
