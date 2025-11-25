import { Meta, StoryObj } from '@storybook/react';
import ManageAccountScreen from './ManageAccountScreen';
import { QueryClient } from '@tanstack/react-query';
import i18next from 'i18next';

const mockUpdateCurrentUser = () => {};

const meta: Meta<typeof ManageAccountScreen> = {
  title: 'Screens/ManageAccount',
  component: ManageAccountScreen,
  args: {
    queryClient: new QueryClient(),
    isUserUpdating: false,
    updateCurrentUser: mockUpdateCurrentUser,
    t: i18next.t,
  },
};

export default meta;

type Story = StoryObj<typeof ManageAccountScreen>;

export const Basic: Story = {
  args: {
    userProfile: {
      id: '1',
      email: 'john.alexander@gmail.com',
      firstName: 'John',
      lastName: 'Alexander',
      phoneNumber: '+61 497 841 703',
      address: '123 Main Street',
      city: 'Sydney',
      zipCode: '2000',
      role: 'user',
      avatar: null,
      status: 'active',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
};

export const EmptyProfile: Story = {
  args: {
    userProfile: {
      id: '1',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      city: '',
      zipCode: '',
      role: 'user',
      avatar: null,
      status: 'active',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
};

export const PartialProfile: Story = {
  args: {
    userProfile: {
      id: '1',
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '',
      address: '',
      city: '',
      zipCode: '',
      role: 'user',
      avatar: null,
      status: 'active',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
};

export const Loading: Story = {
  args: {
    isUserUpdating: true,
    userProfile: {
      id: '1',
      email: 'john.alexander@gmail.com',
      firstName: 'John',
      lastName: 'Alexander',
      phoneNumber: '+61 497 841 703',
      address: '123 Main Street',
      city: 'Sydney',
      zipCode: '2000',
      role: 'user',
      avatar: null,
      status: 'active',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
};

export const InternationalUser: Story = {
  args: {
    userProfile: {
      id: '2',
      email: 'maria.garcia@example.com',
      firstName: 'María',
      lastName: 'García',
      phoneNumber: '+34 612 345 678',
      address: 'Calle Mayor 10',
      city: 'Madrid',
      zipCode: '28013',
      role: 'user',
      avatar: null,
      status: 'active',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  },
};
