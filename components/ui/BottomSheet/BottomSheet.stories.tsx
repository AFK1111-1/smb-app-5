import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import Button from '../Button';
import BottomSheet, { BottomSheetModal } from './index';

const storyStyles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
  defaultContent: {
    padding: 20,
    alignItems: 'center',
  },
  backdropTrigger: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  dialogContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: 'black',
  },
  confirmButton: {
    flex: 1,
  },
  listTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

const DefaultBottomSheet = (args: any) => {
  const [currentIndex, setCurrentIndex] = useState(args.index || 0);

  const snapPoints = args.snapPoints || [];

  return (
    <BottomSheet {...args} onChange={(index) => setCurrentIndex(index)}>
      <BottomSheet.View style={storyStyles.defaultContent}>
        <Text variant="bodyLarge">Bottom Sheet</Text>
        <Text variant="bodyLarge">{snapPoints[currentIndex]}</Text>
      </BottomSheet.View>
    </BottomSheet>
  );
};

const WithBackdropComponent = (args: any) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <>
      <View style={storyStyles.backdropTrigger}>
        <Button mode="contained" onPress={openBottomSheet}>
          Open Bottom Sheet
        </Button>
      </View>

      <BottomSheet
        {...args}
        ref={bottomSheetRef}
        onOutsidePress={closeBottomSheet}
      >
        <BottomSheet.View style={storyStyles.backdropContent}>
          <Text variant="titleLarge" style={storyStyles.title}>
            Bottom Sheet with Backdrop
          </Text>
          <Text style={storyStyles.description}>
            This bottom sheet has a dark backdrop overlay. Tap outside or swipe
            down to close.
          </Text>
          <Button mode="contained" onPress={closeBottomSheet}>
            Close
          </Button>
        </BottomSheet.View>
      </BottomSheet>
    </>
  );
};

const ListViewComponent = (args: any) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i.toString(),
    title: `${Math.random() > 0.5 ? 'John' : 'Jane'} Doe ${i + 1}`,
    subtitle: `street ${i + 1}, city, country`,
  }));

  return (
    <>
      <View style={storyStyles.backdropTrigger}>
        <Button mode="contained" onPress={openBottomSheet}>
          Select Contact
        </Button>
      </View>

      <BottomSheet
        {...args}
        ref={bottomSheetRef}
        showBackdrop={false}
        onOutsidePress={closeBottomSheet}
      >
        <Text variant="titleLarge" style={storyStyles.listTitle}>
          Select Contact
        </Text>
        <BottomSheet.FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.title}
              description={item.subtitle}
              left={(props) => <List.Icon {...props} icon="account" />}
              onPress={() => {
                closeBottomSheet();
              }}
            />
          )}
        />
      </BottomSheet>
    </>
  );
};

// ----

const meta: Meta<typeof BottomSheet> = {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  decorators: [
    (Story) => (
      <View style={storyStyles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    snapPoints: ['30%', '60%', '90%', '100%'],
    index: 0,
  },
  render: DefaultBottomSheet,
};

export const WithBackdrop: Story = {
  args: {
    snapPoints: ['40%', '80%'],
    enablePanDownToClose: true,
    showBackdrop: true,
    index: -1,
  },
  render: WithBackdropComponent,
};

export const ConfirmationDialog: Story = {
  args: {
    index: 0,
    enableDynamicSizing: true,
  },
  render: (args) => (
    <BottomSheet {...args}>
      <BottomSheet.View style={storyStyles.dialogContent}>
        <Text variant="titleLarge">Heading</Text>
        <Text>Are you sure you want to log out?</Text>
        <View style={storyStyles.dialogActions}>
          <Button
            style={storyStyles.cancelButton}
            labelStyle={storyStyles.cancelButtonText}
          >
            Cancel
          </Button>
          <Button buttonColor="primary" style={storyStyles.confirmButton}>
            Log Out
          </Button>
        </View>
      </BottomSheet.View>
    </BottomSheet>
  ),
};

export const ListView: Story = {
  args: {
    snapPoints: ['50%', '90%'],
    enablePanDownToClose: true,
  },
  render: ListViewComponent,
};
