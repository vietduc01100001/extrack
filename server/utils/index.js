const Redis = require('../redis');
const axios = require('../axios');

exports.isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

exports.toString = (obj) => {
  let str = '';
  Object.values(obj).forEach(val => str += `${val} `);
  return str;
};

exports.toTitleCase = (str) => {
  const strArr = str.split(' ');
  return strArr.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
};

exports.toStringMonth = (month) => {
  month = parseInt(month);
  if (month === 1) return 'January';
  if (month === 2) return 'February';
  if (month === 3) return 'March';
  if (month === 4) return 'April';
  if (month === 5) return 'May';
  if (month === 6) return 'June';
  if (month === 7) return 'July';
  if (month === 8) return 'August';
  if (month === 9) return 'September';
  if (month === 10) return 'October';
  if (month === 11) return 'November';
  if (month === 12) return 'December';
};

exports.getFormatDate = (dateString, options) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options)
};

exports.parseCostsToArray = costsString => costsString
  .replace(/\s+/g, '')
  .replace(/,+/g, ',')
  .split(',')
  .map(c => c.replace(/\D+/g, ''))
  .map(c => parseInt(c));

exports.getCache = async (key, data, ttl) => {
  const cache = JSON.parse(await Redis.getAsync(key));
  if (cache) {
    data.response = { status: 200, data: cache };
  } else {
    data.response = await axios.getInstance().get(key);
    const expiresIn = ttl || parseInt(process.env.CACHE_TTL);
    Redis.setex(key, expiresIn, JSON.stringify(data.response.data));
  }
};

exports.deleteCache = key => Redis.del(key);
