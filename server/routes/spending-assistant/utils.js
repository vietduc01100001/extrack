const parseCostsToArray = costsString => costsString
  .replace(/\s+/g, '')
  .replace(/,+/g, ',')
  .split(',')
  .map(c => c.replace(/\D+/g, ''))
  .map(c => parseInt(c));

const getFormatDate = (dateString, options) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options)
};

module.exports = {
  parseCostsToArray,
  getFormatDate,
};
