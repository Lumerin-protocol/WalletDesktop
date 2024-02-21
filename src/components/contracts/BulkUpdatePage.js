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
import Spinner from '../common/Spinner';
import withContractsState from '../../store/hocs/withContractsState';
import { lmrDecimals } from '../../utils/coinValue';

import { useForm } from 'react-hook-form';
import { IconAlertTriangle } from '@tabler/icons';

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

const BulkUpdatePage = props => {
  const [isPreview, setIsPreview] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  const [changeProfit, setChangeProfit] = useState(false);
  const [changePrice, setChangePrice] = useState(false);
  const [agree, setAgree] = useState(false);

  const [priceState, setPriceState] = useState();
  const [profitState, setProfitState] = useState();
  const [constracts] = useState(2);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    getValues,
    reset,
    trigger
  } = useForm({ mode: 'onBlur' });

  const price = register('price', {
    required: true,
    min: 1
  });

  const profit = register('profit', {
    required: true
  });

  return (
    <div style={{ padding: '2rem 2.4rem' }}>
      <Container>
        {CloseModal(e => props.history.replace('/seller-hub'), 54, 50)}
        <>
          <Header>Bulk Update Contracts</Header>
          <Info>
            Select the parameters you want to update for the selected contracts.
          </Info>
          <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

          <SubHeader>Selected Contracts</SubHeader>
          <Info>You are updating {constracts} contracts</Info>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '60%',
              margin: '4rem 0'
            }}
          >
            <IconAlertTriangle
              style={{ color: '#ed6c03' }}
              width={'12rem'}
            ></IconAlertTriangle>
            <div style={{ opacity: '0.6' }}>
              Changes made here will apply uniformly to all {constracts}{' '}
              selected contracts. Please review your selections carefully.
            </div>
          </div>

          <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

          <SubHeader>Parameters to Update</SubHeader>

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
                <div>
                  <Input
                    onChange={e => {
                      setChangePrice(!changePrice);
                    }}
                    checked={changePrice}
                    type="checkbox"
                    name="priceCheck"
                    id="priceCheck"
                  />
                  <Label htmlFor="time">Price per TH/s</Label>
                </div>

                {changePrice && (
                  <>
                    <Input
                      {...price}
                      onChange={e => {
                        price.onChange(e);
                        setPriceState(e.target.value);
                      }}
                      style={{ width: '100%' }}
                      placeholder="200"
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
                  </>
                )}
              </InputGroup>
            </Row>

            <Row style={{ maxWidth: '175px', marginLeft: '25px' }}>
              <InputGroup>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Input
                    onChange={e => {
                      setChangeProfit(!changeProfit);
                    }}
                    checked={changeProfit}
                    type="checkbox"
                    name="profitCheck"
                    id="profitCheck"
                  />
                  <Label htmlFor="time">Profit</Label>
                </div>
                {changeProfit && (
                  <>
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
                  </>
                )}
              </InputGroup>
            </Row>
          </div>

          <hr style={{ marginBlockStart: '1em', marginBlockEnd: '2em' }} />

          <SubHeader>Summary of Changes</SubHeader>

          <div>
            <ul>
              {changePrice && <ReviewItem>Price per TH/s: 5 LMR</ReviewItem>}
              {changeProfit && (
                <ReviewItem>Desired Profit: 10% TH/s</ReviewItem>
              )}
            </ul>
          </div>

          <div>
            <Input
              onChange={e => {
                setAgree(!agree);
              }}
              type="checkbox"
              name="agree"
              id="agree"
            />
            <span>I confirm these changes for all selected contracts</span>
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
                disabled={!agree || (!changePrice && !changeProfit)}
                onClick={() => setIsPreview(true)}
                style={{ width: '300px' }}
              >
                {showSpinner ? <Spinner></Spinner> : 'Apply Changes'}
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
      </Container>
    </div>
  );
};
export default withRouter(withContractsState(BulkUpdatePage));
