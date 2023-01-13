import React, { useState } from 'react';
import styled from 'styled-components';
import { BaseBtn } from '../../common';

export const Modal = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  min-width: 330px;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primaryDark};
`;

export const Body = styled.div`
  position: fixed;
  z-index: 20;
  background-color: ${p => p.theme.colors.light};
  width: 50%;
  height: fit-content;
  border-radius: 15px;
  padding: 3rem 5%;
  max-width: 600px;
  max-height: 800px;

  @media (min-height: 700px) {
    padding: 5rem;
  }
`;

export const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 10%;
  margin-bottom: 10px;
`;
export const Title = styled.div`
  display: block;
  line-height: 2.4rem;
  font-size: 2.5rem;
  font-weight: 900;
  cursor: default;
  margin-bottom: 10px;
`;

export const Subtitle = styled.div`
  display: block;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 10px;
`;

export const ContractLink = styled.a`
  color: #014353;
  text-decoration: none;
  h4 {
    font-size: 0.9rem;
    font-weight: 400;
  }
  p {
    font-size: 1.1rem;
    font-weight: 500;
    text-decoration: underline;
    margin-bottom: 0;
  }
`;

export const Form = styled.form`
  display: flex;
  height: 85%;
  margin: 1rem 0 0;
  flex-direction: column;
  justify-content: space-between;
`;

export const InputGroup = styled.div`
  margin: 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Input = styled.input`
  padding: 4px 8px;
  outline: 0;
  border: 0px;
  background: #eaf7fc;
  border-radius: 15px;
  padding: 1.5rem 1.5rem;
  margin-top: 0.25rem;

  ::placeholder {
    color: rgba(1, 67, 83, 0.56);
  }
`;

export const Select = styled.select`
  margin: 0.4rem 0 0.2rem 0;
  outline: 0;
  border: 0px;
  background: #eaf7fc;
  border-radius: 15px;
  padding: 1.5rem 1.5rem;
  margin-top: 0.25rem;
  color: rgba(1, 67, 83, 0.56);
`;

export const Label = styled.label`
  line-height: 1.4rem;
  font-size: 1.2rem;
  font-weight: 400;
  cursor: default;
`;

export const Sublabel = styled.label`
  line-height: 1.4rem;
  font-size: 1.1rem;
  font-weight: 400;
  opacity: 0.65;
  cursor: default;
  margin-bottom: 0.4rem;
`;

export const SublabelGreen = styled(Sublabel)`
  font-weight: 800;
`;

export const LeftBtn = styled(BaseBtn)`
  width: 45%;
  height: 40px;
  font-size: 1.5rem;
  border-radius: 15px;
  border: 1px solid ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.primary};

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

export const RightBtn = styled(BaseBtn)`
  width: 45%;
  height: 40px;
  font-size: 1.5rem;
  border-radius: 15px;
  background-color: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.light};

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;
