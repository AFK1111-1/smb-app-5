import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import React, { useCallback, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
} from 'react-native';
import {
  Searchbar as PaperSearchbar,
  SearchbarProps as PaperSearchbarProps,
} from 'react-native-paper';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

// FIXME - move to theme; ref: https://www.figma.com/design/b4bqgPGWLfChOZ9UphsW0n/SMB-Design-system?node-id=1-16&t=Fb47n7NC8APJXlkU-4
const FOCUS_BORDER = '#A3BBFD';
const FOCUS_SHADOW = '#F0F1FB';

const Searchbar = (props: PaperSearchbarProps) => {
  const { onFocus, onBlur, ...rest } = props;
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const styles = useMemo(
    () => createStyles(colors, isFocused),
    [colors, isFocused],
  );

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  return (
    <PaperSearchbar
      {...rest}
      style={[styles.searchbar, props.style]}
      placeholderTextColor={colors.backgrounds.quinary}
      inputStyle={styles.inputText}
      iconColor={colors.text}
      traileringIconColor={colors.text}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default Searchbar;

const createStyles = (colors: AppColors, isFocused: boolean) => {
  return StyleSheet.create({
    searchbar: {
      borderRadius: 8,
      backgroundColor: colors.backgrounds.primary,
      borderColor: isFocused ? FOCUS_BORDER : colors.backgrounds.quaternary,
      borderWidth: 1,
      ...(isFocused && {
        boxShadow: `0px 0px 0px 2px ${FOCUS_SHADOW}`,
      }),
    },
    inputText: {
      color: colors.text,
    },
  });
};
