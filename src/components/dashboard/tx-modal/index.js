import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';
import { SendForm } from './SendForm';
import { ReceiveForm } from './ReceiveForm';
import { ConfirmForm } from './ConfirmForm';
import { SuccessForm } from './SuccessForm';

import withTransactionModalState from 'lumerin-wallet-ui-logic/src/hocs/withTransactionModalState';
import QRCode from 'qrcode.react';

import CopyIcon from '../../icons/CopyIcon';
import { BaseBtn } from '../../common';
import { abbreviateAddress } from '../../../utils';

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  z-index: 20;
  background-color: ${p => p.theme.colors.light}
  width: 300px;
  height: 500px;
  border-radius: 5px;
  padding: 2rem 3rem 2rem 3rem;

  @media (min-height: 700px) {
    padding: 6.4rem 1.6rem;
  }
`;

function TransactionModal(props) {
  const context = useContext(ToastsContext);
  const [amount, setAmount] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');

  const handlePropagation = e => e.stopPropagation();

  if (!props.activeTab) {
    return <></>;
  }

  const ConfirmationBody = () => <></>;

  return (
    <Modal onClick={props.onRequestClose}>
      <Body onClick={handlePropagation}>
        {props.activeTab === 'send' && (
          <SendForm
            destinationAddress={destinationAddress}
            onDestinationAddressInput={setDestinationAddress}
            amountInput={amount}
            onAmountInput={setAmount}
            lmrBalanceUSD={props.lmrBalanceUSD}
            {...props}
          />
        )}
        {props.activeTab === 'receive' && <ReceiveForm {...props} />}
        {props.activeTab === 'confirm' && <ConfirmForm {...props} />}
        {props.activeTab === 'success' && <SuccessForm {...props} />}
      </Body>
    </Modal>
  );
}

export default withTransactionModalState(TransactionModal);
