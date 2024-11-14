import axios from "axios";
import { NextFunction } from "express";

// import axios from '../config/axios';

const { FB_ACCESS_TOKEN, FB_AD_ACCOUNT_ID, FACEBOOK_BASE_URL } = process.env;

const headers = {
    access_token: FB_ACCESS_TOKEN,
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
        return null
    }
};

export const createCampaign = async (campaignData) => {
    try {
        const body = (
            await axios.post(
                `${FACEBOOK_BASE_URL}/${FB_AD_ACCOUNT_ID}/campaigns`,
                {
                    name: campaignData.title,
                    status: campaignData.status || 'PAUSED',
                    objective: campaignData.objective || 'LINK_CLICKS',
                    special_ad_categories: campaignData.special_ad_categories || [],
                },
                { headers }
            )
        ).data;
        return body;

    } catch (error) {
        return null
    }
};

export const getCampaignInsights = async (campaignId) => {
    try {
        const body = (
            await axios.get(
                `${FACEBOOK_BASE_URL}/${campaignId}/insights`,
                { headers }
            )
        ).data;
        return body;
    } catch (error) {
        return null
    }
};

