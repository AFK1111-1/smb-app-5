import React, { useState, useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import InAppNotification from './InAppNotification';
import { View, Button } from 'react-native';

const meta = {
  title: 'UI/Notification/InAppNotification',
  component: InAppNotification,
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
} satisfies Meta<typeof InAppNotification>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: false,
    title: 'Notification Title',
    body: 'This is the body of the notification.',
    onHide: () => {},
  },
  render: () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (visible) {
        const timeout = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timeout);
      }
    }, [visible]);

    return (
      <>
        <Button title="Show Notification" onPress={() => setVisible(true)} />
        <InAppNotification
          title="Notification Title"
          body="This is the body of the notification."
          visible={visible}
          onHide={() => setVisible(false)}
        />
      </>
    );
  },
};
