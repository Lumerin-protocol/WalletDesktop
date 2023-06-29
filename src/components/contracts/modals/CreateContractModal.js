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
import { CreateContractSuccessPage } from './CreateContractSuccessPage';
import { toMicro } from '../utils';

const getContractRewardBtcPerTh = (price, time, speed, btcRate, lmrRate) => {
  const lengthDays = time / 24;

  const contractUsdPrice = price * lmrRate;
  const contractBtcPrice = contractUsdPrice / btcRate;
  const result = contractBtcPrice / speed / lengthDays;
  return result.toFixed(10);
};

function CreateContractModal(props) {
  const {
    isActive,
    save,
    deploy,
    close,
    client,
    address,
    showSuccess,
    lmrRate,
    btcRate
  } = props;

  const [isPreview, setIsPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [price, setPrice] = useState();
  const [speed, setSpeed] = useState();
  const [length, setTime] = useState();

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

  const resetValues = () => {
    reset();
    setPrice();
    setSpeed();
    setTime();
    setValue('address', address);
  };

  const wrapHandleDeploy = async e => {
    e.preventDefault();
    setIsCreating(true);
    await deploy(e, getValues());
    resetValues();
    setIsCreating(false);
    setIsPreview(false);
  };

  const handleClose = e => {
    resetValues();
    setIsPreview(false);
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  if (!isActive) {
    return <></>;
  }
  const timeField = register('time', {
    required: true,
    min: 24,
    max: 48
  });
  const speedField = register('speed', {
    required: true,
    min: 100,
    max: 1000
  });
  const priceField = register('price', {
    required: true,
    min: 1
  });
  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        {showSuccess ? (
          <CreateContractSuccessPage close={handleClose} />
        ) : isPreview ? (
          <CreateContractPreview
            isCreating={isCreating}
            data={getValues()}
            close={() => setIsPreview(false)}
            submit={wrapHandleDeploy}
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
              {/* <Row>
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
              </Row> */}
              <Row>
                <InputGroup>
                  <Label htmlFor="time">Duration *</Label>
                  <Input
                    {...timeField}
                    onChange={e => {
                      setTime(e.target.value);
                      timeField.onChange(e);
                    }}
                    placeholder="# of hours"
                    type="number"
                    name="time"
                    id="time"
                  />
                  <Sublabel>Contract Length (min 24 hrs, max 48 hrs)</Sublabel>
                  {formState?.errors?.time?.type === 'required' && (
                    <ErrorLabel>Duration is required</ErrorLabel>
                  )}
                  {formState?.errors?.time?.type === 'min' && (
                    <ErrorLabel>{'Minimum 24 hours'}</ErrorLabel>
                  )}
                  {formState?.errors?.time?.type === 'max' && (
                    <ErrorLabel>{'Maximum 48 hours'}</ErrorLabel>
                  )}
                </InputGroup>
              </Row>
              <Row>
                <InputGroup>
                  <Label htmlFor="speed">Speed *</Label>
                  <Input
                    {...speedField}
                    onChange={e => {
                      setSpeed(e.target.value);
                      speedField.onChange(e);
                    }}
                    placeholder="Number of TH/s"
                    type="number"
                    name="speed"
                    id="speed"
                  />
                  <Sublabel>Amount of TH/s Contracted (min 100 TH/s)</Sublabel>
                  {formState?.errors?.speed?.type === 'required' && (
                    <ErrorLabel>Speed is required</ErrorLabel>
                  )}
                  {formState?.errors?.speed?.type === 'min' && (
                    <ErrorLabel>Minimum 100 TH/s</ErrorLabel>
                  )}
                  {formState?.errors?.speed?.type === 'max' && (
                    <ErrorLabel>Maximum 1000 TH/s</ErrorLabel>
                  )}
                </InputGroup>
              </Row>
              <Row>
                <InputGroup>
                  <div>
                    <Label htmlFor="price">List Price (LMR) *</Label>
                  </div>
                  <div>
                    <Input
                      {...priceField}
                      onChange={e => {
                        setPrice(e.target.value);
                        priceField.onChange(e);
                      }}
                      placeholder="LMR for Hash Power"
                      type="number"
                      name="price"
                      id="price"
                    />{' '}
                    {!!price && !!speed && !!length && (
                      <Sublabel>
                        ~{' '}
                        {getContractRewardBtcPerTh(
                          price,
                          length,
                          speed,
                          btcRate,
                          lmrRate
                        )}{' '}
                        BTC/TH/day
                      </Sublabel>
                    )}
                  </div>
                  <Sublabel>
                    This is the price you will deploy your contract to the
                    marketplace.
                  </Sublabel>
                  {formState?.errors?.price?.type === 'required' && (
                    <ErrorLabel>Price is required</ErrorLabel>
                  )}
                  {formState?.errors?.price?.type === 'min' && (
                    <ErrorLabel>Minimum 1 LMR</ErrorLabel>
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
