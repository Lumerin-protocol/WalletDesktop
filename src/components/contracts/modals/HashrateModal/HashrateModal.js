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
  const [chart, setChart] = useState([]);

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  useEffect(() => {
    if (inteval) clearInterval(inteval);
    if (!contractId) return;
    async function set() {
      var previousDay = new Date();
      previousDay.setDate(previousDay.getDate() - 1);
      let storedHashrate = (await client.getContractHashrate(contractId))
        .filter(x => x.timestamp > previousDay.getTime())
        .sort((a, b) => a.timestamp - b.timestamp);

      const hashratePoints = storedHashrate.reduce(
        (curr, next) => ({ ...curr, [next.timestamp]: next.hashrate }),
        {}
      );
      const hashrateTimestamps = Object.keys(hashratePoints)
        .map(x => +x)
        .reverse();

      // day interval with 5 min step
      const step = 5 * 60 * 1000;
      const dayTimeFrames = Array.from(' '.repeat(288)).map((_, index) => {
        const time = previousDay.getTime() + index * step;
        return [time - (time % step), 0];
      });

      const result = [];
      dayTimeFrames.forEach(frame => {
        let item = frame;
        hashrateTimestamps.forEach(latest => {
          const lt = latest - (latest % 1000) * 60;
          if (frame[0] - 300000 <= lt && lt <= frame[0]) {
            item[1] = hashratePoints[latest];
          }
        });
        result.push(item);
      });

      setChart(renderChart(result));
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
