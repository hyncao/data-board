import {
  Toast
} from 'antd-mobile';
import dict from 'app/lib/dict';
import axios from 'axios';

// TODO 打包前需要先核对这里
// secondUrl 默认为'/', 测试服务器则为-test/
export const secondUrl = '/';
// export const secondUrl = '-test/';

export const connectSymbol = '-';

export const apiUrl = `/litevip-async/db/`;
export const preUrl = `/data${connectSymbol}board${secondUrl}`;

// export const appUrl = `https://litevip.jujienet.com${preUrl}`;

// 延迟
export const delay = (t) => new Promise(res => setTimeout(res, t));

// 取url中参数
export const getUrlQuery = (name) => {
  if ((typeof name).toLowerCase() !== 'string') {
    console.error('name参数应该为string');
  }
  const search = window.location.search.substr(1);
  const query = search.split('&');
  let result;
  for (let i = 0; i < query.length; i += 1) {
    if (query[i].indexOf(`${name}=`) > -1) {
      const arr = query[i].split(`${name}=`);
      ([, result] = arr);
      break;
    }
  }
  if (result) return result;
  return '';
};

export const getLS = (key) => {
  const ls = window.localStorage;
  if (ls.getItem(key)) {
    return ls.getItem(key);
  }
  return '';
};

export const setLS = (key, value) => {
  const ls = window.localStorage;
  ls.setItem(key, value);
};

export const removeLS = (key) => {
  const ls = window.localStorage;
  ls.removeItem(key);
};

/**
 * antd提示信息
 * @param type 提示类型，info, loading, success, fail, offline
 * @param content 提示文字
 * @param mask 是否遮罩
 * @param duration 提示关闭延迟，单位"秒"
 * @param onClose 关闭回调
 */
export const tips = (content, type = 'info', duration = 2, mask = true, onClose) => {
  Toast.hide();
  Toast[type](content, duration, onClose, mask);
};

export const hideTips = () => Toast.hide();

// 设置支付宝右上角按钮
export const setOptionMenu = (text, callback) => {
  const {
    AlipayJSBridge
  } = window;
  try {
    AlipayJSBridge.call('showOptionMenu');
    AlipayJSBridge.call('setOptionMenu', {
      title: text,
      redDot: '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
    });
    document.addEventListener('optionMenu', callback);
  } catch (e) {}
};

export const injectHistory = (props) => {
  const {
    history,
    historyStore: {
      setHistory
    }
  } = props;
  setHistory(history);
}

export const jumpUrl = (url, history) => {
  try {
    window.AlipayJSBridge.call('pushWindow', {
      url
    });
  } catch (e) {
    if (history) {
      history.push(url);
    } else {
      window.location.href = url;
    }
  }
}

axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response.data;
  // if (response.data.code === 200) {
  //   return response.data;
  // } else if (response.data.code === 4001) {
  //   // token过期
  //   const cnEnterId = getLS('cnEnterId');
  //   window.location.replace(`https://litevip.jujienet.com/litevip/index/${cnEnterId}`);
  //   return false;
  // } else {
  //   tips(response.data.msg, 'fail');
  //   return false;
  // }
}, error => {
  // 对响应错误做点什么
  if (!error.response) {
    tips('网络异常', 'fail');
    return;
  }
  const {
    status
  } = error.response
  let text = '网络异常请重试';
  if (status === 403) {
    text = '接口拒绝访问';
  }
  if (status === 400) {
    text = '接口参数错误';
  }
  if (status === 404) {
    text = '接口地址不存在';
  }
  tips(text, 'fail');
  return false;
});

export const request = ({
  url,
  method = 'GET',
  data
}) => axios({
  method,
  url,
  data: {
    ...data,
    t: Math.random(),
  },
  headers: {
    'api_code': '50ecaf2e6cdc72247f307799c0fc6cd5',
    'token': getLS('token'),
  },
});

export const dateFormat = (date) => {
  if (!date) {
    return null;
  }
  const t = new Date(date);

  function addZero(t) {
    let num = t;
    if (num.toString().length === 1) {
      num = `0${t}`;
    }
    return num;
  }
  const str = `${t.getFullYear()}-${addZero(t.getMonth() + 1)}-${addZero(t.getDate())}`;
  return str;
}

export const timeFormat = (date) => {
  if (!date) {
    return null;
  }
  const t = new Date(date);

  function addZero(t) {
    let num = t;
    if (num.toString().length === 1) {
      num = `0${t}`;
    }
    return num;
  }
  const str = `${t.getFullYear()}-${addZero(t.getMonth() + 1)}-${addZero(t.getDate())} ${addZero(t.getHours())}:${addZero(t.getMinutes())}`;
  return str;
}

// 根据operatorCode返回轻会员或者轻会员
export const getTitle = () => {
  return '数据看板';
}

/**
 * 
 * @param {*String} startStr yyyy/mm/dd hh:mm:ss
 * @param {*String} endStr yyyy/mm/dd hh:mm:ss
 */
export const isActivity = (startStr, endStr) => {
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  const now = new Date().getTime();
  return (now > start && now < end);
}

export const showComponent = ({
  transitionStore: {
    didLoad
  }
}) => didLoad();

/**
 * cnzz埋点
 * 至少传两个参数
 */
export const czc = (...rest) => {
  if(rest.length < 2) {
    console.log('czc方法参数不能少于2个');
    return;
  }
  window._czc.push(['_trackEvent', ...rest]);
}

// 判断是否跳到0.68元权益页面
export const judgeJumpToLifeGift = ({ showPackageList }) => {
  const { sendSms } = showPackageList[0];
  return !sendSms;
}

export const getOperatorName = (operatorCode) => {
  operatorCode = operatorCode + '';
  switch(operatorCode) {
    case dict.CMCC + '': return '移动';
    case dict.CUCC + '': return '联通';
    case dict.CTCC + '': return '电信';
    case dict.WASU + '': return '华数';
    default: return '';
  }
}

// 返回 28 - 31 中的值
export const getMonthLastDay = (year, month) => {
  if (year && month) {
    return new Date(year, month, 0).getDate();
  } else {
    return -1;
  }
}
export const getThisMonthLastDay = () => {
  let d = new Date();
  return getMonthLastDay(d.getFullYear(), d.getMonth() + 1);
}

/**
 * 轮询拦截器，返回一个包装后的方法，使该方法具备一些拦截功能：
 * 1. 在触发下一次轮询时，若上一次请求未完成，则忽略该次请求
 * 2. 在超过轮询次数上限时，触发失败回调，并不进行请求
 * 使用：
 * 可调用该方法返回一个包装后的函数packedFunction
 * 在setInterval循环调用packedFunction
 * 在successCb和errorCb中判断情况结束轮询(clearInterval);
 * @param {Context} context - 上下文
 * @param {Promise} fn - 请求方法
 * @param {Number} count - 允许的最大请求次数
 * @returns {Function} (successCb, errorCb, ...args) => undefined
 * ...args 是注入到请求方法中的参数
 */
export const loopRequestInterceptor = (context, fn, count) => {
  let isRequesting = false;
  let requestCount = 0;
  fn.bind(context);
  return (successCb, errorCb, ...args) => {
    if (isRequesting) {
      return;
    }
    requestCount += 1;
    if (requestCount > count) {
      errorCb.call(context, '超过最大查询次数');
      return;
    }
    isRequesting = true;
    fn(...args).then(res => {
      isRequesting = false;
      successCb.call(context, res);
    }, err => {
      console.log(err);
      isRequesting = false;
      errorCb.call(context, err);
    });
  }
}

export const showCountBox = () => {
  const showCountFlag = getLS('showCountFlag');
  return showCountFlag === 'y';
}