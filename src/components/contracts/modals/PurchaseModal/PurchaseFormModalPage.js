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
  LeftBtn
} from '../CreateContractModal.styles';

import {
  Divider,
  HeaderFlex,
  OrderSummary,
  ProxyRouterContainer,
  Values,
  PreviewCont,
  EditBtn
} from './common.styles';

import { IconExternalLink } from '@tabler/icons';
import { formatDuration, formatSpeed, formatPrice } from '../../utils';

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
  const handleInputs = e => {
    e.preventDefault();

    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleClose = e => {
    e.preventDefault();
    close();
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
              {formatSpeed(contract.speed)} TH/s for{' '}
              {formatDuration(contract.length)}
            </Values>
          </div>
          <div>
            <OrderSummary>Price</OrderSummary>
            <Values>
              {formatPrice(contract.price)} LMR (~ $
              {(formatPrice(contract.price) * rate).toFixed(2)} USD)
            </Values>
          </div>
        </div>
      </TitleWrapper>
      <Form onSubmit={() => onFinished()}>
        <ProxyRouterContainer style={{ marginTop: '50px' }}>
          <OrderSummary>VALIDATOR ADDRESS (LUMERIN NODE)</OrderSummary>
          <Divider />
          {isEditPool ? (
            <Row key="addressRow">
              <InputGroup key="addressGroup">
                <Input
                  value={inputs.address}
                  onChange={handleInputs}
                  placeholder={'stratum+tcp://IPADDRESS'}
                  type="text"
                  name="address"
                  key="address"
                  id="address"
                />
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
              {pool}
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
