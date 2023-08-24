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
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';
import { IconChevronUp, IconChevronDown } from '@tabler/icons';

import Modal from './Modal';

const ProfitLabel = styled.div`
  cursor: pointer;
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.125);
`;

const getContractRewardBtcPerTh = (price, time, speed, btcRate, lmrRate) => {
  if (!price || !speed || !time) return;

  const lengthDays = time / 24;

  const contractUsdPrice = price * lmrRate;
  const contractBtcPrice = contractUsdPrice / btcRate;
  const result = contractBtcPrice / speed / lengthDays;
  return result.toFixed(10);
};

const calculateSuggestedPrice = (
  time,
  speed,
  btcRate,
  lmrRate,
  profit,
  multiplier
) => {
  const lengthDays = time / 24;
  return (
    (multiplier * profit * lengthDays * speed * btcRate) /
    lmrRate
  ).toFixed(0);
};

const ApplyBtn = styled(RightBtn)`
  width: 15%;
  height: 15%;
  font-size: 1.2rem;
  border-radius: 15px;
  margin-left: 10px;
  background-color: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.light};

  @media (min-width: 1040px) {
    margin-left: 10px;
  }
`;

const ProfitMessageLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.4rem;
  font-size: 1.1rem;
  font-weight: bold;
  opacity: 0.65;
  cursor: default;
  padding: 0 1rem;
  border-bottom: ${p => (p.show ? '1px solid rgba(0,0,0,.125)' : '')};
  padding-bottom: ${p => (p.show ? '1rem' : '')};
`;

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
  const [estimatedReward, setEstimatedReward] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [showSuggested, setShowSuggested] = useState(false);
  const [persent, setPersent] = useState(0);
  const underProfit = networkReward > (estimatedReward || 0);

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
    value: editContractData.length ? editContractData.length / 3600 : undefined,
    onChange: e => {
      const reward = getContractRewardBtcPerTh(
        price,
        e.target.value,
        speed,
        btcRate,
        lmrRate
      );

      if (reward) {
        setEstimatedReward(reward);
        if (!suggestedPrice) {
          const result = calculateSuggestedPrice(
            e.target.value,
            speed,
            btcRate,
            lmrRate,
            networkReward,
            1
          );
          setSuggestedPrice(result);
        }
      }
    }
  });
  const speedField = register('speed', {
    required: true,
    min: 100,
    max: 1000,
    value: editContractData.price
      ? editContractData.speed / 10 ** 12
      : undefined,
    onChange: e => {
      const reward = getContractRewardBtcPerTh(
        price,
        length,
        e.target.value,
        btcRate,
        lmrRate
      );

      if (reward) {
        setEstimatedReward(reward);
        if (!suggestedPrice) {
          const result = calculateSuggestedPrice(
            length,
            e.target.value,
            btcRate,
            lmrRate,
            networkReward,
            1
          );
          setSuggestedPrice(result);
        }
      }
    }
  });
  const priceField = register('price', {
    required: true,
    min: 1,
    value: editContractData.price
      ? editContractData.price / lmrDecimals
      : undefined,
    onChange: e => {
      console.log(e.target.value);
      const reward = getContractRewardBtcPerTh(
        e.target.value,
        length,
        speed,
        btcRate,
        lmrRate
      );
      if (reward) {
        setEstimatedReward(reward);
      }
    }
  });

  function percentFormatter(v) {
    return `${v} %`;
  }

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
                    <Sublabel>~ {estimatedReward} BTC/TH/day</Sublabel>
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
                {!!price && !!speed && !!length && !!underProfit && (
                  <div>
                    <ProfitLabel
                      onClick={() => setShowSuggested(!showSuggested)}
                    >
                      <ProfitMessageLabel show={showSuggested}>
                        Estimated reward is less than network reward (
                        {networkReward} BTC/TH/day)
                        {showSuggested ? (
                          <IconChevronUp width={16} height={16}></IconChevronUp>
                        ) : (
                          <IconChevronDown
                            width={16}
                            height={16}
                          ></IconChevronDown>
                        )}
                      </ProfitMessageLabel>

                      {showSuggested && (
                        <div onClick={e => e.stopPropagation()}>
                          <div
                            style={{
                              display: 'flex',
                              padding: '1rem',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <Sublabel> Select desired premium </Sublabel>

                            <Slider
                              style={{ width: '80%' }}
                              ariaValueTextFormatterForHandle={percentFormatter}
                              tipFormatter={percentFormatter}
                              tipProps={{
                                placement: 'top',
                                visible: true
                              }}
                              onClick={e => e.stopPropagation()}
                              onChange={v => {
                                setPersent(v);
                                const result = calculateSuggestedPrice(
                                  length,
                                  speed,
                                  btcRate,
                                  lmrRate,
                                  networkReward,
                                  (100 + v) / 100
                                );
                                setSuggestedPrice(result);
                              }}
                              min={0}
                              max={30}
                            ></Slider>
                          </div>
                          <div>
                            <Sublabel>Premium: {persent}% </Sublabel>
                          </div>
                          <div>
                            <Sublabel>
                              Estimated Reward:{' '}
                              {getContractRewardBtcPerTh(
                                suggestedPrice,
                                length,
                                speed,
                                btcRate,
                                lmrRate
                              )}{' '}
                              BTC/TH/day
                            </Sublabel>
                          </div>
                          <Sublabel>
                            Suggested Price: {suggestedPrice} LMR{' '}
                          </Sublabel>
                          <ApplyBtn
                            onClick={() => {
                              setValue('price', suggestedPrice);
                              setPrice(suggestedPrice);
                              const reward = getContractRewardBtcPerTh(
                                suggestedPrice,
                                length,
                                speed,
                                btcRate,
                                lmrRate
                              );
                              if (reward) {
                                setEstimatedReward(reward);
                              }
                            }}
                          >
                            Apply
                          </ApplyBtn>
                        </div>
                      )}
                    </ProfitLabel>
                  </div>
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
