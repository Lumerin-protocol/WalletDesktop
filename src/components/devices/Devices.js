import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import withDashboardState from '../../store/hocs/withDashboardState';
import { LayoutHeader } from '../common/LayoutHeader';
import { View } from '../common/View';
import { Btn, Flex, TextInput } from '../common';
import withDevicesState from '../../store/hocs/withDevicesState';
import Selector from '../common/Selector';
import Sp from '../common/Spacing';
import Device from './Device';
import { mapRangeNameToIpRange, RANGE, rangeSelectOptions } from './constants';
import Spinner from '../common/Spinner';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colors.light};
  height: 100vh;
  max-width: 100vw;
  position: relative;
  padding: 0 2.4rem;

  .discovery-spinner {
    box-shadow: none;
    background-color: transparent;
    svg {
      width: 2em;
      height: 2em;
    }
  }
`;

const DeviceDiscoveryControl = styled.div`
  color: ${p => p.theme.colors.dark};
  .row {
    display: flex;
  }
`;

const DeviceDiscoveryResult = styled.div`
  display: flex;
  flex-wrap: wrap;
  color: ${p => p.theme.colors.dark};
  margin: 1em 0;
  height: 100%;
  overflow-y: scroll;
`;

const Devices = props => {
  const [range, setRange] = useState(rangeSelectOptions[0].value);
  const [fromIpDefault, toIpDefault] = mapRangeNameToIpRange(RANGE.SUBNET_24);
  const [fromIp, setFromIp] = useState(fromIpDefault);
  const [toIp, setToIp] = useState(toIpDefault);

  const isInputDisabled = [RANGE.SUBNET_16, RANGE.SUBNET_24].includes(range);
  const isInputVisible = range !== RANGE.LOCAL;
  const isDiscovering = props?.devices?.isDiscovering;
  const devices = Object.values(props?.devices?.devices) || [];

  const onRangeChange = e => {
    setRange(e.value);
    if ([RANGE.SUBNET_24, RANGE.SUBNET_16].includes(e.value)) {
      const ipRange = mapRangeNameToIpRange(e.value);
      setFromIp(ipRange[0]);
      setToIp(ipRange[1]);
    }
  };

  const startDiscovery = () => {
    props.resetDevices();

    if (range === RANGE.LOCAL) {
      return props.client.startDiscovery({});
    }
    return props.client.startDiscovery({ fromIp, toIp });
  };

  const stopDiscovery = () => props.client.stopDiscovery({});

  return (
    <View data-testid="devices-container">
      <Container>
        <LayoutHeader
          title="Device discovery"
          address={props.address}
          copyToClipboard={props.client.copyToClipboard}
        />

        <DeviceDiscoveryControl>
          <Sp mb={2}>
            <Flex.Row>
              <Sp mr={1}>
                <Selector
                  disabled={false}
                  onChange={onRangeChange}
                  options={rangeSelectOptions}
                  error={null}
                  label="Range"
                  value={range}
                  id="range"
                />
              </Sp>
              {isInputVisible && (
                <>
                  <Sp mr={1}>
                    <TextInput
                      id="from-ip"
                      label="From IP"
                      value={fromIp}
                      onChange={e => setFromIp(e.value)}
                      disabled={isInputDisabled}
                    />
                  </Sp>
                  <Sp>
                    <TextInput
                      id="to-ip"
                      label="To IP"
                      value={toIp}
                      onChange={e => setToIp(e.value)}
                      disabled={isInputDisabled}
                    />
                  </Sp>
                </>
              )}
            </Flex.Row>
          </Sp>
          <Flex.Row align="center">
            {isDiscovering ? (
              <>
                <Btn onClick={stopDiscovery} style={{ marginRight: '20px' }}>
                  Stop Discovery
                </Btn>
                <Spinner className="discovery-spinner" size="25px" />
              </>
            ) : (
              <Btn onClick={startDiscovery}>Start Discovery</Btn>
            )}
          </Flex.Row>
        </DeviceDiscoveryControl>
        <DeviceDiscoveryResult>
          {!isDiscovering && devices.length === 0 && `No devices found`}
          {isDiscovering && devices.length === 0 && `Discovering...`}
          {devices.map(item => (
            <Device
              key={item.host}
              isLoading={!item.isDone}
              ip={item.host}
              deviceModel={item.deviceModel}
              deviceType={item.deviceType}
              hashRateGHS={item.hashRateGHS}
              isApiAvailable={item.isApiAvailable}
              poolAddress={item.poolAddress}
              poolUser={item.poolUser}
              isPrivilegedApiAvailable={item.isPrivilegedApiAvailable}
              proxyRouterUrl={props.proxyRouterUrl}
            />
          ))}
        </DeviceDiscoveryResult>
      </Container>
    </View>
  );
};

export default withDevicesState(Devices);
