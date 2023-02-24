import React, { useState } from 'react';
import {
  TitleWrapper,
  Title,
  Form,
  InputGroup,
  Row,
  Input,
  RightBtn,
  ContractLink,
  LeftBtn,
  Sublabel,
  ErrorLabel
} from '../CreateContractModal.styles';

import {
  Divider,
  HeaderFlex,
  SmallTitle,
  UrlContainer,
  Values,
  EditBtn,
  PoolInfoContainer,
  UpperCaseTitle,
  ActionsGroup,
  ContractInfoContainer
} from './common.styles';

import { IconExternalLink } from '@tabler/icons';
import { formatDuration, formatSpeed } from '../../utils';
import { fromTokenBaseUnitsToLMR } from '../../../../utils/coinValue';

export const PurchaseFormModalPage = ({
  inputs,
  setInputs,
  onFinished,
  contract,
  rate,
  pool,
  explorerUrl,
  onEditPool,
  handleSubmit,
  register,
  close,
  formState
}) => {
  const [isEditPool, setIsEditPool] = useState(false);

  const validateAddress = address => {
    if (!address.includes('stratum+tcp://')) return false;
    const credsPart = address.replace('stratum+tcp://', '');
    const regexPortNumber = /:\d+/;
    const portMatch = credsPart.match(regexPortNumber);
    if (!portMatch) return false;

    const port = portMatch[0].replace(':', '');
    if (Number(port) < 0 || Number(port) > 65536) return false;

    return true;
  };

  const handleClose = e => {
    e.preventDefault();
    close();
  };

  const submit = data => {
    onFinished();
  };

  return (
    <>
      <TitleWrapper>
        <Title>Purchase Hashpower</Title>
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
            <SmallTitle>Terms</SmallTitle>
            <Values>
              {formatSpeed(contract.speed)} for{' '}
              {formatDuration(contract.length)}
            </Values>
          </div>
          <div>
            <SmallTitle>Price</SmallTitle>
            <Values>
              {fromTokenBaseUnitsToLMR(contract.price)} LMR (≈ $
              {(fromTokenBaseUnitsToLMR(contract.price) * rate).toFixed(2)} USD)
            </Values>
          </div>
        </ContractInfoContainer>
      </TitleWrapper>
      <Form onSubmit={handleSubmit(submit)}>
        <UrlContainer>
          <UpperCaseTitle>validator address (lumerin node)</UpperCaseTitle>
          <Divider />
          {isEditPool ? (
            <Row key="addressRow">
              <InputGroup key="addressGroup">
                <Input
                  {...register('address', {
                    required: true,
                    validate: validateAddress
                  })}
                  placeholder={'stratum+tcp://IP_ADDRESS:PORT'}
                  type="text"
                  name="address"
                  key="address"
                  id="address"
                />
                {formState?.errors?.address?.type === 'validate' && (
                  <ErrorLabel>
                    Address should match stratum+tcp://IP_ADDRESS:PORT
                  </ErrorLabel>
                )}
              </InputGroup>
            </Row>
          ) : (
            <PoolInfoContainer>
              <Values>{inputs.address}</Values>
              <EditBtn onClick={() => setIsEditPool(true)}>Edit</EditBtn>
            </PoolInfoContainer>
          )}
        </UrlContainer>
        <UrlContainer style={{ marginTop: '50px' }}>
          <UpperCaseTitle>Forwarding to (mining pool)</UpperCaseTitle>
          <Divider />
          <PoolInfoContainer>
            <Values style={{ width: '85%', wordBreak: 'break-all' }}>
              {pool || 'Validation node default pool address'}
            </Values>
            <EditBtn onClick={() => onEditPool()}>Edit</EditBtn>
          </PoolInfoContainer>
        </UrlContainer>
        <Row style={{ marginTop: '10px' }}>
          <InputGroup>
            <SmallTitle>Worker name</SmallTitle>
            <Input
              {...register('worker', { required: true })}
              placeholder="worker"
              disabled={true}
              type="text"
              name="worker"
              key="worker"
              id="worker"
            />
          </InputGroup>
        </Row>
        <ActionsGroup>
          <Row style={{ justifyContent: 'space-between', marginTop: '3rem' }}>
            <LeftBtn onClick={handleClose}>Cancel</LeftBtn>
            <RightBtn type="submit" disabled={!formState?.isValid}>
              Review Order
            </RightBtn>
          </Row>
        </ActionsGroup>
      </Form>
    </>
  );
};
