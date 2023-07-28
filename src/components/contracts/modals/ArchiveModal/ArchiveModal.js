import React, { useEffect, useState } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import {
  Modal,
  Body,
  TitleWrapper,
  Title,
  Subtitle,
  CloseModal
} from '../CreateContractModal.styles';
import ArchiveRow from './ArchiveRow';
import { withClient } from '../../../../store/hocs/clientContext';

function ArchiveModal(props) {
  const { isActive, close, deletedContracts, client } = props;

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  if (!isActive) {
    return <></>;
  }

  const handleRestore = contract => {
    client.lockSendTransaction();
    return client
      .setDeleteContractStatus({
        contractId: contract.id,
        walletAddress: contract.seller,
        deleteContract: false
      })
      .finally(() => {
        client.unlockSendTransaction();
      });
  };

  const rowRenderer = deletedContracts => ({ key, index, style }) => (
    <ArchiveRow
      key={deletedContracts[index].id}
      contract={deletedContracts[index]}
      handleRestore={handleRestore}
    />
  );

  return (
    <Modal onClick={handleClose}>
      <Body height={'400px'} onClick={handlePropagation}>
        {CloseModal(handleClose)}
        <TitleWrapper>
          <Title>Archived contracts</Title>
        </TitleWrapper>
        <AutoSizer width={400}>
          {({ width, height }) => (
            <RVList
              rowRenderer={rowRenderer(deletedContracts)}
              rowHeight={50}
              rowCount={deletedContracts.length}
              height={height || 500} // defaults for tests
              width={width || 500} // defaults for tests
            />
          )}
        </AutoSizer>
      </Body>
    </Modal>
  );
}

export default withClient(ArchiveModal);
