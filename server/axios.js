const axios = require('axios');

const instances = [];

const getAuthToken = () => axios
  .post('/auth', {
    username: process.env.SP_SERVER_USERNAME,
    password: process.env.SP_SERVER_PASSWORD
  }, {
    baseURL: process.env.SP_SERVER_URL,
    headers: { 'Content-Type': 'application/json' }
  })
  .then((res) => {
    if (res.status !== 200) return false;
    return res.data.token;
  })
  .catch(err => {
    console.log(err.message);
    return false;
  });

const createInstance = async () => {
  let token;
  while (!token) {
    console.log('getting token from spending-assistant-server...');
    token = await getAuthToken();
  }
  console.log('retrieved token from spending-assistant-server');
  instances.push(axios.create({
    baseURL: process.env.SP_SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': process.env.ORIGIN,
    },
  }));
};

module.exports = {
  init: createInstance,
  getInstance: () => instances[0],
};
