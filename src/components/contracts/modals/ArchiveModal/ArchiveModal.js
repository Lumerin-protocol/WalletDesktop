import React, { useEffect, useState } from 'react';
import withCreateContractModalState from '../../../../store/hocs/withCreateContractModalState';
import { withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Modal,
  Body,
  TitleWrapper,
  Title,
  Subtitle,
  CloseModal
} from '../CreateContractModal.styles';
import { toRfc2396 } from '../../../../utils';
import ArchiveRow from './ArchiveRow';

function ArchiveModal(props) {
  const { isActive, close, deletedContracts } = props;

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  if (!isActive) {
    return <></>;
  }

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        <TitleWrapper>
          <Title>Archived contracts</Title>
          {!deletedContracts && (
            <Subtitle>Your archived contracts list is empty</Subtitle>
          )}
        </TitleWrapper>
        {deletedContracts &&
          deletedContracts.map(c => <ArchiveRow contract={c} />)}
      </Body>
    </Modal>
  );
}

export default withRouter(withCreateContractModalState(ArchiveModal));
