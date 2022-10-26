import { fill } from 'lodash';
import React from 'react';

import BaseIcon from './BaseIcon';

const SwapIcon = ({ fill, ...props }) => (
  <BaseIcon {...props} viewBox="0 0 48 48">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      <path
        fill={fill}
        d="M32 34.02V20h-4v14.02h-6L30 42l8-7.98h-6zM18 6l-8 7.98h6V28h4V13.98h6L18 6z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  </BaseIcon>
);

export default SwapIcon;
