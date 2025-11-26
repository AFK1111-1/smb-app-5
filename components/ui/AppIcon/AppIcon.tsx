import { IconName, icons } from '@/assets/icons';
import React from 'react'
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { SvgProps } from 'react-native-svg';

type AppIconProps = {
    name: IconName,
    label?: string,
    size?: number,
    color?: string,

} & Omit<SvgProps, "width" | 'height'>
const AppIcon: React.FC<AppIconProps> = ({name, label,size = 24,color, ...rest }) => {
    const SVGIcon = icons[name]

    if(!SVGIcon){
        console.warn(`Icon ${name} not found in assets/icons`);
        return null;
    }
  return (
    <View style={{ justifyContent: 'center', alignItems:'center'}}>
    <SVGIcon width={size} height={size} color={color} fill='none' {...rest} />
    {label &&
    <Text style={{fontWeight: 500,fontSize: 10, lineHeight: 20, color: color }}>{label}</Text>
    }
    </View>
  )
}

export default AppIcon