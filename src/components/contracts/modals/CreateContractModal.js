import React, { useState, useEffect } from 'react';
import withCreateContractModalState from '../../../store/hocs/withCreateContractModalState';
import {
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
  ErrorLabel
} from './CreateContractModal.styles';
import { useForm } from 'react-hook-form';
import { CreateContractPreview } from './CreateContractPreview';
import { CreateContractSuccessPage } from './CreateContractSuccessPage';
import { lmrDecimals } from '../../../utils/coinValue';

import Modal from './Modal';

const getContractRewardBtcPerTh = (
  price,
  time,
  speed,
  btcRate,
  lmrRate,
  profit
) => {
  const lengthDays = time / 24;

  const contractUsdPrice = price * lmrRate;
  const contractBtcPrice = contractUsdPrice / btcRate;
  const result = contractBtcPrice / speed / lengthDays;

  const lmrEqualPrice = (profit, multiplier) =>
    (multiplier * profit * lengthDays * speed * btcRate) / lmrRate;
  console.log(
    lmrEqualPrice(profit, 1),
    lmrEqualPrice(profit, 1.05),
    lmrEqualPrice(profit, 1.1),
    lmrEqualPrice(profit, 1.15),
    lmrEqualPrice(profit, 1.2)
  );

  return result.toFixed(10);
};

function CreateContractModal(props) {
  const {
    isActive,
    save,
    deploy,
    edit,
    close,
    client,
    address,
    showSuccess,
    lmrRate,
    btcRate,
    symbol,
    isEditMode,
    editContractData,
    networkReward
  } = props;

  const [isPreview, setIsPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [price, setPrice] = useState(+editContractData.price);
  const [speed, setSpeed] = useState(editContractData.speed);
  const [length, setTime] = useState(editContractData.length);

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

  const wrapHandleUpdate = async e => {
    e.preventDefault();
    setIsCreating(true);
    await edit(e, getValues(), editContractData.id, editContractData);
    resetValues();
    setIsCreating(false);
    setIsPreview(false);
  };

  const handleClose = e => {
    resetValues();
    setIsPreview(false);
    close(e);
  };

  if (!isActive) {
    return <></>;
  }
  const timeField = register('time', {
    required: true,
    min: 24,
    max: 48,
    value: editContractData.length ? editContractData.length / 3600 : undefined
  });
  const speedField = register('speed', {
    required: true,
    min: 100,
    max: 1000,
    value: editContractData.price
      ? editContractData.speed / 10 ** 12
      : undefined
  });
  const priceField = register('price', {
    required: true,
    min: 1,
    value: editContractData.price
      ? editContractData.price / lmrDecimals
      : undefined
  });

  const title = isEditMode ? 'Edit your contract' : 'Create new contract';
  const buttonLabel = isEditMode ? 'Update Contract' : 'Create Contract';
  const subtitle = isEditMode
    ? 'Changes will not affect running contract.'
    : 'Sell your hashpower on the Lumerin Marketplace';
  return (
    <Modal onClose={handleClose}>
      {showSuccess ? (
        <CreateContractSuccessPage
          close={handleClose}
          isEditMode={isEditMode}
        />
      ) : isPreview ? (
        <CreateContractPreview
          isCreating={isCreating}
          data={getValues()}
          close={() => setIsPreview(false)}
          submit={isEditMode ? wrapHandleUpdate : wrapHandleDeploy}
          isEditMode={isEditMode}
          symbol={symbol}
        />
      ) : (
        <>
          <TitleWrapper>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
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
                  <Label htmlFor="price">List Price ({symbol}) *</Label>
                </div>
                <div>
                  <Input
                    {...priceField}
                    onChange={e => {
                      setPrice(e.target.value);
                      priceField.onChange(e);
                    }}
                    placeholder={`${symbol} for Hash Power`}
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
                        lmrRate,
                        networkReward
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
                  <ErrorLabel>Minimum 1 {symbol}</ErrorLabel>
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
                  {buttonLabel}
                </RightBtn>
              </Row>
            </InputGroup>
          </Form>
        </>
      )}
    </Modal>
  );
}

export default withCreateContractModalState(CreateContractModal);
