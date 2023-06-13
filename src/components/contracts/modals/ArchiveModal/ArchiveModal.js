import React, { useEffect, useState } from 'react';
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

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        <TitleWrapper>
          <Title>Archived contracts</Title>
        </TitleWrapper>
        {deletedContracts &&
          deletedContracts.map(c => (
            <ArchiveRow key={c.id} contract={c} handleRestore={handleRestore} />
          ))}
      </Body>
    </Modal>
  );
}

export default withClient(ArchiveModal);
