import React, { useEffect, useState } from 'react';
import Markdown from 'marked-react';
import termsPath from '../../terms_and_conditions.md';
import styled from 'styled-components';

const StyledTC = styled.div`
  text-align: justify;

  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.25em;
  }
  h3 {
    font-size: 1.1em;
  }
`;

const TermsAndConditions = () => {
  const [result, setResult] = useState('');

  useEffect(() => {
    // TODO: replace with an md loader
    fetch(termsPath)
      .then(res => res.text())
      .then(setResult);
  }, []);

  return (
    <StyledTC>
      <Markdown>{result}</Markdown>
    </StyledTC>
  );
};

export default TermsAndConditions;
