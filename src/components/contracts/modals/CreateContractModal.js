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
  CloseModal
} from './CreateContractModal.styles';

function CreateContractModal(props) {
  const { isActive, save, deploy, close, client } = props;

  const [inputs, setInputs] = useState({
    address: props.address,
    time: '',
    date: '',
    price: '',
    speed: ''
  });

  const handleInputs = e => {
    e.preventDefault();

    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleDeploy = e => {
    e.preventDefault();

    deploy(e, inputs);
  };

  const handleSaveDraft = e => {
    e.preventDefault();
    save(e);
  };

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  if (!isActive) {
    return <></>;
  }

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        <TitleWrapper>
          <Title>Create new contract</Title>
          <Subtitle>Sell your hashpower on the Lumerin Marketplace</Subtitle>
        </TitleWrapper>
        <Form onSubmit={handleDeploy}>
          <Row>
            <InputGroup>
              <Label htmlFor="address">Ethereum Address *</Label>
              <Input
                value={props.address}
                readOnly
                disable={true}
                type="text"
                name="address"
                id="address"
              />
              <Sublabel>
                Funds will be paid into this account once the contract is
                fulfilled.
              </Sublabel>
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="time">Time</Label>
              <Input
                value={inputs.time}
                onChange={handleInputs}
                placeholder="# of hours"
                type="number"
                name="time"
                id="time"
              />
              <Sublabel>Contract Length</Sublabel>
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="speed">Speed</Label>
              <Input
                value={inputs.speed}
                onChange={handleInputs}
                placeholder="Number of TH/s"
                type="number"
                name="speed"
                id="speed"
              />
              <Sublabel>Amount of TH/s Contracted</Sublabel>
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <div>
                <Label htmlFor="price">List Price (LMR) </Label>
              </div>
              <Input
                value={inputs.price}
                onChange={handleInputs}
                placeholder="LMR Charged for Hash Power"
                type="number"
                name="price"
                id="price"
              />
              <Sublabel>
                This is the price you will deploy your contract to the
                marketplace.
              </Sublabel>
            </InputGroup>
          </Row>
          <InputGroup
            style={{
              textAlign: 'center',
              justifyContent: 'space-between',
              height: '60px'
            }}
          >
            <Row style={{ justifyContent: 'center' }}>
              {/* <LeftBtn onClick={handleSaveDraft}>Save as Draft</LeftBtn> */}
              <RightBtn type="submit">Create Contract</RightBtn>
            </Row>
          </InputGroup>
        </Form>
      </Body>
    </Modal>
  );
}

export default withCreateContractModalState(CreateContractModal);
