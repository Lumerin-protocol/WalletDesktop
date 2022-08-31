import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import OfflineWarning from './OfflineWarning';
import ChangePassword from './ChangePassword';
import Dashboard from './dashboard/Dashboard';
import Sidebar from './sidebar/Sidebar';
import Sockets from './sockets/Sockets';
import Reports from './reports/Reports';
import Indicies from './indicies/Indicies';
import Tools from './tools/Tools';
import Contracts from './contracts/Contracts';

const fadeIn = keyframes`
  from {
    transform: scale(1.025);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding-left: 64px;
  animation: ${fadeIn} 0.3s linear;

  @media (min-width: 800px) {
    left: 200px;
    padding-left: 0;
  }
`;

const Main = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const Layout = () => (
  <Container data-testid="router-container">
    <Sidebar />
    <Main
      data-scrollelement // Required by react-virtualized implementation in Dashboard/TxList
    >
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/wallet" />} />
        <Route path="/wallet" component={Dashboard} />
        <Route path="/sockets" component={Sockets} />
        <Route path="/contracts" component={Contracts} />
        {/* TODO - Finish up reports */}
        <Route path="/reports" component={Reports} />
        <Route path="/indicies" component={Indicies} />
        <Route path="/tools" component={Tools} />
        <Route path="/change-pass" component={ChangePassword} />
      </Switch>
    </Main>
    <OfflineWarning />
  </Container>
);

export default function Router() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
