import React from 'react';
import styled from 'styled-components';

import BaseIcon from './BaseIcon';

const RejectedIcon = props => (
  <BaseIcon width="19" height="19" viewBox="0 0 19 19" {...props}>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17 9.5C17 13.6421 13.6421 17 9.5 17C7.68356 17 6.01794 16.3543 4.72018 15.2798L15.2798 4.72018C16.3543 6.01794 17 7.68356 17 9.5ZM3.36143 13.8101L13.8101 3.36142C12.5907 2.50364 11.1042 2 9.5 2C5.35786 2 2 5.35786 2 9.5C2 11.1042 2.50364 12.5907 3.36143 13.8101ZM19 9.5C19 14.7467 14.7467 19 9.5 19C4.25329 19 0 14.7467 0 9.5C0 4.25329 4.25329 0 9.5 0C14.7467 0 19 4.25329 19 9.5Z"
      fill="#DB2642"
    />
  </BaseIcon>
);

export default RejectedIcon;
