//docs.expo.dev/config-plugins/plugins/
import { ConfigPlugin } from '@expo/config-plugins';
import withNotifeeAndroidPlugin from './withNotifeeAndroidPlugin';

const withPlugin: ConfigPlugin = (config) => withNotifeeAndroidPlugin(config);

export default withPlugin;
