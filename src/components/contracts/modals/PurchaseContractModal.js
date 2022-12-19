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
  Select
} from './CreateContractModal.styles';

function PurchaseContractModal(props) {
  const { isActive, handlePurchase, close, contract, explorerUrl } = props;

  const preferredPools = [
    {
      name: 'Titan',
      address: 'stratum+tcp://mining.pool.titan.io',
      port: '4242'
    },
    { name: 'Lincoin', address: 'stratum+tcp://ca.lincoin.com', port: '3333' },
    {
      name: 'Luxor',
      address: 'stratum+tcp://btc.global.luxor.tech',
      port: '700'
    },
    {
      name: 'Braiins',
      address: 'stratum+tcp://stratum.braiins.com',
      port: '3333'
    }
  ];

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

  const onSelectChange = value => {
    if (!value) {
      return;
    }
    const item = preferredPools.find(x => x.name === value);

    setInputs({ ...inputs, address: item.address, port: item.port });
  };

  if (!isActive) {
    return <></>;
  }

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        <TitleWrapper>
          <Title>Purchase Hashpower</Title>
          <Subtitle>
            Enter the Pool Address, Port Number, and Username you are pointing
            the purchased hashpower to.
          </Subtitle>
          <ContractLink href={explorerUrl} target="_blank" rel="noreferrer">
            Contract Address: {contract.id}
          </ContractLink>
        </TitleWrapper>
        <Form
          onSubmit={() => handlePurchase(inputs, contract, toRfc2396(inputs))}
        >
          <Row>
            <InputGroup>
              <Label htmlFor="address">Preferred Pools</Label>
              <Select onChange={e => onSelectChange(e.target.value)}>
                <option value="" hidden>
                  Select a prefered poll
                </option>
                {preferredPools.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </InputGroup>
          </Row>

          <Row>
            <InputGroup>
              <Label htmlFor="address">Pool Address *</Label>
              <Input
                placeholder={'stratum+tcp://IPADDRESS'}
                value={inputs.address}
                onChange={handleInputs}
                type="text"
                name="address"
                id="address"
              />
              <Sublabel>
                Mining device address. The port number should be inputted in the
                port number field.
              </Sublabel>
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="time">Port Number*</Label>
              <Input
                placeholder={'4242'}
                value={inputs.port}
                onChange={handleInputs}
                type="number"
                name="port"
                id="port"
              />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="speed">Username</Label>
              <Input
                value={inputs.username}
                onChange={handleInputs}
                placeholder="account.workerName"
                type="text"
                name="username"
                id="username"
              />
              <Sublabel>
                Note: workerName is optional — it is fine if you do not provide
                any.
              </Sublabel>
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
                placeholder="password"
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
              height: '60px'
            }}
          >
            <Row style={{ justifyContent: 'space-around' }}>
              <LeftBtn onClick={handleClose}>Close</LeftBtn>
              <RightBtn type="submit">Purchase</RightBtn>
            </Row>
          </InputGroup>
        </Form>
      </Body>
    </Modal>
  );
}

export default withCreateContractModalState(PurchaseContractModal);
