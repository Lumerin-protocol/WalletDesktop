import React from 'react';
import {
  TitleWrapper,
  Title,
  InputGroup,
  Row,
  RightBtn,
  ContractLink,
  LeftBtn
} from '../CreateContractModal.styles';
import { IconExternalLink } from '@tabler/icons';
import { formatDuration, formatSpeed, formatPrice } from '../../utils';
import PriceIcon from '../../../icons/PriceIcon';
import SpeedIcon from '../../../icons/SpeedIcon';
import DurationIcon from '../../../icons/DurationIcon';

import {
  Divider,
  HeaderFlex,
  SmallTitle,
  UrlContainer,
  Values,
  PreviewCont,
  PoolInfoContainer,
  UpperCaseTitle,
  ActionsGroup,
  ContractInfoContainer
} from './common.styles';

export const PurchasePreviewModalPage = ({
  explorerUrl,
  contract,
  pool,
  inputs,
  onBackToForm,
  onPurchase
}) => (
  <>
    <TitleWrapper>
      <Title>Review Purchase</Title>
      <HeaderFlex>
        <UpperCaseTitle>Order summary</UpperCaseTitle>
        <ContractLink onClick={() => window.openLink(explorerUrl)}>
          <span style={{ marginRight: '4px' }}>View contract</span>
          <IconExternalLink width={'1.4rem'} />
        </ContractLink>
      </HeaderFlex>
      <Divider />
      <ContractInfoContainer>
        <div>
          <SmallTitle>Speed</SmallTitle>
          <Values>
            <SpeedIcon
              key={'speed'}
              style={{ marginRight: '4px', height: '1.4rem' }}
            />
            {formatSpeed(contract.speed)} TH/s
          </Values>
        </div>
        <div>
          <SmallTitle>Duration</SmallTitle>
          <Values>
            <DurationIcon
              key={'duration'}
              style={{ marginRight: '4px', height: '1.4rem' }}
            />
            {formatDuration(contract.length)}
          </Values>
        </div>
        <div>
          <SmallTitle>Price</SmallTitle>
          <Values>
            <PriceIcon
              key={'price'}
              style={{ marginRight: '4px', height: '1.4rem' }}
            />
            {formatPrice(contract.price)}
          </Values>
        </div>
      </ContractInfoContainer>
    </TitleWrapper>
    <PreviewCont onSubmit={() => {}}>
      <UrlContainer>
        <UpperCaseTitle>validator address (lumerin node)</UpperCaseTitle>
        <Divider />
        <PoolInfoContainer>
          <Values>{inputs.address}</Values>
        </PoolInfoContainer>
      </UrlContainer>
      <UrlContainer>
        <UpperCaseTitle>forwarding to (mining pool)</UpperCaseTitle>
        <Divider />
        <div style={{ marginTop: '20px' }}>
          <SmallTitle>Pool Address</SmallTitle>
          <Values style={{ wordBreak: 'break-all' }}>{pool}</Values>
        </div>
        <div style={{ marginTop: '10px' }}>
          <SmallTitle>Username</SmallTitle>
          <Values>{inputs.username}</Values>
        </div>
        <div style={{ marginTop: '10px' }}>
          <SmallTitle>Password</SmallTitle>
          <Values>
            {inputs.password.split('').reduce((acc, _) => acc + '*', '')}
          </Values>
        </div>
      </UrlContainer>
      <ActionsGroup>
        <Row style={{ justifyContent: 'space-between' }}>
          <LeftBtn onClick={onBackToForm}>Edit Order</LeftBtn>
          <RightBtn onClick={onPurchase}>Confirm Purchase</RightBtn>
        </Row>
      </ActionsGroup>
    </PreviewCont>
  </>
);
