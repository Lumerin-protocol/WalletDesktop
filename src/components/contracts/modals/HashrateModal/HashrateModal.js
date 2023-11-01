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

      setHashrate(hr);
      const items = hr.reduce(
        (curr, next) => ({ ...curr, [next.timestamp]: next.hashrate }),
        {}
      );
      const keys = Object.keys(items)
        .map(x => +x)
        .reverse();

      const dayTimeFrames = Array.from(' '.repeat(288)).map((_, index) => {
        const time = d.getTime() + index * 300000;
        return [time - (time % 300000), 0];
      });

      const result = [];
      dayTimeFrames.forEach(element => {
        let item = element;
        keys.forEach(latest => {
          const lt = latest - (latest % 1000) * 60;
          if (element[0] - 300000 <= lt && lt <= element[0]) {
            item[1] = items[latest];
          }
        });
        result.push(item);
      });

      const chart = renderChart(result);
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
          ></div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chart} />
      </Body>
    </Modal>
  );
}

export default withClient(HashrateModal);
