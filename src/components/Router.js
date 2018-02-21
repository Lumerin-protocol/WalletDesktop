import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import React, { Component } from 'react'
import RecoverFromMnemonic from './RecoverFromMnemonic'
import Dashboard from './Dashboard'
import Converter from './Converter'
import Settings from './Settings'
import Sidebar from './Sidebar'
import Auction from './Auction'
import styled from 'styled-components'
import Help from './Help'

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding-left: 64px;

  @media (min-width: 800px) {
    padding-left: 0;
    left: 200px;
  }
`

const Main = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
`

export default class Router extends Component {
  render() {
    return (
      <HashRouter>
        <Container>
          <Sidebar />
          <Main>
            <Switch>
              <Route path="/" exact render={() => <Redirect to="/wallets" />} />
              <Route path="/wallets" component={Dashboard} />
              <Route path="/auction" component={Auction} />
              <Route path="/converter" component={Converter} />
              <Route path="/tools" component={RecoverFromMnemonic} />
              <Route component={Settings} path="/settings" />
              <Route component={Help} path="/help" />
            </Switch>
          </Main>
        </Container>
      </HashRouter>
    )
  }
}
