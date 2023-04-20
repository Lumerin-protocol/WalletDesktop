import React from 'react';
import { Title } from './ContractsList.styles';
import { IconRefresh } from '@tabler/icons';

export default function StatusHeader(props) {
  const formatStatus = s => {
    if (s === 'up-to-date') {
      return 'up to date';
    }
    return s;
  };

  return (
    <>
      <Title style={{ display: 'flex', alignItems: 'center' }}>
        Status: {formatStatus(props.syncStatus)}
        {(props.syncStatus === 'up-to-date' ||
          props.syncStatus === 'failed') && (
          <IconRefresh
            onClick={props.refresh}
            style={{
              marginLeft: '5px',
              width: '20px',
              paddingTop: '2px',
              cursor: 'pointer'
            }}
          />
        )}
      </Title>
    </>
  );
}
