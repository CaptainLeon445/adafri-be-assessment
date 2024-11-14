import axios from 'axios';
import { FacebookAdPayload } from '../types';

// import axios from '../config/axios';

const { FB_ACCESS_TOKEN, FB_AD_ACCOUNT_ID, FACEBOOK_BASE_URL } = process.env;

const headers = {
  access_token: FB_ACCESS_TOKEN,
};

const requestPayload = (data: { [key: string]: any }): FacebookAdPayload => {
  const payload: FacebookAdPayload = {};
  if (data.budget !== undefined) payload.daily_budget = data.budget;
  if (data.title !== undefined) payload.name = data.title;
  if (data.startDate !== undefined) payload.start_time = data.startDate;
  if (data.endDate !== undefined) payload.stop_time = data.endDate;
  if (data.status !== undefined) payload.status = data.status;
  return payload;
};

export const getCampaigns = async () => {
  try {
    const body = (
      await axios.get(
        `${FACEBOOK_BASE_URL}/${FB_AD_ACCOUNT_ID}/campaigns?fields=id,name, daily_budget, budget_remaining, start_time, stop_time, status`,
        { headers }
      )
    ).data;
    return body;
  } catch (error) {
    return null;
  }
};

export const createCampaign = async (campaignData) => {
  try {
    const payload: FacebookAdPayload = requestPayload(campaignData);
    const body = (
      await axios.post(
        `${FACEBOOK_BASE_URL}/${FB_AD_ACCOUNT_ID}/campaigns`,
        {
          ...payload,
          objective: 'LINK_CLICKS',
          special_ad_categories: [],
        },
        { headers }
      )
    ).data;
    return body;
  } catch (error) {
    return null;
  }
};

export const getCampaignInsights = async (campaignId) => {
  try {
    const body = (await axios.get(`${FACEBOOK_BASE_URL}/${campaignId}/insights`, { headers })).data;
    return body;
  } catch (error) {
    return null;
  }
};

export const updateCampaign = async (campaignId, data) => {
  try {
    const payload: FacebookAdPayload = requestPayload(data);
    const body = (
      await axios.post(
        `${FACEBOOK_BASE_URL}/${campaignId}`,
        {
          ...payload,
          objective: 'LINK_CLICKS',
          special_ad_categories: [],
        },
        { headers }
      )
    ).data;
    return body;
  } catch (error) {
    return null;
  }
};

export const deleteCampaign = async (campaignId) => {
  try {
    await axios.delete(`${FACEBOOK_BASE_URL}/${campaignId}`, { headers });
  } catch (error) {
    return null;
  }
};
