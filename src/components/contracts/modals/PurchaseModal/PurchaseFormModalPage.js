//@ts-check
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
  ErrorLabel,
  ApplyBtn,
  Select
} from '../CreateContractModal.styles';
import { fromTokenBaseUnitsToETH } from '../../../../utils/coinValue';

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
  ContractInfoContainer,
  UseValidatorContainer
} from './common.styles';

import { IconExternalLink, IconQuestionCircle } from '@tabler/icons';
import { formatDuration, formatSpeed } from '../../utils';
import { fromTokenBaseUnitsToLMR } from '../../../../utils/coinValue';

const validateAddress = address => {
  const regexP = /^[a-zA-Z0-9.-]+:\d+$/;
  if (!regexP.test(address)) return false;

  const regexPortNumber = /:\d+/;
  const portMatch = address.match(regexPortNumber);
  if (!portMatch) return false;

  const port = portMatch[0].replace(':', '');
  if (Number(port) < 0 || Number(port) > 65536) return false;

  return true;
};

const validateUsername = username => {
  // Username should not be empty
  if (!username || username.trim() === '') return false;

  // Check length (reasonable limits for URL)
  if (username.length < 1 || username.length > 64) return false;

  // Allow alphanumeric, dash, underscore, and dot
  // This regex ensures URL-safe characters
  const regexP = /^[a-zA-Z0-9._-]+$/;
  return regexP.test(username);
};

export const PurchaseFormModalPage = ({
  inputs,
  onFinished,
  contract,
  rate,
  explorerUrl,
  handleSubmit,
  register,
  close,
  formState,
  symbol,
  marketplaceFee,
  history,
  validators,
  watch
}) => {
  const [isEditPool, setIsEditPool] = useState(false);

  const handleClose = e => {
    e.preventDefault();
    close();
  };

  const submit = data => {
    onFinished();
  };

  const renderOwnValidatorForm = () => {
    return (
      <>
        <SmallTitle>Address</SmallTitle>
        {isEditPool ? (
          <Row key="addressRow">
            <InputGroup key="addressGroup" style={{ margin: 0 }}>
              <Input
                {...register('address', {
                  required: false,
                  validate: validateAddress
                })}
                placeholder={'HOST_IP:PORT'}
                type="text"
                name="address"
                key="address"
                id="address"
              />
              {formState?.errors?.address?.type === 'validate' && (
                <ErrorLabel>
                  Validator address must be in format HOST:PORT (e.g.
                  validator.example.com:3333)
                </ErrorLabel>
              )}
            </InputGroup>
          </Row>
        ) : (
          <PoolInfoContainer
            style={{
              marginTop: '0px',
              padding: '5px 0',
              height: '42px',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Values style={{ alignItems: 'flex-start' }}>
              {inputs.address}
            </Values>
            <EditBtn
              style={{ alignItems: 'flex-start' }}
              onClick={() => setIsEditPool(true)}
            >
              Edit
            </EditBtn>
          </PoolInfoContainer>
        )}
      </>
    );
  };

  const renderPublicValidatorForm = () => {
    const rangeSelectOptions = validators.map(x => ({
      label: x.host,
      value: x.addr
    }));

    return (
      <>
        <SmallTitle>Validator Address</SmallTitle>
        <Row key="addressRow">
          <InputGroup key="addressGroup" style={{ margin: 0 }}>
            <Select
              {...register('publicValidator', {
                required: true
              })}
              style={{ color: 'black' }}
            >
              {rangeSelectOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </InputGroup>
        </Row>
      </>
    );
  };

  const renderMiningPoolForm = () => {
    return (
      <UrlContainer style={{ marginTop: '20px' }}>
        <UpperCaseTitle>Forwarding to (mining pool)</UpperCaseTitle>
        <Divider />
        <PoolInfoContainer>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <SmallTitle>Pool Address</SmallTitle>
            <Row key="poolAddressRow">
              <InputGroup style={{ margin: 0 }}>
                <Input
                  {...register('pool', {
                    required: true,
                    validate: validateAddress
                  })}
                  placeholder={'HOST:PORT'}
                  type="text"
                  name="pool"
                  key="pool"
                  id="pool"
                />
                {formState?.errors?.pool?.type === 'validate' && (
                  <ErrorLabel>
                    Pool address must be in format HOST:PORT (e.g.
                    pool.example.com:3333)
                  </ErrorLabel>
                )}
              </InputGroup>
            </Row>
            <br />
            <SmallTitle>Account</SmallTitle>
            <Row key="addressRow">
              <InputGroup style={{ margin: 0 }}>
                <Input
                  {...register('username', {
                    required: true,
                    validate: validateUsername
                  })}
                  type="text"
                  name="username"
                  key="username"
                  id="username"
                />
                {formState?.errors?.username?.type === 'validate' && (
                  <ErrorLabel>
                    Only letters, numbers, underscores (_) and dots (.) are
                    allowed
                  </ErrorLabel>
                )}
              </InputGroup>
            </Row>
          </div>
        </PoolInfoContainer>
      </UrlContainer>
    );
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
              {fromTokenBaseUnitsToLMR(contract.price)} {symbol} (≈ $
              {(fromTokenBaseUnitsToLMR(contract.price) * rate).toFixed(2)} USD)
            </Values>
            <SmallTitle>
              + {fromTokenBaseUnitsToETH(marketplaceFee)} ETH fee
              <IconQuestionCircle
                data-rh={`All proceeds are subject to a non-refundable ${fromTokenBaseUnitsToETH(
                  marketplaceFee
                )} ETH marketplace fee`}
                width={'1.7rem'}
                style={{ padding: '0 0 1px 4px' }}
              />
            </SmallTitle>
          </div>
        </ContractInfoContainer>
      </TitleWrapper>
      <UrlContainer style={{ marginTop: '10px' }}>
        <SmallTitle>Worker Name</SmallTitle>
        <Values
          key={contract?.id}
          style={{ width: '85%', wordBreak: 'break-all' }}
        >
          {contract?.id}
        </Values>
      </UrlContainer>
      <Form onSubmit={handleSubmit(submit)}>
        <UrlContainer>
          <UpperCaseTitle>validator address (lumerin node)</UpperCaseTitle>
          <Divider />
          <UseValidatorContainer>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="usePublicValidator"
                type="checkbox"
                style={{ marginLeft: 0 }}
                {...register('usePublicValidator')}
              />
              <label
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                htmlFor="usePublicValidator"
              >
                Use Public Validator
              </label>
            </div>
            <ApplyBtn
              data-rh={'Become Public Validator'}
              style={{ padding: '10px 10px', flex: 1 }}
              onClick={() => history.push('/validators')}
            >
              Become a Validator
            </ApplyBtn>
          </UseValidatorContainer>
          {watch('usePublicValidator')
            ? renderPublicValidatorForm()
            : renderOwnValidatorForm()}
        </UrlContainer>

        {renderMiningPoolForm()}

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
