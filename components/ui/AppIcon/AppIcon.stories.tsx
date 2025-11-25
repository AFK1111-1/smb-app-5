import React from 'react';
import { Meta } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import { IconName, icons } from '@/assets/icons';
export default {
    title: 'UI/AppIcon/AllIcons',
    component: AppIcon,
} as Meta;

export const AllIcons = () => (
    <View style={styles.container}>
        {Object.keys(icons).map((name) => (
            <View key={name} style={styles.iconItem}>
                <AppIcon name={name as IconName} size={32} color='purple' />
                <Text style={styles.iconLabel}>Icon Name: {name}</Text>
            </View>
        ))}
    </View>
);
export const AllIconsWithLabel = () => (
    <View style={styles.container}>
        {Object.keys(icons).map((name) => (
            <View key={name} style={styles.iconItem}>
                <AppIcon name={name as IconName} size={32} color='purple' label='Title'/>
                <Text style={styles.iconLabel}>Icon Name: {name}</Text>
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
   
    },
    iconItem: {
        alignItems: 'center',
        margin: 12,
        width: 80,
    },
    iconLabel: {
        marginTop: 8,
        fontSize: 12,
        textAlign: 'left',
    },
});