import { Meta, StoryObj } from '@storybook/react';
import MenuItem from '.';
import { View } from 'react-native';
import { Switch as PaperSwitch, Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeContext';

const meta = {
  title: 'UI/MenuItem',
  component: MenuItem,
  args: {
    title: 'Menu Item',
    showChevron: true,
  },
  decorators: [
    (Story) => {
      const { colors } = useAppTheme();
      return (
        <View style={{ padding: 20, backgroundColor: colors.card, borderRadius: 12 }}>
          <Story />
        </View>
      );
    },
  ],
  argTypes: {
    onPress: { action: 'pressed' },
    title: {
      control: { type: 'text' },
    },
    icon: {
      control: { type: 'text' },
    },
    iconType: {
      control: { type: 'select' },
      options: ['svg', 'material'],
    },
    showChevron: {
      control: { type: 'boolean' },
    },
    isLast: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof MenuItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Menu Item',
    onPress: () => {},
  },
};

export const WithSVGIcon: Story = {
  args: {
    title: 'Dark Mode',
    icon: 'moonIcon',
    iconType: 'svg',
    onPress: () => {},
  },
};

export const WithMaterialIcon: Story = {
  args: {
    title: 'Manage Account',
    icon: 'pencil-outline',
    iconType: 'material',
    onPress: () => {},
  },
};

export const WithoutChevron: Story = {
  args: {
    title: 'No Chevron',
    icon: 'shieldIcon',
    iconType: 'svg',
    showChevron: false,
    onPress: () => {},
  },
};

export const LastItem: Story = {
  args: {
    title: 'Last Item (No Separator)',
    icon: 'helpCircleIcon',
    iconType: 'svg',
    isLast: true,
    onPress: () => {},
  },
};

const SwitchComponent = () => {
  const { colors } = useAppTheme();
  return <PaperSwitch value={true} color={colors.primary} />;
};

export const WithRightElement: Story = {
  args: {
    title: 'Dark Mode',
    icon: 'moonIcon',
    iconType: 'svg',
    showChevron: false,
    rightElement: <SwitchComponent />,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Menu Item Without Icon',
    onPress: () => {},
  },
};

export const Multiple: Story = {
  decorators: [
    (Story) => {
      const { colors } = useAppTheme();
      return (
        <View style={{ padding: 20, backgroundColor: colors.card, borderRadius: 12 }}>
          <MenuItem
            title="Privacy"
            icon="shieldIcon"
            iconType="svg"
            onPress={() => {}}
          />
          <MenuItem
            title="Language"
            icon="globeIcon"
            iconType="svg"
            onPress={() => {}}
          />
          <MenuItem
            title="Help"
            icon="helpCircleIcon"
            iconType="svg"
            isLast
            onPress={() => {}}
          />
        </View>
      );
    },
  ],
  args: {},
};

export const MaterialIcons: Story = {
  decorators: [
    (Story) => {
      const { colors } = useAppTheme();
      return (
        <View style={{ padding: 20, backgroundColor: colors.card, borderRadius: 12 }}>
          <MenuItem
            title="Manage Account"
            icon="pencil-outline"
            iconType="material"
            onPress={() => {}}
          />
          <MenuItem
            title="Change Password"
            icon="information-outline"
            iconType="material"
            isLast
            onPress={() => {}}
          />
        </View>
      );
    },
  ],
  args: {},
};
