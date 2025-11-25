import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { List, PaperProvider } from 'react-native-paper';
import ListAccordion from './';

const ListAccordionWrapper = (args: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ListAccordion
      {...args}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
    />
  );
};

const meta: Meta<typeof ListAccordion> = {
  title: 'UI/ListAccordion',
  component: ListAccordion,
  render: ListAccordionWrapper,
  decorators: [
    (Story) => (
      <PaperProvider>
        <View style={{ padding: 16 }}>
          <Story />
        </View>
      </PaperProvider>
    ),
  ],

  argTypes: {
    title: { control: 'text' },
    icon: { control: 'text' },
    description: { control: 'text' },
    expanded: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof ListAccordion>;
export const Default: Story = {
  args: {
    title: 'Default Uncontrolled Accordion',
    icon: 'folder-outline',
    items: [
      { title: 'First Item' },
      { title: 'Second Item', description: 'This one has a description' },
    ],
  },
};

export const WithDescription: Story = {
  args: {
    ...Default.args, // Inherits args from the Default story
    title: 'Accordion with Description',
    description: 'Optional details here',
    icon: 'information-outline',
  },
};

export const Controlled: Story = {
  args: {
    ...Default.args,
    title: 'Controlled Accordion (Starts Open)',
    icon: 'cogs',
    items: [{ title: 'Setting A' }, { title: 'Setting B' }],
  },
};

export const Grouped: Story = {
  render: () => (
    <List.AccordionGroup>
      <ListAccordion
        id="1"
        title="Personal Info"
        icon="account-circle-outline"
        items={[{ title: 'Edit Profile' }, { title: 'Change Password' }]}
      />
      <ListAccordion
        id="2"
        title="Notifications"
        icon="bell-outline"
        items={[{ title: 'Email' }, { title: 'Push' }, { title: 'SMS' }]}
      />
      <ListAccordion
        id="3"
        title="Privacy"
        icon="lock-outline"
        items={[{ title: 'Data Sharing' }, { title: 'Ad Preferences' }]}
      />
    </List.AccordionGroup>
  ),
};
