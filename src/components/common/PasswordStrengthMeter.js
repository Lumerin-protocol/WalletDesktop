import React from 'react';
import PropTypes from 'prop-types';
import { GetPasswordStrength, MaxScore } from '../../lib/PasswordStrength';
import { BarElem, Container, Message } from './PasswordStrengthMeter.styles';

/**
 * @param {number} score
 * @returns string
 */
const mapScoreToMessage = score => {
  switch (score) {
    case 0:
      return 'Too weak';
    case 1:
      return 'Very weak';
    case 2:
      return 'Almost there';
    case 3:
      return 'Strong';
    case 4:
      return 'Very strong';
    default:
      return '';
  }
};

/**
 * Returns an interpolated CSS hue value between red & green
 * based on passwordEntropy / targetEntropy ratio
 *
 *   ratio === 0 -> red
 *   ratio  <  1 -> orange
 *   ratio >=  1 -> green
 *
 *   @param {number} ratio passwordEntropy / targetEntropy ratio
 *   @returns {number} interpolated CSS hue value between red & green
 */
function getHue(ratio) {
  // Hues are adapted to match the theme's success and danger colors
  const orangeHue = 50;
  const greenHue = 139;
  const redHue = 11;

  return ratio < 1 ? ratio * orangeHue + redHue : greenHue;
}

/**
 * @component
 * @param {Object} param
 * @param {string} param.password
 */
const PasswordStrengthMeter = ({ password }) => {
  const { isStrong, score, suggestions } = GetPasswordStrength(password);

  let message = mapScoreToMessage(score);
  let color = `hsl(${getHue(score / MaxScore)}, 62%, 55%)`;
  let width = `${((score + 1) / (MaxScore + 1)) * 100}%`;

  if (!password) {
    message = '';
    width = '0%';
  }

  return (
    <Container>
      <BarElem width={width} color={color} />
      <Message color={color}>{message}</Message>
    </Container>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string
};

export default PasswordStrengthMeter;
