import { Meta, StoryObj } from '@storybook/react';
import IconButton from '.';
import { View } from 'react-native';

const IconButtonWrapper = (args: any) => {
  return <IconButton {...args} onPress={args.onPress} />;
};

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  render: IconButtonWrapper,
  args: {
    icon: 'camera',
    size: 24,
    iconColor: 'primary',
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
    icon: {
      control: { type: 'text' },
    },
    size: {
      control: { type: 'number' },
    },
    iconColor: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'camera',
    iconColor: 'primary',
  },
};

export const Large: Story = {
  args: {
    icon: 'camera',
    size: 40,
    iconColor: 'primary',
  },
};

export const Error: Story = {
  args: {
    icon: 'alert-circle',
    iconColor: 'error',
  },
};

export const CustomIcon: Story = {
  args: {
    icon: 'home',
    size: 30,
    iconColor: 'green',
    onPress: () => console.log('Home Pressed!'),
  },
};
