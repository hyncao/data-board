import {
  request, apiUrl,
} from 'app/lib/utils';

const uri = apiUrl;

export const getTrade = (date) => request({
  url: `${uri}litevipTrade/${date}`,
  method: 'POST',
})

export const getSummary = (date) => request({
  url: `${uri}litevipSummary/${date}`,
  method: 'POST',
});
