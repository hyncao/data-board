import {
  request, apiUrl,
} from 'app/lib/utils';

const uri = apiUrl;

export const getToken = (data) => request({
  url: `${uri}getToken`,
  method: 'POST',
  data,
})

export const getUserSigningStatus = (data) => request({
  url: `${uri}getUserSigningStatus`,
  method: 'POST',
  data,
});

export const switchPhoneNumber = (data) => request({
  url: `${uri}switchPhoneNumber`,
  method: 'POST',
  data,
})

export const getPackages = () => request({
  url: `${uri}getPackages`,
  method: 'POST',
});

export const getShowPackages = (data) => request({
  url: `${uri}getShowPackages`,
  method: 'POST',
  data,
});

export const createTrade = (data) => request({
  url: `${uri}createTrade`,
  method: 'POST',
  data,
})

export const recordsList = (data) => request({
  url: `${uri}getTradeList`,
  method: 'POST',
  data,
})

export const getSigningUrl = (data) => request({
  url: `${uri}getSigningUrl`,
  method: 'POST',
  data,
})

export const getTradeDetail = (data) => request({
  url: `${uri}getTradeDetail`,
  method: 'POST',
  data,
})

export const sendSkuSmsCode = (data) => request({
  url: `${uri}sendSkuSmsCode`,
  method: 'POST',
  data,
})

export const getAuthorizedLoginUrl = () => request({
  url: `${uri}getAuthorizedLoginUrl`,
  method: 'POST',
})

export const createPayOrderCheck = () => request({
  url: `${uri}createOrderCheck`,
  method: 'POST',
})

export const createPayOrder = () => request({
  url: `${uri}createOrder`,
  method: 'POST',
})

export const getPayInfo = (data) => request({
  url: `${uri}getPayInfo`,
  method: 'POST',
  data,
})

export const getPayInfoByOrderId = (data) => request({
  url: `${uri}getOrderInfo`,
  method: 'POST',
  data,
})

export const appointment = () => request({
  url: `${uri}smsBooking`,
  method: 'POST',
})

export const getFollowStatus = () => request({
  url: `${uri}getFollowStatus`,
  method: 'POST',
})

export const closeTrade = (data) => request({
  url: `${uri}closeTrade`,
  method: 'POST',
  data,
})

export const getGisInfoByIP = () => request({
  url: `${uri}getGisInfoByIP`,
  method: 'POST',
})

export const createCycleOrder = (data) => request({
  url: `${uri}createCycleOrder`,
  method: 'POST',
  data
})

export const checkPreSubmitTrade = (data) => request({
  url: `${uri}checkPreSubmitTrade`,
  method: 'POST',
  data
})

export const getCloseTradeList = (data) => request({
  url: `${uri}getCloseTradeList`,
  method: 'POST',
  data
})