import React, { useState, useEffect } from 'react';
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
  CloseModal,
  ErrorLabel
} from './CreateContractModal.styles';
import { useForm } from 'react-hook-form';
import { CreateContractPreview } from './CreateContractPreview';

function CreateContractModal(props) {
  const { isActive, save, deploy, close, client, address } = props;

  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    getValues,
    reset,
    trigger
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    setValue('address', address);
  }, [address]);

  const handleDeploy = e => {
    e.preventDefault();
    deploy(e, getValues());
  };

  const handleClose = e => {
    setIsPreview(false);
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
        {isPreview ? (
          <CreateContractPreview
            data={getValues()}
            close={() => setIsPreview(false)}
            submit={handleDeploy}
          />
        ) : (
          <>
            <TitleWrapper>
              <Title>Create new contract</Title>
              <Subtitle>
                Sell your hashpower on the Lumerin Marketplace
              </Subtitle>
            </TitleWrapper>
            <Form onSubmit={() => setIsPreview(true)}>
              <Row>
                <InputGroup>
                  <Label htmlFor="address">Ethereum Address *</Label>
                  <Input
                    {...register('address', {
                      required: true,
                      validate: address => {
                        /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
                      }
                    })}
                    readOnly
                    disable={true}
                    style={{ cursor: 'default' }}
                    type="text"
                    name="address"
                    id="address"
                  />
                  <Sublabel>
                    Funds will be paid into this account once the contract is
                    fulfilled.
                  </Sublabel>
                  {formState?.errors?.address?.type === 'validate' && (
                    <ErrorLabel>Invalid address</ErrorLabel>
                  )}
                </InputGroup>
              </Row>
              <Row>
                <InputGroup>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    {...register('time', {
                      required: true,
                      min: 1
                    })}
                    placeholder="# of hours"
                    type="number"
                    name="time"
                    id="time"
                    min={1}
                  />
                  <Sublabel>Contract Length</Sublabel>
                  {formState?.errors?.time?.type === 'required' && (
                    <ErrorLabel>Time is required</ErrorLabel>
                  )}
                </InputGroup>
              </Row>
              <Row>
                <InputGroup>
                  <Label htmlFor="speed">Speed *</Label>
                  <Input
                    {...register('speed', {
                      required: true,
                      min: 1
                    })}
                    placeholder="Number of TH/s"
                    type="number"
                    name="speed"
                    id="speed"
                    min={1}
                  />
                  <Sublabel>Amount of TH/s Contracted</Sublabel>
                  {formState?.errors?.speed?.type === 'required' && (
                    <ErrorLabel>Speed is required</ErrorLabel>
                  )}
                </InputGroup>
              </Row>
              <Row>
                <InputGroup>
                  <div>
                    <Label htmlFor="price">List Price (LMR) *</Label>
                  </div>
                  <Input
                    {...register('price', {
                      required: true,
                      min: 1
                    })}
                    placeholder="LMR Charged for Hash Power"
                    type="number"
                    name="price"
                    id="price"
                    min={1}
                  />
                  <Sublabel>
                    This is the price you will deploy your contract to the
                    marketplace.
                  </Sublabel>
                  {formState?.errors?.price?.type === 'required' && (
                    <ErrorLabel>Price is required</ErrorLabel>
                  )}
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
                  <RightBtn disabled={!formState?.isValid} type="submit">
                    Create Contract
                  </RightBtn>
                </Row>
              </InputGroup>
            </Form>
          </>
        )}
      </Body>
    </Modal>
  );
}

export default withCreateContractModalState(CreateContractModal);
