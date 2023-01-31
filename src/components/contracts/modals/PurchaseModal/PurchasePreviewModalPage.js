import React, { useEffect, useState } from 'react';
import withCreateContractModalState from '../../../../store/hocs/withCreateContractModalState';
import {
  Modal,
  Body,
  TitleWrapper,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Row,
  Input,
  Label,
  Sublabel,
  RightBtn,
  ContractLink,
  LeftBtn,
  Select,
  CloseModal
} from '../CreateContractModal.styles';
import { IconExternalLink } from '@tabler/icons';
import { formatDuration, formatSpeed, formatPrice } from '../../utils';
import PriceIcon from '../../../icons/PriceIcon';
import SpeedIcon from '../../../icons/SpeedIcon';
import DurationIcon from '../../../icons/DurationIcon';

import {
  Divider,
  HeaderFlex,
  OrderSummary,
  ProxyRouterContainer,
  Values,
  PreviewCont,
  EditBtn
} from './common.styles';

export const PurchasePreviewModalPage = props => (
  <>
    <TitleWrapper>
      <Title>Review Purchase</Title>
      <HeaderFlex>
        <OrderSummary>ORDER SUMMARY</OrderSummary>
        <ContractLink onClick={() => window.openLink(props.explorerUrl)}>
          <span style={{ marginRight: '4px' }}>View contract</span>
          <IconExternalLink width={'1.4rem'} />
        </ContractLink>
      </HeaderFlex>
      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px'
        }}
      >
        <div>
          <OrderSummary>Speed</OrderSummary>
          <Values>
            <SpeedIcon
              key={'speed'}
              style={{ marginRight: '4px', height: '1.4rem' }}
            />
            {formatSpeed(props.contract.speed)} TH/s
          </Values>
        </div>
        <div>
          <OrderSummary>Duration</OrderSummary>
          <Values>
            <DurationIcon
              key={'duration'}
              style={{ marginRight: '4px', height: '1.4rem' }}
            />
            {formatDuration(props.contract.length)}
          </Values>
        </div>
        <div>
          <OrderSummary>Price</OrderSummary>
          <Values>
            <PriceIcon
              key={'price'}
              style={{ marginRight: '4px', height: '1.4rem' }}
            />
            {formatPrice(props.contract.price)}
          </Values>
        </div>
      </div>
    </TitleWrapper>
    <PreviewCont onSubmit={() => {}}>
      <ProxyRouterContainer style={{ marginTop: '50px' }}>
        <OrderSummary>VALIDATOR ADDRESS (LUMERIN NODE)</OrderSummary>
        <Divider />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            width: '100%'
          }}
        >
          <Values>{props.inputs.address}</Values>
        </div>
      </ProxyRouterContainer>
      <ProxyRouterContainer style={{ marginTop: '50px' }}>
        <OrderSummary>FORWARDING TO (MINING POOL)</OrderSummary>
        <Divider />
        <div style={{ marginTop: '20px' }}>
          <OrderSummary>Pool Address</OrderSummary>
          <Values style={{ wordBreak: 'break-all' }}>{props.pool}</Values>
        </div>
        <div style={{ marginTop: '10px' }}>
          <OrderSummary>Username</OrderSummary>
          <Values>{props.inputs.username}</Values>
        </div>
        <div style={{ marginTop: '10px' }}>
          <OrderSummary>Password</OrderSummary>
          <Values>
            {props.inputs.password.split('').reduce((acc, _) => acc + '*', '')}
          </Values>
        </div>
      </ProxyRouterContainer>
      <InputGroup
        style={{
          textAlign: 'center',
          justifyContent: 'space-between',
          height: '60px',
          marginTop: '50px'
        }}
      >
        <Row style={{ justifyContent: 'space-between' }}>
          <LeftBtn onClick={() => props.onBackToForm()}>Edit Order</LeftBtn>
          <RightBtn onClick={() => props.onPurchase()}>
            Confirm Purchase
          </RightBtn>
        </Row>
      </InputGroup>
    </PreviewCont>
  </>
);
