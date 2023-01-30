import styled from 'styled-components';
import { BaseBtn } from '../common';

export const Container = styled.div`
  background-color: ${p => p.theme.colors.light};
  padding: 2.4rem 1.6rem 1.6rem 1.6rem;
`;

export const Message = styled.div`
  color: ${p => p.theme.colors.copy};
  margin-bottom: 2.4rem;
  font-size: 1.6rem;
  line-height: 1.5;
`;

export const Button = styled(BaseBtn)`
  background-color: ${p => p.theme.colors.primary};
  border-radius: 12px;
  display: block;
  line-height: 1.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-shadow: 0 2px 0 ${p => p.theme.colors.darkShade};
  padding: 1.2rem;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;
