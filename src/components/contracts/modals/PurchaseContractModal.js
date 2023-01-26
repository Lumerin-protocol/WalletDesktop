import React, { useEffect, useState } from 'react';
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
import { formatDuration, formatSpeed, formatPrice } from '../utils';

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

const PreviewCont = styled.div`
  display: flex;
  height: 85%;
  margin: 1rem 0 0;
  flex-direction: column;
  justify-content: space-between;
`;

const FormModal = ({ inputs, setInputs, onFinished, contract, rate, pool }) => {
  const [isEditPool, setIsEditPool] = useState(false);

  const handleInputs = e => {
    e.preventDefault();

    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleClose = e => {};

  return (
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
            <Values style={{ height: '20px', overflow: 'hidden' }}>
              {pool}
            </Values>
          </div>
        </ProxyRouterContainer>
        <Row style={{ marginTop: '10px' }}>
          <InputGroup>
            <Label htmlFor="speed">Username *</Label>
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
            <div>
              <Label htmlFor="price">Password</Label>
            </div>
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

const PreviewModal = props => (
  <>
    <TitleWrapper>
      <Title>Review Purchase</Title>
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
          <OrderSummary>Speed</OrderSummary>
          <Values>100 TH/s</Values>
        </div>
        <div>
          <OrderSummary>Duration</OrderSummary>
          <Values>24 hours</Values>
        </div>
        <div>
          <OrderSummary>Price</OrderSummary>
          <Values>240 LMR</Values>
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
      <ProxyRouterContainer style={{ marginTop: '30px' }}>
        <OrderSummary>FORWARDING TO (MINING POOL)</OrderSummary>
        <Divider />
        <div style={{ marginTop: '20px' }}>
          <OrderSummary>Pool Address</OrderSummary>
          <Values>stratum://pool1.titan.io:3333</Values>
        </div>
        <div style={{ marginTop: '10px' }}>
          <OrderSummary>Username</OrderSummary>
          <Values>rcondron</Values>
        </div>
        <div style={{ marginTop: '10px' }}>
          <OrderSummary>Password</OrderSummary>
          <Values>**************</Values>
        </div>
      </ProxyRouterContainer>
      <InputGroup
        style={{
          textAlign: 'center',
          justifyContent: 'space-between',
          height: '60px',
          marginTop: '3rem'
        }}
      >
        <Row style={{ justifyContent: 'space-around' }}>
          <LeftBtn onClick={() => props.setIsPreview(false)}>
            Edit Order
          </LeftBtn>
          <RightBtn type="submit">Confirm Purchase</RightBtn>
        </Row>
      </InputGroup>
    </PreviewCont>
  </>
);

function PurchaseContractModal(props) {
  const {
    isActive,
    handlePurchase,
    close,
    contract,
    explorerUrl,
    lmrRate
  } = props;

  const [isPreview, setIsPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);
  const [pool, setPool] = useState(null);

  useEffect(() => {
    props.getLocalIp({}).then(ip => {
      setIpAddress(ip);
      setInputs({ ...inputs, address: `stratum+tcp://${ip}:3334` });
    });
    props.getPoolAddress({}).then(pool => {
      setPool(pool);
    });
  }, []);

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

    return `${protocol}://${formData.username}:${formData.password}@${host}`;
  };

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  const [inputs, setInputs] = useState({
    address: '',
    username: '',
    password: ''
  });

  if (!isActive) {
    return <></>;
  }

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        {isPreview ? (
          <PreviewModal inputs={inputs} />
        ) : (
          <FormModal
            rate={lmrRate}
            pool={pool}
            inputs={inputs}
            contract={contract}
            setInputs={setInputs}
            onFinished={() => setIsPreview(true)}
          />
        )}
      </Body>
    </Modal>
  );
}

export default withCreateContractModalState(PurchaseContractModal);
