const Redis = require('../../redis');
const axios = require('../../axios');

const getCache = async (key, data, ttl) => {
  const cache = JSON.parse(await Redis.getAsync(key));
  if (cache) {
    data.response = { status: 200, data: cache };
  } else {
    data.response = await axios.getInstance().get(key);
    const expiresIn = ttl || parseInt(process.env.CACHE_TTL);
    Redis.setex(key, expiresIn, JSON.stringify(data.response.data));
  }
};

const deleteCache = key => Redis.del(key);

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
  getCache,
  deleteCache,
  parseCostsToArray,
  getFormatDate,
};
