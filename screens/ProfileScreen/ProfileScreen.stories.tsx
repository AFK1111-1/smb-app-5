import { Meta, StoryObj } from '@storybook/react';
import ProfileScreen from './ProfileScreen';
import { QueryClient } from '@tanstack/react-query';
import i18next from 'i18next';

const mockLogout = async () => Promise.resolve({} as any);
const mockDeleteUser = async () => Promise.resolve({});
const mockDeleteUserAvatar = async () => Promise.resolve({ message: 'ok' });
const mockUpdateUserAvatar = async () => Promise.resolve({});
const mockUpdateCurrentUser = () => {};

const meta: Meta<typeof ProfileScreen> = {
  title: 'Screens/Profile',
  component: ProfileScreen,
  args: {
    isAvatarDeleting: false,
    isAvatarUploading: false,
    queryClient: new QueryClient(),
    isUserDeleting: false,
    isUserUpdating: false,
    logout: mockLogout,
    deleteUser: mockDeleteUser,
    deleteUserAvatar: mockDeleteUserAvatar,
    updateUserAvatar: mockUpdateUserAvatar,
    updateCurrentUser: mockUpdateCurrentUser,
    t: i18next.t,
  },
};

export default meta;

type Story = StoryObj<typeof ProfileScreen>;

export const Basic: Story = {
  args: {
    userProfile: {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      avatar: null,
      status: 'active',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
};
