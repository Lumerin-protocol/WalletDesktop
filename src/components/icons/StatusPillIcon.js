import React from 'react';
import styled from 'styled-components';

import BaseIcon from './BaseIcon';

const StatusPillIcon = ({ fill, text, size }, props) => {
  return (
    <BaseIcon width="61" height="25" viewBox="0 0 61 25" {...props}>
      {/* <rect width="61" height="25" rx="12.5" fill="#DB2642"/> */}
      <rect width="61" height="25" rx="12.5" fill={fill}>
        {text}
      </rect>
    </BaseIcon>
  );
};

export default StatusPillIcon;
