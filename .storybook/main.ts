import { StorybookConfig } from '@storybook/react-native-web-vite';

const main: StorybookConfig = {
  stories: [
    '../app/components/**/*.stories.mdx',
    '../app/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../app/screens/**/*.stories.mdx',
    '../app/screens/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: ['@storybook/addon-docs', '@chromatic-com/storybook'],

  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen',
  },
};

export default main;
