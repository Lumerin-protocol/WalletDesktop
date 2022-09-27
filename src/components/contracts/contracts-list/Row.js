import React from 'react';
import styled from 'styled-components';
import withContractsRowState from '@lumerin/wallet-ui-logic/src/hocs/withContractsRowState';

import { ClockIcon } from '../../icons/ClockIcon';
import { Btn } from '../../common';
import { CLOSEOUT_TYPE, CONTRACT_STATE } from '../../../enums';

const Container = styled.div`
  padding: 1.2rem 0;
  display: grid;
  grid-template-columns: 1fr 40px 1fr 1fr 1fr 2fr;
  text-align: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Value = styled.label`
  display: flex;
  padding: 0 3rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 1.2rem;
`;

const SmallAssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CancelButtons = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const CancelButton = styled(Btn)`
  font-size: 1.3rem;
  padding: 1rem;
  line-height: 1.5rem;
`;

const STATE_COLOR = {
  [CONTRACT_STATE.Running]: '#8C2AF5',
  [CONTRACT_STATE.Avaliable]: 'black'
};

function Row({ contract, cancel, address }) {
  // TODO: Add better padding

  const handleCancel = closeOutType => e => {
    e.preventDefault();
    cancel(e, {
      contractId: contract.id,
      walletAddress: contract.seller,
      closeOutType
    });
  };

  const isCancelBtnDisabled = () => {
    return (
      contract.state !== CONTRACT_STATE.Avaliable || contract.balance !== '0'
    );
  };

  const isClaimAndCloseBtnDisabled = () => {
    return (
      contract.state !== CONTRACT_STATE.Avaliable || contract.balance === '0'
    );
  };

  const isContractClosed = () => {
    return contract.seller === contract.buyer;
  };

  const getClockColor = () => {
    const CLOSED_COLOR = '#984803';
    if (isContractClosed()) {
      return CLOSED_COLOR;
    }

    return STATE_COLOR[contract.state];
  };

  return (
    <Container>
      <Value>{contract.timestamp}</Value>
      <SmallAssetContainer>
        <ClockIcon size="3rem" fill={getClockColor()} />
      </SmallAssetContainer>
      <Value>{contract.price}</Value>
      <Value>{contract.length}</Value>
      <Value>{contract.speed}</Value>
      {contract.seller === address && !isContractClosed() && (
        <CancelButtons>
          <CancelButton
            disabled={isCancelBtnDisabled()}
            onClick={handleCancel(CLOSEOUT_TYPE.Close)}
          >
            Close
          </CancelButton>
          <CancelButton
            disabled={isClaimAndCloseBtnDisabled()}
            onClick={handleCancel(CLOSEOUT_TYPE.ClaimAndClose)}
          >
            Claim Funds
          </CancelButton>
        </CancelButtons>
      )}
    </Container>
  );
}

export default withContractsRowState(Row);
