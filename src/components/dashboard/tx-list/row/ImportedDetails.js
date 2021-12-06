import React from 'react';
import styled from 'styled-components';

const Chain = styled.span`
  line-height: 1.6rem;
  font-size: 1.3rem;
  font-weight: 600;
`;

export default function ImportedDetails({ importedFrom, isPending }) {
  return (
    <div>
      {isPending ? 'Pending import from ' : 'Imported from '}
      <Chain>{importedFrom}</Chain> blockchain
    </div>
  );
}
