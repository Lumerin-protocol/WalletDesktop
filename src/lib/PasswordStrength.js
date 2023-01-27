import { zxcvbn } from 'zxcvbn3';

export const MaxScore = 4;

/**
 * Returns password strength data
 * @param {string} password password to test
 * @returns {ScoreResult}
 *
 * @typedef {Object} ScoreResult
 * @property {number} score from 0 to 4
 * @property {boolean} isStrong true for strong password
 * @property {string[]} suggestions array of password suggestions
 */
export const GetPasswordStrength = password => {
  if (!password) {
    password = '';
  }
  const data = zxcvbn(password);
  return {
    score: data.score,
    suggestions: data.suggestions,
    isStrong: data.score === MaxScore
  };
};

export const IsPasswordStrong = password =>
  GetPasswordStrength(password).isStrong;
