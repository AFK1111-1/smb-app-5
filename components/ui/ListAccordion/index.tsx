import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { List } from 'react-native-paper';

interface ListItem {
  title: string;
  description?: string;
  onPress?: () => void;
}

interface ListAccordionProps {
  title: string;
  items: ListItem[];
  icon?: string;
  id?: string | number;
  expanded?: boolean;
  onPress?: () => void;
  style?: object;
  titleStyle?: object;
  description?: string;
}

const ListAccordion: React.FC<ListAccordionProps> = ({
  title,
  items,
  icon,
  id,
  expanded,
  onPress,
  style,
  titleStyle,
  description,
}) => {
  const leftContent = icon
    ? (props: { color: string; style?: StyleProp<ViewStyle> }) => (
        <List.Icon {...props} icon={icon} />
      )
    : undefined;

  return (
    <List.Accordion
      title={title}
      description={description}
      left={leftContent}
      id={id}
      expanded={expanded}
      onPress={onPress}
      style={style}
      titleStyle={titleStyle}
    >
      {items.map((item, index) => (
        <List.Item
          key={index}
          title={item.title}
          description={item.description}
          onPress={item.onPress}
        />
      ))}
    </List.Accordion>
  );
};

export default ListAccordion;
