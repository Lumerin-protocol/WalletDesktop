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
import Spinner from '../../../common/Spinner';
import { IconExternalLink } from '@tabler/icons';
import { formatDuration, formatSpeed, formatPrice } from '../../utils';
import PriceIcon from '../../../icons/PriceIcon';
import SpeedIcon from '../../../icons/SpeedIcon';
import DurationIcon from '../../../icons/DurationIcon';
import { fromTokenBaseUnitsToLMR } from '../../../../utils/coinValue';
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

const calculateAddress = (address, contractId) => {
  if (!address || !contractId) return null;
  const noProtocolPart = address.replace('stratum+tcp://', '');
  return `stratum+tcp://${contractId}:@${noProtocolPart}`;
};

export const PurchasePreviewModalPage = ({
  explorerUrl,
  contract,
  pool,
  inputs,
  isPurchasing,
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
            {formatSpeed(contract.speed)}
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
            {fromTokenBaseUnitsToLMR(contract.price) * 1.01} LMR (fees included)
          </Values>
        </div>
      </ContractInfoContainer>
    </TitleWrapper>
    <PreviewCont>
      <UrlContainer>
        <UpperCaseTitle>validator address (lumerin node)</UpperCaseTitle>
        <Divider />
        <PoolInfoContainer>
          <Values style={{ wordBreak: 'break-all' }}>
            {calculateAddress(inputs.address, contract.id)}
          </Values>
        </PoolInfoContainer>
      </UrlContainer>
      <UrlContainer>
        <UpperCaseTitle>forwarding to (mining pool)</UpperCaseTitle>
        <Divider />
        <div style={{ marginTop: '20px' }}>
          <SmallTitle>Pool Address</SmallTitle>
          <Values style={{ wordBreak: 'break-all' }}>{pool}</Values>
        </div>
      </UrlContainer>
      <ActionsGroup>
        {isPurchasing ? (
          <Row style={{ justifyContent: 'center', marginTop: '3rem' }}>
            <Spinner size="16px" />
          </Row>
        ) : (
          <Row style={{ justifyContent: 'space-between', marginTop: '3rem' }}>
            <LeftBtn onClick={onBackToForm}>Edit Order</LeftBtn>
            <RightBtn onClick={onPurchase}>Confirm Purchase</RightBtn>
          </Row>
        )}
      </ActionsGroup>
    </PreviewCont>
  </>
);
