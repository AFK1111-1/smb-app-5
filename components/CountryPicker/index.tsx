import { COUNTRIES, Country } from '@/constants/countries';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { AppColors } from '@/constants/Colors';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from '../ui';

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedCountry?: Country;
}

export default function CountryPicker({
  visible,
  onClose,
  onSelect,
  selectedCountry,
}: CountryPickerProps) {
  const { colors } = useAppTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const snapPoints = useMemo(() => ['75%'], []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSelectCountry = (country: Country) => {
    onSelect(country);
    setSearchQuery('');
    onClose();
  };

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const styles = createStyles(colors);

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCountry?.code === item.code;
    return (
      <TouchableOpacity
        style={[styles.countryItem, isSelected && styles.selectedCountryItem]}
        onPress={() => handleSelectCountry(item)}
      >
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text variant="medium" style={styles.countryDialCode}>{item.dialCode}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.header}>
        <Text variant="semiBold" style={styles.title}>Select Country</Text>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.text}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search country..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <BottomSheetFlatList
        data={filteredCountries}
        renderItem={renderCountryItem}
        keyExtractor={(item: Country) => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </BottomSheetModal>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    bottomSheetBackground: {
      backgroundColor: colors.backgrounds.secondary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    handleIndicator: {
      backgroundColor: colors.border,
      width: 40,
    },
    title: {
      fontSize: 18,
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingHorizontal: 12,
      marginBottom: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
    },
    listContent: {
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      gap: 12,
    },
    selectedCountryItem: {
      backgroundColor: colors.backgrounds.tertiary,
    },
    countryFlag: {
      fontSize: 24,
      width: 32,
    },
    countryName: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
    countryDialCode: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
