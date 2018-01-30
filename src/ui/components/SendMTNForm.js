// import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

const Container = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const FieldsContainer = styled.div`
  padding: 3.2rem 2.4rem 2.4rem;
`;

const Field = styled.div``;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2.4rem;
`;

const Label = styled.label`
  line-height: 1.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 1px ${p => p.theme.colors.shade};
`;

const Input = styled.input`
  border: none;
  display: block;
  height: 5.6rem;
  padding: 0.8rem 1.6rem;
  background-color: rgba(126, 97, 248, 0.2);
  margin-top: 0.8rem;
  width: 100%;
  line-height: 4rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 1px ${p => p.theme.colors.shade};
`;

const BtnContainer = styled.div`
  background-image: linear-gradient(to bottom, #272727, #323232);
  height: 100%;
  padding: 6.4rem 2.4rem;
  flex-grow: 1;
`;

const SubmitBtn = styled.button`
  font: inherit;
  display: block;
  border: none;
  padding: 0;
  width: 100%;
  height: 56px;
  border-radius: 1.2rem;
  background-image: linear-gradient(to top, #ededed, #ffffff);
  box-shadow: inset 0 3px 0 0 rgba(255, 255, 255, 0.1);
  line-height: 2.5rem;
  opacity: 0.5;
  color: ${p => p.theme.colors.primary};
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

export default class SendMTNForm extends React.Component {
  // static propTypes = {};

  render() {
    // const { foo } = this.state;

    return (
      <Container>
        <FieldsContainer>
          <Field>
            <Label>Sent to Address</Label>
            <Input placeholder="e.g. 0x2345678998765434567" type="text" />
          </Field>
          <Row>
            <Field>
              <Label>Amount (ETH)</Label>
              <Input placeholder="0.00" type="text" />
            </Field>
            <Field>
              <Label>Amount (USD)</Label>
              <Input placeholder="$0.00" type="text" />
            </Field>
          </Row>
          <Row>
            <Field>
              <Label>Fee (ETH)</Label>
              <Input placeholder="0.00" type="text" />
            </Field>
            <Field>
              <Label>Amount (USD)</Label>
              <Input placeholder="$0.00" type="text" />
            </Field>
          </Row>
        </FieldsContainer>
        <BtnContainer>
          <SubmitBtn type="submit">Review Send</SubmitBtn>
        </BtnContainer>
      </Container>
    );
  }
}
