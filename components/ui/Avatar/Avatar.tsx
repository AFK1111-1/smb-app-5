import React, { memo, useState } from 'react';
import { Image } from 'expo-image';

interface AvatarProps {
  uri: string | null;
  size: number;
}
const Avatar: React.FC<AvatarProps> = ({ uri, size }) => {
  const [imageError, setImageError] = useState(false);

  const showFallback = !uri || imageError;

  return (
    <Image
      source={
        showFallback ? require('../../../assets/images/avatar.png') : { uri }
      }
      style={{
        width: size,
        height: size,
      }}
      contentFit="cover"
      transition={200}
      onError={() => {
        setImageError(true);
      }}
      placeholder={
        showFallback ? require('../../../assets/images/avatar.png') : undefined
      }
      placeholderContentFit="cover"
      cachePolicy="memory-disk"
      recyclingKey={uri ?? 'default-avatar'}
    />
  );
};

export default memo(Avatar);
