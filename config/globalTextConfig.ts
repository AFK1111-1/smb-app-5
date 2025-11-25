import { Text, TextInput, Platform } from 'react-native';
import { Fonts } from '@/constants/Fonts';

/**
 * Sets up global default font family for all Text and TextInput components
 * This ensures Inter is used throughout the app without explicitly setting fontFamily
 */
export const setupGlobalTextStyles = () => {
  try {
    // For Text component
    const oldTextRender = Text.render;
    if (oldTextRender) {
      Text.render = function render(props: any, ref: any) {
        return oldTextRender.call(this, {
          ...props,
          style: [{ fontFamily: Fonts.regular }, props.style],
        }, ref);
      };
    }

    // For TextInput component
    const oldTextInputRender = TextInput.render;
    if (oldTextInputRender) {
      TextInput.render = function render(props: any, ref: any) {
        return oldTextInputRender.call(this, {
          ...props,
          style: [{ fontFamily: Fonts.regular }, props.style],
        }, ref);
      };
    }
  } catch (error) {
    console.warn('Failed to set global text styles:', error);
  }
};
