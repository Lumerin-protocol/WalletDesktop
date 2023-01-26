import React, { useState } from 'react';
import withCreateContractModalState from '../../../store/hocs/withCreateContractModalState';
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
} from './CreateContractModal.styles';
import styled from 'styled-components';
import { IconExternalLink } from '@tabler/icons';

function PurchaseContractModal(props) {
  const { isActive, handlePurchase, close, contract, explorerUrl } = props;

  const [isPreview, setIsPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isEditPool, setIsEditPool] = useState(false);

  const handlePreview = data => {
    setPreviewData(data);
    console.log(data);
    setIsPreview(true);
    // handlePurchase
  };

  const toRfc2396 = formData => {
    const regex = /(^.*):\/\/(.*$)/;
    const poolAddressGroups = formData.address?.match(regex);
    if (!poolAddressGroups) return;
    const protocol = poolAddressGroups[1];
    const host = poolAddressGroups[2];

    return `${protocol}://${formData.username}:${formData.password}@${host}:${formData.port}`;
  };

  const [inputs, setInputs] = useState({
    address: '',
    port: '',
    username: '',
    password: ''
  });

  const handleInputs = e => {
    e.preventDefault();

    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  // const onSelectChange = value => {
  //   if (!value) {
  //     return;
  //   }
  //   const item = preferredPools.find(x => x.name === value);

  //   setInputs({ ...inputs, address: item.address, port: item.port });
  // };

  if (!isActive) {
    return <></>;
  }

  const Divider = styled.div`
    margin-top: 5px
    width:100%;
    height: 0px;
    border: 0.5px solid rgba(0, 0, 0, 0.25);`;

  const HeaderFlex = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const OrderSummary = styled(Label)`
    display: flex;
    align-items: center;
    font-size: 1rem !important;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  `;
  const ProxyRouterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
  `;

  const Values = styled.div`
    line-height: 1.4rem;
    font-size: 1.4rem;
    font-weight: 100;
    cursor: none;
    display: flex;
    align-items: center;
  `;

  const EditBtn = styled.div`
    cursor: pointer;
    color: #014353;
    text-decoration: underline;
    font-size: 1rem;
    letter-spacing: 1px;
  `;

  const FormModal = (
    <>
      <TitleWrapper>
        <Title>Purchase Hashpower</Title>
        <HeaderFlex>
          <OrderSummary>ORDER SUMMARY</OrderSummary>
          <ContractLink>
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
            <Values>100 TH/s for 24 hours</Values>
          </div>
          <div>
            <OrderSummary>Price</OrderSummary>
            <Values>240 LMR (~ $2.52 USD)</Values>
          </div>
        </div>
      </TitleWrapper>
      <Form onSubmit={() => handlePreview(inputs, contract, toRfc2396(inputs))}>
        <ProxyRouterContainer style={{ marginTop: '50px' }}>
          <OrderSummary>VALIDATOR ADDRESS (LUMERIN NODE)</OrderSummary>
          <Divider />
          {isEditPool ? (
            <Row>
              <InputGroup>
                <Input
                  value={inputs.address}
                  onChange={handleInputs}
                  placeholder={'stratum+tcp://IPADDRESS'}
                  type="text"
                  name="address"
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
              <Values>stratum://195.2.3.21:4242</Values>
              <EditBtn onClick={() => setIsEditPool(true)}>Edit</EditBtn>
            </div>
          )}
        </ProxyRouterContainer>
        <ProxyRouterContainer style={{ marginTop: '30px' }}>
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
            <Values>stratum://pool1.titan.io:3333</Values>
          </div>
        </ProxyRouterContainer>
        <Row style={{ marginTop: '30px' }}>
          <InputGroup>
            <Label htmlFor="speed">Username *</Label>
            <Input
              value={inputs.username}
              onChange={handleInputs}
              placeholder="account.worker"
              type="text"
              name="username"
              id="username"
            />
          </InputGroup>
        </Row>
        <Row>
          <InputGroup>
            <div>
              <Label htmlFor="price">Password</Label>
            </div>
            <Input
              value={inputs.password}
              onChange={handleInputs}
              placeholder="optional"
              type="password"
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
            marginTop: '3rem'
          }}
        >
          <Row style={{ justifyContent: 'space-around' }}>
            <LeftBtn onClick={handleClose}>Cancel</LeftBtn>
            <RightBtn type="submit">Review Order</RightBtn>
          </Row>
        </InputGroup>
      </Form>
    </>
  );

  const PreviewModal = <div>TEMPO</div>;

  const MainModal = content => (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        {content}
      </Body>
    </Modal>
  );

  return MainModal(isPreview ? PreviewModal : FormModal);
}

export default withCreateContractModalState(PurchaseContractModal);
