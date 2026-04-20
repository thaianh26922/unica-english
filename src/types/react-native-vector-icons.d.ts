declare module 'react-native-vector-icons/Ionicons' {
  import * as React from 'react';
  import type { TextStyle } from 'react-native';

  export type IconProps = {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  };

  const Ionicons: React.ComponentType<IconProps>;
  export default Ionicons;
}

