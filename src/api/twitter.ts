import axios from '../config/axios';

export const getMetrics = async (campaignId:string) => {
  const body = (
    await axios.get(process.env.TWITTER_BASEURL + '/performance', {
      headers: {
        Authorization: process.env.TWITTER_TOKEN,
      },
      params: {campaignId}
    })
  ).data;
  return body;
};