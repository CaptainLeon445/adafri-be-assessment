import { NextFunction, Request, Response } from 'express';
import os from 'os';
import { currentTimestamp, getPublicAddress, getUserAgentHeader } from '../../utilities/global.utilities';
import { format } from 'date-fns';
import geoip from 'geoip-lite';

const captureDeviceDetails = (req: Request) => {
  const device = getUserAgentHeader(req) || 'Unknown';
  const ip = getPublicAddress(req) || 'Unknown';
  const geo = geoip.lookup(ip);
  const timezone = geo?.timezone || 'UTC';
  const time = format(currentTimestamp(req), 'yyyy-MM-dd HH:mm:ssXXX');
  const deviceDetails = {
    ip,
    device,
    browser:
      RegExp(/(Firefox|Chrome|Safari|Opera|MSIE|Trident)/i).exec(device)?.[0] || 'Unknown',
    os: RegExp(/\(([^)]+)\)/).exec(device)?.[1] || 'Unknown',
    timezone,
    time
  };
  return { deviceDetails };
};


export const logResponse = (req: Request) => {
  const { deviceDetails } = captureDeviceDetails(req);
  const { ip, device, browser, os: userOS } = deviceDetails;

  const createdAt = currentTimestamp(req);

  const method = req.method;
  const url = req.originalUrl;

  const body = req.body;
  const host = req.hostname;

  const serverIp = req.ip
  const serverName = os.hostname();
  const platform = os.platform();
  const serverMemory = os.totalmem();
  const cpuCount = os.cpus().length;
  const user = req.user;
  let userInfo = {};
  if (user) {
    userInfo = { ...user };
  } else {
    userInfo['anonymous'] = true;
  }
  const userDetails = {
    ...userInfo,
    ip,
    device,
    browser,
    os: userOS,
  };
  const request = {
    host,
    method,
    url,
    body,
  };
  const server = {
    name: serverName,
    platform,
    memory: serverMemory,
    cpuCount,
    ip: serverIp,
    server_time: new Date()
  };

  const logResponse = { server, request, userDetails, createdAt };
  return { ...logResponse };
};

export const captureAppDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const device_details = captureDeviceDetails(req);
  const logRes = logResponse(req);
  res.locals = { ...device_details, log_response: logRes };
  next();
};
