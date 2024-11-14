import axios from '../config/axios';

export const getMetrics = async (campaignId) => {
  const body = (
    await axios.get(process.env.TWITTER_BASEURL + '/performance', {
      headers: {
        Authorization: process.env.TWITTER_TOKEN,
      },
      params: { campaignId },
    })
  ).data;
  return body;
};
