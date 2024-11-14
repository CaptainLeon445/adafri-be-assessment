import { Request } from 'express';
import RequestIP from 'request-ip';
import { v4 as uuidv4 } from 'uuid';
import geoip from 'geoip-lite';
import { toZonedTime } from 'date-fns-tz';
import { PaginationObject } from '../types';
import { AccessAttributes } from '../models/access.models';


export const getUserAgentHeader = (req: Request) => req.headers['user-agent'];

export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const genRandomStr = () => {
  const randomStr = uuidv4().slice(0, 12).split('-').join('');
  return randomStr;
};

const genAccessKeys = (mode: string, role: string) => {
  return `${process.env.AUTH_BASE_KEY}_${mode}_${role}_${genRandomStr()}`
}

export const getAccessKeysPayload = (): AccessAttributes => {
  return {
    live_admin_key: genAccessKeys('live', 'admn'),
    live_user_key: genAccessKeys('live', 'usr'),
    test_admin_key: genAccessKeys('test', 'admn'),
    test_user_key: genAccessKeys('live', 'usr'),
  }
}

export const pagination = (req: Request): PaginationObject => {
  const { offset = 1, limit = 50 } = req.query;

  let parsedPerPage: number = typeof limit === 'string' ? parseInt(limit) : (limit as number);
  if (isNaN(parsedPerPage)) {
    parsedPerPage = 50;
  }

  let parsedPage: number = typeof offset === 'string' ? parseInt(offset) : (offset as number);
  if (isNaN(parsedPage)) {
    parsedPage = 1;
  }
  const paginate = {
    offset: (parsedPage - 1) * parsedPerPage,
    limit: parsedPerPage,
  };
  return paginate;
};

export const removeWhiteSpace = (word: string): string | undefined => {
  if (!word) return;
  return word.replace(/\s+/g, '');
};

export const trimAndLowerCase = (word: string): string => {
  if (!word) return '';
  return word.trim().toLowerCase();
};

export const getPublicAddress = (req: Request): string => {
  const xForwardedFor = req.header('x-forwarded-for');
  const ip =
    (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
    RequestIP.getClientIp(req) ||
    req.ips[0] ||
    req.ip;
  if (!ip) return '';
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:')) {
    return 'localhost';
  }
  return ip;
};

export const currentTimestamp = (req: Request) => {
  const ip = req.ip || '0.0.0.0'; // Replace with a default IP if needed
  const geo = geoip.lookup(ip);
  const userTimezone = geo?.timezone || 'UTC';
  const utcDate = new Date(); // Current time in UTC
  const zonedDate = toZonedTime(utcDate, userTimezone);
  return zonedDate;
};

export const getUpdatedFields = <T extends object>(
  existingData: T,
  updatedData: Partial<T>
): Partial<T> =>
  Object.fromEntries(
    Object.entries(updatedData).filter(([key, value]) => existingData[key as keyof T] !== value)
  ) as Partial<T>;
