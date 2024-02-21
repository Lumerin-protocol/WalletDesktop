import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import {
  TitleWrapper,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Row,
  Input as StyledInput,
  Label,
  Sublabel,
  RightBtn,
  ErrorLabel,
  ApplyBtn,
  CloseModal,
  ProfitMessageLabel,
  ProfitLabel,
  LeftBtn
} from './modals/CreateContractModal.styles';
import withContractsState from '../../store/hocs/withContractsState';
import { lmrDecimals } from '../../utils/coinValue';

import { useForm } from 'react-hook-form';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Spinner from '../common/Spinner';

const Container = styled.div`
  height: calc(100vh - 65px);
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow-y: auto;
  padding: 2rem 2.4rem;
  color: black;
`;

const Input = styled(StyledInput)`
  border-radius: 5px;
`;

const Header = styled.div`
  /* font-size: 2rem; */
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  color: ${p => p.theme.colors.primary};
  margin-inline-end: 0px;
  letter-spacing: 1px;
  font-weight: 500;
`;
const Info = styled.div`
  font-size: 14px;
`;
const SubHeader = styled.div`
  /* font-size: 2rem; */
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  color: ${p => p.theme.colors.primary};
  margin-inline-end: 0px;
  /* letter-spacing: -2px; */
  font-weight: 400;
`;

const ReviewItem = styled.li`
  margin: 1rem 0;
`;

const BulkCreationPage = props => {
  const [isPreview, setIsPreview] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [totalHashrateState, setTotalHashrate] = useState();
  const [totalContractsState, setTotalContracts] = useState();

  const [priceState, setPriceState] = useState();
  const [profitState, setProfitState] = useState();
  const [durationState, setdurationState] = useState();
  console.log(props);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    getValues,
    reset,
    trigger
  } = useForm({ mode: 'onBlur' });

  const handleBatch = async () => {
    setShowSpinner(true);
    await props.client.lockSendTransaction();

    const speed = (totalHashrate / totalContracts).toFixed(0);

    for (let i = 0; i < totalContracts; i++) {
      await handleContractDeploy({
        address: props.address,
        price: priceState,
        time: durationState,
        profitTarget: profitState,
        speed
      });
    }

    await props.client.unlockSendTransaction();
    setShowSpinner(false);
  };

  const handleContractDeploy = async contractDetails => {
    const contract = {
      price: contractDetails.price * lmrDecimals,
      speed: contractDetails.speed * 10 ** 12, // THs
      duration: contractDetails.time * 3600, // Hours to seconds
      sellerAddress: contractDetails.address,
      profit: contractDetails.profitTarget
    };

    return props.client
      .createContract(contract)
      .then(result => {
        const contractAddress = result?.events && result?.events[0]?.address;
        console.log('successfully created', contractAddress);
      })
      .catch(error => {
        props.context.toast('error', error.message || error);
      })
      .finally(() => {
        console.log('finished');
      });
  };

  const totalHashrate = register('totalHashrate', {
    required: true,
    min: 24,
    max: 48
  });

  const totalContracts = register('totalContracts', {
    required: true,
    min: 2,
    max: 20
  });

  const price = register('price', {
    required: true,
    min: 1
  });

  const profit = register('profit', {
    required: true
  });

  const duration = register('duration', {
    required: true,
    min: 24,
    max: 48
  });

  return (
    <div style={{ padding: '2rem 2.4rem' }}>
      <Container>
        {CloseModal(e => props.history.replace('/seller-hub'), 54, 50)}
        {!isPreview ? (
          <>
            <Header>Bulk Contract Creation</Header>
            <Info>
              Enter the required details to create multiple contracts. You can
              specify the total hashrate, number of contracts, individual
              prices, and durations in the following steps.
            </Info>
            <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

            <SubHeader>Step 1: Enter Your Total Hashrate</SubHeader>
            <Info>
              Enter the total amount of hashrate you want to distribute across
              your contracts.
            </Info>

            <Row style={{ justifyContent: 'start', alignItems: 'center' }}>
              <InputGroup style={{ maxWidth: '150px' }}>
                <Input
                  {...totalHashrate}
                  onChange={e => {
                    console.log(e);
                    totalHashrate.onChange(e);
                    setTotalHashrate(e.target.value);
                  }}
                  placeholder="200"
                  type="number"
                  name="totalHashrate"
                  id="totalHashrate"
                />
                {/* {formState?.errors?.time?.type === 'required' && (
                                        <ErrorLabel>Duration is required</ErrorLabel>
                                    )}
                                    {formState?.errors?.time?.type === 'min' && (
                                        <ErrorLabel>{'Minimum 24 hours'}</ErrorLabel>
                                    )}
                                    {formState?.errors?.time?.type === 'max' && (
                                        <ErrorLabel>{'Maximum 48 hours'}</ErrorLabel>
                                    )} */}
              </InputGroup>
              <div style={{ margin: '1.5rem 0 0 15px' }}>TH/s</div>
            </Row>

            <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

            <SubHeader>Step 2: Determine Number of Contracts</SubHeader>
            <Info>
              Use the slider or input box to choose how many contracts you want
              to create. Your total hashrate will be evenly distributed across
              these contracts.
            </Info>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start'
              }}
            >
              <Slider
                style={{ width: '60%' }}
                ariaValueTextFormatterForHandle={v => v}
                tipFormatter={v => v}
                tipProps={{
                  placement: 'top',
                  visible: true
                }}
                onClick={e => e.stopPropagation()}
                onChange={v => {
                  console.log(v);
                  setValue('totalContracts', v);
                  setTotalContracts(v);
                  // setPersent(v);
                  // const result = calculateSuggestedPrice(
                  //   length,
                  //   speed,
                  //   btcRate,
                  //   lmrRate,
                  //   networkReward,
                  //   (100 + v) / 100
                  // );
                  // setSuggestedPrice(result);
                }}
                min={2}
                max={20}
              ></Slider>

              <Row
                style={{
                  justifyContent: 'start',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              >
                <InputGroup style={{ maxWidth: '100px', marginLeft: '15px' }}>
                  <Input
                    disabled={true}
                    {...totalContracts}
                    placeholder="2"
                    type="number"
                    name="totalContracts"
                    id="totalContracts"
                  />
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
            </div>
            {totalHashrateState && totalContractsState ? (
              <div
                style={{
                  fontWeight: 'bold',
                  fontWeight: '500',
                  letterSpacing: '2px'
                }}
              >
                Hashrate per Contract:{' '}
                {(totalHashrateState / totalContractsState).toFixed(0)} TH/s
              </div>
            ) : (
              <></>
            )}

            <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

            <SubHeader>Step 3: Set Price and Duration</SubHeader>
            <Info style={{ marginBottom: '1rem' }}>
              Define price and duration for each of your contracts.
            </Info>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <Row style={{ maxWidth: '175px' }}>
                <InputGroup>
                  <Label htmlFor="time">Suggested Price (in LMR)</Label>
                  <Input
                    {...price}
                    onChange={e => {
                      price.onChange(e);
                      setPriceState(e.target.value);
                    }}
                    placeholder="200"
                    style={{ width: '100%' }}
                    type="number"
                    name="price"
                    id="price"
                  />
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

              <Row style={{ maxWidth: '175px', marginLeft: '25px' }}>
                <InputGroup>
                  <Label htmlFor="time">Desired Profit</Label>
                  <Input
                    {...profit}
                    onChange={e => {
                      profit.onChange(e);
                      setProfitState(e.target.value);
                    }}
                    placeholder="5%"
                    type="number"
                    name="profit"
                    id="profit"
                  />
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

              <Row style={{ maxWidth: '250px' }}>
                <InputGroup style={{ maxWidth: '250px', marginLeft: '25px' }}>
                  <Label htmlFor="time">Duration</Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                      {...duration}
                      onChange={e => {
                        duration.onChange(e);
                        setdurationState(e.target.value);
                      }}
                      placeholder="24"
                      type="number"
                      name="duration"
                      id="duration"
                    />
                    <div style={{ marginLeft: '10px' }}> Hours </div>
                  </div>

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
            </div>

            <InputGroup
              style={{
                textAlign: 'center',
                justifyContent: 'space-between',
                height: '60px',
                marginTop: '4rem'
              }}
            >
              <Row style={{ justifyContent: 'start' }}>
                {/* <LeftBtn onClick={handleSaveDraft}>Save as Draft</LeftBtn> */}
                <RightBtn
                  disabled={false}
                  onClick={() => setIsPreview(true)}
                  style={{ width: '300px' }}
                >
                  Review Contracts
                </RightBtn>

                <LeftBtn
                  style={{ width: '300px', marginLeft: '15px' }}
                  disabled={false}
                  onClick={() => props.history.replace('/seller-hub')}
                >
                  Cancel
                </LeftBtn>
              </Row>
            </InputGroup>
          </>
        ) : (
          <>
            <Header>Review Your Bulk Contract Creation</Header>
            <Info>
              Please review the details of the contracts you are about to
              create. Make sure the hashrate distribution, number of contracts,
              price, and duration are as intended.{' '}
            </Info>
            <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

            <div>
              <ul>
                <ReviewItem>
                  Total Hashrate: {totalHashrateState} TH/s
                </ReviewItem>
                <ReviewItem>
                  Number of Contracts: {totalContractsState}
                </ReviewItem>
                <ReviewItem>Price Each: {priceState} LMR</ReviewItem>
                <ReviewItem>Desired Profit: {profitState} %</ReviewItem>
                <ReviewItem>Duration Each: {durationState} Hours</ReviewItem>
              </ul>
            </div>

            <hr style={{ marginBlockStart: '2em', marginBlockEnd: '2em' }} />

            <SubHeader>Overall Summary</SubHeader>
            <Info>
              Create {totalContractsState} contracts with total of{' '}
              {totalHashrateState} TH/s distributed evenly. Each contact priced
              at {priceState} LMR for a duration of {durationState} hours.
            </Info>

            <InputGroup
              style={{
                textAlign: 'center',
                justifyContent: 'space-between',
                height: '60px',
                marginTop: '4rem'
              }}
            >
              <Row style={{ justifyContent: 'start' }}>
                {/* <LeftBtn onClick={handleSaveDraft}>Save as Draft</LeftBtn> */}
                <RightBtn
                  disabled={false}
                  onClick={() => handleBatch()}
                  style={{ width: '300px' }}
                >
                  {showSpinner ? <Spinner></Spinner> : 'Create Contracts'}
                </RightBtn>

                <LeftBtn
                  style={{ width: '300px', marginLeft: '15px' }}
                  disabled={showSpinner}
                  onClick={() => isPreview(false)}
                >
                  Go Back and Edit
                </LeftBtn>
              </Row>
            </InputGroup>
          </>
        )}
      </Container>
    </div>
  );
};
export default withRouter(withContractsState(BulkCreationPage));
