const redis = require('redis');
const { promisifyAll } = require('bluebird');

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('connect', () => console.log('Redis connected'));
client.on('error', err => console.log(err));

module.exports = promisifyAll(client);
