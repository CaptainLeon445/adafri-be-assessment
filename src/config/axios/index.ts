import axios from 'axios';
import logger from '../../utilities/logger';

axios.interceptors.request.use(
  async (config) => {
    logger.info(
      `Request: ${config.method?.toUpperCase()} ${config.url}`,
      JSON.stringify(config.data)
    );
    return config;
  },
  (error) => {
    logger.error(`Request Error: ${error.message}`);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    logger.info('Response:', JSON.stringify(response.data));
    return response;
  },
  (error) => {
    console.log("here")
    // if (error.response) {
    //   logger.error('Response Error:', JSON.stringify(error.response.data));
    //   return Promise.reject(error.response);
    // }
    // logger.error('Unknown Error:', error.message);
    // return Promise.reject(error);
  }
);

export default axios;
