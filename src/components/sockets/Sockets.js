import React, { useState } from 'react';
import withSocketsState from 'lumerin-wallet-ui-logic/src/hocs/withSocketsState';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AddressHeader from '../common/AddressHeader';
import ReceiveDrawer from './ReceiveDrawer';
import TotalsBlock from './TotalsBlock';
import SendDrawer from './SendDrawer';
import { BaseBtn, Btn } from '../common';
import SocketsList from './sockets-list/SocketsList';

const Container = styled.div`
  background-color: ${p => p.theme.colors.light};
  min-height: 100%;
  position: relative;
  padding: 0 2.4rem 2.4rem;

  @media (min-width: 800px) {
  }
`;

const FixedContainer = styled.div`
  position: sticky;
  z-index: 2;
  right: 0;
  left: 0;
  top: 0;
`;

const Title = styled.div`
  font-size: 2.4rem;
  line-height: 3rem;
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark}
  margin-bottom: 4.8px;
  margin-right: 2.4rem;
  cursor: default;

  @media (min-width: 1140px) {
    margin-right: 0.8rem;
  }

  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

const Subtitle = styled.div`
  font-size: 1.4rem;
  align-self: end;
  line-height: 2rem;
  white-space: nowrap;
  margin: 0 1.2rem;
  display: inline;
  font-weight: 400;
  color: ${p => p.theme.colors.primary}
  cursor: default;

  @media (min-width: 1140px) {
    margin-right: 0.8rem;
  }

  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

// const Title = styled.h1`
//   font-size: 2.4rem;
//   line-height: 3rem;
//   color: ${p => p.theme.colors.darker}
//   white-space: nowrap;
//   margin: 0;
//   cursor: default;
// `

function Sockets(props) {
  const [activeModal, setActiveModal] = useState('');
  const ipAddress = '127.0.0.1';
  const port = '3000';
  // static propTypes = {
  //   sendDisabledReason: PropTypes.string,
  //   hasSockets: PropTypes.bool.isRequired,
  //   copyToClipboard: PropTypes.func.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   sendDisabled: PropTypes.bool.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   address: PropTypes.string.isRequired
  // };

  const onOpenModal = e => setActiveModal(e.target.dataset.modal);

  const onCloseModal = () => setActiveModal(null);

  return (
    <Container data-testid="sockets-container">
      <FixedContainer>
        <AddressHeader
          copyToClipboard={props.copyToClipboard}
          address={props.address}
        />
      </FixedContainer>

      <Title>
        My Connections
        <Subtitle>
          {ipAddress} : {port}
        </Subtitle>
      </Title>
      <TotalsBlock />

      <SocketsList
        hasSockets={props.hasSockets}
        onWalletRefresh={props.onWalletRefresh}
        syncStatus={props.syncStatus}
      />

      <ReceiveDrawer
        onRequestClose={onCloseModal}
        isOpen={activeModal === 'receive'}
      />
      <SendDrawer
        onRequestClose={onCloseModal}
        isOpen={activeModal === 'send'}
      />
    </Container>
  );
}

export default withSocketsState(Sockets);
