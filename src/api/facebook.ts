import axios from '../config/axios';

const FB_API_URL = 'https://graph.facebook.com/v21.0';
const { FB_ACCESS_TOKEN, FB_AD_ACCOUNT_ID } = process.env;

const headers = {
    access_token: FB_ACCESS_TOKEN,
};
console.log(FB_ACCESS_TOKEN, FB_AD_ACCOUNT_ID, headers)

export const getCampaigns = async () => {
    const body = (
        await axios.get(
            `${FB_API_URL}/${FB_AD_ACCOUNT_ID}/campaigns`,
            { headers }
        )
    ).data;
    return body;
};

export const createCampaign = async (campaignData) => {
    const body = (
        await axios.post(
            `${FB_API_URL}/${FB_AD_ACCOUNT_ID}/campaigns`,
            {
                name: campaignData.title,
                status: campaignData.status || 'PAUSED',
                objective: campaignData.objective || 'LINK_CLICKS',
                special_ad_categories: campaignData.special_ad_categories || [],
            },
            { headers }
        )
    );
    return body;
};

export const getCampaignInsights = async (campaignId) => {
    const body = (
        await axios.get(
            `${FB_API_URL}/${campaignId}/insights`,
            { headers }
        )
    ).data;
    return body;
};

