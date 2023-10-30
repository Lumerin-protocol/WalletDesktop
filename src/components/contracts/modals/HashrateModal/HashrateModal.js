import React, { useEffect, useState } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import {
  Modal,
  Body,
  TitleWrapper,
  Title,
  Subtitle,
  CloseModal,
  RightBtn,
  Row
} from '../CreateContractModal.styles';
import { withClient } from '../../../../store/hocs/clientContext';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons';

import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { renderChart } from './chartRenderer';

let inteval;
function HashrateModal(props) {
  const { isActive, close, contractId, client } = props;
  const [hashrate, setHashrate] = useState([]);
  const [chart, setChart] = useState([]);

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  useEffect(() => {
    if (inteval) clearInterval(inteval);
    if (!contractId) return;
    async function set() {
      var d = new Date();
      d.setDate(d.getDate() - 1);

      let hr = (await client.getContractHashrate(contractId))
        .filter(x => x.timestamp > d.getTime())
        .sort(function(a, b) {
          return a.timestamp - b.timestamp;
        });

      //const t = hr.slice(0, 22).map((x, i) => ({...x, timestamp: 1697739351623 + i * 60 * 5 * 1000}));

      let data = hr;
      // const temp = data.reduce((curr, next, i) => {
      //     console.log(new Date(next.timestamp));
      //     const res = [...curr, next];

      //     if(data.length - 1 == i) {
      //         return res;
      //     }
      //     const treshhold = next.timestamp + 1000 * 10 * 60;
      //     if(treshhold < data[i + 1].timestamp) {
      //         return [...res, {timestamp: next.timestamp + 1000 * 10 * 60, hashrate: null}];
      //     }
      //     return res;
      // },[])

      console.log(hr);
      // .reduce((a,b, i) => {

      // }, []);

      //Взять точку + если в след 6 секунд нет ничего то вставить null

      let markers = Array.from(' '.repeat(74)) // 288
        .map((i, index) => ({
          id: '0x3f3B057691Fdb136F4657F4559d16C723B3549f5',
          hashrate: Math.floor(Math.random() * 25) + 75,
          timestamp: 1697741415085 + index * 5 * 60 * 1000,
          _id: 'xDwkIESXvMtRxCNB'
        }));

      markers = [
        ...markers,
        {
          id: '0x3f3B057691Fdb136F4657F4559d16C723B3549f5',
          hashrate: null,
          timestamp: 1697798622385 - 5 * 5 * 60 * 1000,
          _id: 'xDwkIESXvMtRxCNB'
        },
        ...Array.from(' '.repeat(40)) // 288
          .map((i, index) => ({
            id: '0x3f3B057691Fdb136F4657F4559d16C723B3549f5',
            hashrate: Math.floor(Math.random() * 25) + 75,
            timestamp: 1697798622385 + index * 5 * 60 * 1000,
            _id: 'xDwkIESXvMtRxCNB'
          }))
      ];

      // var emptyChart = Array.from(' '.repeat(288 - hr.length)).map(i => null);
      // console.log(emptyChart);
      // const thr = [...emptyChart, ...hr.map(x => x.hashrate)];

      console.log(hr);
      setHashrate(hr);
      // const timestamps = hr
      // .sort(function (a, b) {
      //     return a.timestamp - b.timestamp;
      //   })
      // .map(x => x.timestamp).forEach(a => {
      //     console.log(new Date(a).toUTCString());
      // })
      // const hashrateData = hr.map(x => x.hashrate);
      const chart = renderChart(markers.map(x => [x.timestamp, x.hashrate]));
      setChart(chart);
    }
    set();
    inteval = setInterval(() => {
      set();
    }, 1 * 1000 * 60);
  }, [contractId]);

  if (!isActive) {
    return <></>;
  }

  const getCurr = () => {
    const d = new Date();
    d.setSeconds(0);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  return (
    <Modal onClick={handleClose}>
      <Body
        style={{ width: '100%', maxWidth: '80%' }}
        onClick={handlePropagation}
      >
        {CloseModal(handleClose)}
        <TitleWrapper style={{ height: 'auto' }}>
          <Title>Dashboard</Title>
        </TitleWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Recent Hashrate (last 24 hours)</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <IconChevronsLeft></IconChevronsLeft>
            {getCurr()}

            <IconChevronsRight></IconChevronsRight>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chart} />
      </Body>
    </Modal>
  );
}

export default withClient(HashrateModal);
