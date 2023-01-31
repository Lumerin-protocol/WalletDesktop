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
  OrderSummary,
  ProxyRouterContainer,
  Values,
  EditBtn
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
  close
}) => {
  const [isEditPool, setIsEditPool] = useState(false);
  const [errors, setErrors] = useState({
    poolAddress: '',
    username: '',
    password: ''
  });
  const handleInputs = e => {
    e.preventDefault();
    const newInputs = { ...inputs, [e.target.name]: e.target.value };
    const newErrors = {
      username:
        newInputs.username.length > 64
          ? 'Username length should be less that 64'
          : '',
      password:
        newInputs.password.length > 64
          ? 'Password length should be less that 64'
          : ''
    };
    setInputs(newInputs);
    setErrors(newErrors);
  };

  const handleClose = e => {
    e.preventDefault();
    close();
  };

  const submit = () => {
    if (!inputs.username) {
      setErrors({ ...errors, username: 'Username is required' });
      return;
    }
    onFinished();
  };

  return (
    <>
      <TitleWrapper>
        <Title>Purchase Hashpower</Title>
        <HeaderFlex>
          <OrderSummary>ORDER SUMMARY</OrderSummary>
          <ContractLink onClick={() => window.openLink(explorerUrl)}>
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
            <OrderSummary>Terms</OrderSummary>
            <Values>
              {formatSpeed(contract.speed)} for{' '}
              {formatDuration(contract.length)}
            </Values>
          </div>
          <div>
            <OrderSummary>Price</OrderSummary>
            <Values>
              {fromTokenBaseUnitsToLMR(contract.price)} LMR (≈ $
              {(fromTokenBaseUnitsToLMR(contract.price) * rate).toFixed(2)} USD)
            </Values>
          </div>
        </div>
      </TitleWrapper>
      <Form onSubmit={submit}>
        <ProxyRouterContainer style={{ marginTop: '50px' }}>
          <OrderSummary>VALIDATOR ADDRESS (LUMERIN NODE)</OrderSummary>
          <Divider />
          {isEditPool ? (
            <Row key="addressRow">
              <InputGroup key="addressGroup">
                <Input
                  value={inputs.address}
                  onChange={handleInputs}
                  placeholder={'stratum+tcp://IP_ADDRESS:PORT'}
                  type="text"
                  name="address"
                  key="address"
                  id="address"
                />
                {errors.poolAddress && (
                  <ErrorLabel>{errors.poolAddress}</ErrorLabel>
                )}
              </InputGroup>
            </Row>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                width: '100%'
              }}
            >
              <Values>{inputs.address}</Values>
              <EditBtn onClick={() => setIsEditPool(true)}>Edit</EditBtn>
            </div>
          )}
        </ProxyRouterContainer>
        <ProxyRouterContainer style={{ marginTop: '50px' }}>
          <OrderSummary>FORWARDING TO (MINING POOL)</OrderSummary>
          <Divider />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              width: '100%'
            }}
          >
            <Values style={{ width: '85%', wordBreak: 'break-all' }}>
              {pool || 'Validation node default pool address'}
            </Values>
            <EditBtn onClick={() => onEditPool()}>Edit</EditBtn>
          </div>
        </ProxyRouterContainer>
        <Row style={{ marginTop: '10px' }}>
          <InputGroup>
            <OrderSummary>Username *</OrderSummary>
            <Input
              value={inputs.username}
              onChange={handleInputs}
              placeholder="account.worker"
              type="text"
              name="username"
              key="username"
              id="username"
            />
            {errors.username && <ErrorLabel>{errors.username}</ErrorLabel>}
          </InputGroup>
        </Row>
        <Row>
          <InputGroup>
            <OrderSummary>Password</OrderSummary>
            <Input
              value={inputs.password}
              onChange={handleInputs}
              placeholder="optional"
              type="password"
              key="password"
              name="password"
              id="password"
            />
            {errors.password && <ErrorLabel>{errors.password}</ErrorLabel>}
          </InputGroup>
        </Row>
        <InputGroup
          style={{
            textAlign: 'center',
            justifyContent: 'space-between',
            height: '60px',
            marginTop: '50px'
          }}
        >
          <Row style={{ justifyContent: 'space-between' }}>
            <LeftBtn onClick={handleClose}>Cancel</LeftBtn>
            <RightBtn type="submit">Review Order</RightBtn>
          </Row>
        </InputGroup>
      </Form>
    </>
  );
};
