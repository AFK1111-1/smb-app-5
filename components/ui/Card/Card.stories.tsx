import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import Card from '.';

const meta = {
  title: 'UI/Card',
  component: Card,
  decorators: [
    (Story, { args }) => (
      <View
        style={{
          padding: 20,
          height: args.fullHeight ? 300 : undefined,
        }}
      >
        <Story />
      </View>
    ),
  ],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['outlined', 'contained', 'elevated'],
    },
    fullHeight: {
      control: 'boolean',
    },
    onPress: { action: 'pressed' },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

const Base: Story = {
  render: ({ children, ...args }) => (
    <Card {...args}>
      <Text variant="bodyMedium">{children}</Text>
    </Card>
  ),
};

export const Outlined: Story = {
  ...Base,
  args: {
    mode: 'outlined',
    children:
      "This is an outlined card. It's the default style and works well for most content.",
  },
};

export const Contained: Story = {
  ...Base,
  args: {
    mode: 'contained',
    children:
      'This is a contained card. It has a distinct background color and no border.',
  },
};

export const Elevated: Story = {
  ...Base,
  args: {
    mode: 'elevated',
    children:
      'This is an elevated card. It has a shadow to make it stand out from the background.',
  },
};

export const Clickable: Story = {
  ...Base,
  args: {
    mode: 'outlined',
    onPress: () => {},
    children:
      'This card is clickable. Check the "Actions" tab in the Storybook panel to see the press event.',
  },
};

export const FullHeight: Story = {
  ...Base,
  args: {
    mode: 'outlined',
    fullHeight: true,
    children:
      'This card has the `fullHeight` prop. It will expand to fill the height of its container (300px in this story).',
  },
};
