import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import BottomSheetGorhom, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetView,
  BottomSheetVirtualizedList,
  BottomSheetProps as GorhomBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import * as React from 'react';
import { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface BottomSheetProps
  extends Omit<GorhomBottomSheetProps, 'backdropComponent'> {
  showBackdrop?: boolean;
  /** onOutsidePress will only work when showBackdrop is `true` */
  onOutsidePress?: () => void;
  backdropProps?: Omit<Partial<BottomSheetDefaultBackdropProps>, 'onPress'>;
}

/**
 * We will be using [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet)
 * for bottom-sheet component as per the recommendation from
 * [react-native-paper docs](https://callstack.github.io/react-native-paper/docs/guides/recommended-libraries#bottom-sheet)
 */
interface BottomSheetComponentType
  extends React.ForwardRefExoticComponent<
    BottomSheetProps & React.RefAttributes<BottomSheetGorhom>
  > {
  View: typeof BottomSheetView;
  FlatList: typeof BottomSheetFlatList;
  ScrollView: typeof BottomSheetScrollView;
  SectionList: typeof BottomSheetSectionList;
  VirtualizedList: typeof BottomSheetVirtualizedList;
  Backdrop: typeof BottomSheetBackdrop;
}

const BottomSheet = forwardRef<BottomSheetGorhom, BottomSheetProps>(
  function BottomSheet(
    {
      children,
      backgroundStyle = {},
      handleStyle,
      handleIndicatorStyle,
      enableDynamicSizing = false,
      showBackdrop = false,
      onOutsidePress,
      backdropProps,
      ...rest
    },
    ref,
  ) {
    const { colors } = useAppTheme();

    const styles = useMemo(() => createStyles(colors), [colors]);

    const backdropComponent = useCallback(
      (libBackdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...libBackdropProps}
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          onPress={onOutsidePress}
        />
      ),
      [showBackdrop, onOutsidePress, backdropProps],
    );

    return (
      <BottomSheetGorhom
        ref={ref}
        backgroundStyle={StyleSheet.compose(styles.bg, backgroundStyle)}
        handleStyle={StyleSheet.compose(styles.handle, handleStyle)}
        handleIndicatorStyle={StyleSheet.compose(
          styles.handleIndicator,
          handleIndicatorStyle,
        )}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={showBackdrop ? backdropComponent : undefined}
        {...rest}
      >
        {children}
      </BottomSheetGorhom>
    );
  },
);

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    bg: {
      backgroundColor: colors.backgrounds.tertiary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    handle: {
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginBottom: 8,
    },
    handleIndicator: {
      width: 36,
      height: 4,
      backgroundColor: colors.secondaryDark,
    },
  });

const BottomSheetComponent = BottomSheet as BottomSheetComponentType;
BottomSheetComponent.View = BottomSheetView;
BottomSheetComponent.FlatList = BottomSheetFlatList;
BottomSheetComponent.ScrollView = BottomSheetScrollView;
BottomSheetComponent.SectionList = BottomSheetSectionList;
BottomSheetComponent.VirtualizedList = BottomSheetVirtualizedList;

export default BottomSheetComponent;
export type BottomSheetModal<T = any> = BottomSheetModalMethods<T>;
