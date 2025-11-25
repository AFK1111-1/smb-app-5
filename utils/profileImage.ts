import * as FileSystem from 'expo-file-system';

const AVATARS_DIR = `${FileSystem.documentDirectory}avatars/`;

export const getLocalAvatarPath = (
  identifier: string,
  ext: string = 'jpg',
): string => {
  const safeId = identifier.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${AVATARS_DIR}${safeId}.${ext}`;
};

export const ensureAvatarsDirExists = async (): Promise<void> => {
  try {
    const info = await FileSystem.getInfoAsync(AVATARS_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(AVATARS_DIR, { intermediates: true });
    }
  } catch (e) {
    console.warn('Avatar directory does not exisit');
  }
};

export const ensureLocalAvatar = async (
  remoteUrl: string,
  identifier: string,
): Promise<string> => {
  await ensureAvatarsDirExists();
  const extMatch = remoteUrl.match(/\.(png|jpg|jpeg|webp)(?:\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const localPath = getLocalAvatarPath(identifier, ext);
  const fileInfo = await FileSystem.getInfoAsync(localPath);
  if (fileInfo.exists) {
    return localPath;
  }
  try {
    await FileSystem.downloadAsync(remoteUrl, localPath);
    return localPath;
  } catch (error) {
    console.warn('ensureLocalAvatar download failed:', error);
    return remoteUrl;
  }
};

export const removeLocalAvatar = async (identifier: string): Promise<void> => {
  //  common extensions
  const candidates = ['jpg', 'jpeg', 'png', 'webp'].map((e) =>
    getLocalAvatarPath(identifier, e),
  );
  for (const path of candidates) {
    try {
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists) {
        await FileSystem.deleteAsync(path, { idempotent: true });
      }
    } catch {
      console.warn('Unable to delete local avatar');
    }
  }
};
