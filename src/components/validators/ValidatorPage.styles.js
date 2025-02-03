import styled from 'styled-components';

export const DefinitionList = styled.dl`
  display: grid;
  grid-template-columns: auto auto;
  row-gap: 1em;
`;

export const Note = styled.div`
  position: relative;
  min-height: 1em;
  margin: 1em 0em;
  background: #fff;
  padding: 2rem 2.5rem;
  color: ${p => p.theme.colors.primary};
  border-radius: 15px;
`;

export const Container = styled.div`
  color: ${p => p.theme.colors.primary};
`;
