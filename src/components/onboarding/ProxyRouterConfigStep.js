import * as utils from '../../store/utils';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { TextInput, AltLayout, Btn, Sp } from '../common';
import Message from './Message';

const ProxyRouterConfigStep = props => {
  return (
    <AltLayout
      title="Configure Proxy Router"
      data-testid="onboarding-container"
    >
      <form
        onSubmit={props.onProxyRouterConfigured}
        data-testid="pr-config-form"
      >
        <Sp mt={2}>
          <TextInput
            data-testid="pool-field"
            autoFocus
            onChange={props.onInputChange}
            noFocus
            error={props.errors.proxyDefaultPool}
            label="Default Pool Address"
            value={props.proxyDefaultPool}
            type="text"
            id="proxyDefaultPool"
          />
        </Sp>
        <Sp mt={6}>
          <Btn block submit>
            Continue
          </Btn>
        </Sp>
      </form>
    </AltLayout>
  );
};

ProxyRouterConfigStep.propTypes = {
  onProxyRouterConfigured: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  proxyDefaultPool: PropTypes.string,
  errors: utils.errorPropTypes('proxyDefaultPool')
};

export default ProxyRouterConfigStep;
