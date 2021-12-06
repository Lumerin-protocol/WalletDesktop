import { Provider as ClientProvider } from '@lumerin/wallet-ui-logic/src/hocs/clientContext';
import { Provider, createStore } from '@lumerin/wallet-ui-logic/src/store';
import { ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom';
import theme from '@lumerin/wallet-ui-logic/src/theme';
import Modal from 'react-modal';
import React from 'react';
import Root from '@lumerin/wallet-ui-logic/src/components/Root';

import { subscribeToMainProcessMessages } from './subscriptions';
import Web3ConnectionNotifier from './components/Web3ConnectionNotifier';
import { ToastsProvider } from './components/toasts';
import { Tooltips } from './components/common';
import createClient from './client';
import Onboarding from './components/onboarding/Onboarding';
import Loading from './components/Loading';
import Router from './components/Router';
import Login from './components/Login';

const client = createClient(createStore);

// Initialize all the Main Process subscriptions
subscribeToMainProcessMessages(client.store);

ReactDOM.render(
  <ClientProvider value={client}>
    <Provider store={client.store}>
      <ThemeProvider theme={theme}>
        <ToastsProvider>
          <Root
            OnboardingComponent={Onboarding}
            LoadingComponent={Loading}
            RouterComponent={Router}
            LoginComponent={Login}
          />
          <Tooltips />
          <Web3ConnectionNotifier />
        </ToastsProvider>
      </ThemeProvider>
    </Provider>
  </ClientProvider>,
  document.getElementById('root')
);

Modal.setAppElement('#root');
