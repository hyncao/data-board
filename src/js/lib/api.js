import { request } from './utils';

// 测试授权
export const test = () => request({ url: 'broadband/account/tourist/authorize'})