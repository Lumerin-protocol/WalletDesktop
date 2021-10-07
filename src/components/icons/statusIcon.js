import React from 'react';
import styled from 'styled-components';

import BaseIcon from './BaseIcon';

const StatusIcon = ({ isActive }, props) => {
  const Circle = styled.div`
    background-color: ${p => p.theme.colors.medium};
    border-radius: 50%;
  `;
  const fill = isActive ? '#8C2AF5' : 'black';

  return (
    <Circle>
      <BaseIcon width="19" height="19" viewBox="0 0 19 19" {...props}>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17 9.5C17 13.6421 13.6421 17 9.5 17C5.35786 17 2 13.6421 2 9.5C2 5.35786 5.35786 2 9.5 2C13.6421 2 17 5.35786 17 9.5ZM19 9.5C19 14.7467 14.7467 19 9.5 19C4.25329 19 0 14.7467 0 9.5C0 4.25329 4.25329 0 9.5 0C14.7467 0 19 4.25329 19 9.5ZM9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6V11C11 11.5523 10.5523 12 10 12H9.99901H6C5.44772 12 5 11.5523 5 11C5 10.4477 5.44772 10 6 10H9V6Z"
          fill={fill}
        />
      </BaseIcon>
    </Circle>
  );
};

export default StatusIcon;
