import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import SpeedIcon from '../../images/icons/download-speed.png';
import PriceIcon from '../../images/icons/price-tag.png';
import TimeIcon from '../../images/icons/time-left.png';
import withContractsListState from '../../store/hocs/withContractsListState';

function AvailableContracts({ contracts }) {
  console.log(contracts);
  const AvailableContract = styled.li`
    background: white;
    border-radius: 15px;
    margin-bottom: 1rem;
    padding: 2rem;
    width: 100%;
    height: 100px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    color: black p {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      img {
        margin-right: 1rem;
        width: 20px;
      }
    }
  `;

  const SkeletonWrap = styled.div`
    & span {
      border-radius: 15px;
      margin-bottom: 1rem;
    }
  `;

  const getReadableDate = length => {
    const numLength = parseFloat(length);
    const days = Math.floor(numLength / 24);
    const remainder = numLength % 24;
    const hours = days >= 1 ? Math.floor(remainder) : Math.floor(numLength);
    const minutes =
      days >= 1
        ? Math.floor(60 * (remainder - hours))
        : Math.floor((numLength - Math.floor(numLength)) * 60);
    const readableDays = days
      ? days === 1
        ? `${days} day`
        : `${days} days`
      : '';
    const readableHours = hours
      ? hours === 1
        ? `${hours} hour`
        : `${hours} hours`
      : '';
    const readableMinutes = minutes
      ? minutes === 1
        ? `${minutes} minute`
        : `${minutes} minutes`
      : '';
    const readableDate = `${readableDays} ${readableHours} ${readableMinutes}`;
    return readableDate;
  };

  return (
    <>
      {false ? (
        [...Array(10)].map((elementInArray, index) => (
          <SkeletonWrap>
            {/* <Skeleton variant='rectangular' width={'100%'} height={100} key={index} /> */}
          </SkeletonWrap>
        ))
      ) : (
        <>
          {contracts && contracts.length > 0 ? (
            <ul>
              {contracts.map((item, index) => (
                <AvailableContract key={index}>
                  <p>
                    <a
                      className="underline pb-0 font-Raleway cursor-pointer"
                      href={process.env.ETHERSCAN_URL + `${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Contract
                    </a>
                  </p>
                  <p>
                    <img src={SpeedIcon} alt="" />
                    {item.speed} th/s
                  </p>
                  {item.length && (
                    <p>
                      <img src={TimeIcon} alt="" />
                      {getReadableDate(item.length.toString())}
                    </p>
                  )}
                  <p>
                    <img src={PriceIcon} alt="" />
                    {item.price} LMR
                  </p>
                  {item.trade}
                </AvailableContract>
              ))}
            </ul>
          ) : (
            <h2>No contracts available for purchase.</h2>
          )}
        </>
      )}
    </>
  );
}

export default withContractsListState(AvailableContracts);
