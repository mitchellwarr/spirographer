export const eventDidBlur = ({ currentTarget, relatedTarget }) => {
  let needsIESupport = !relatedTarget;
  if (needsIESupport) relatedTarget = document.activeElement;

  return !(
    currentTarget == relatedTarget || currentTarget.contains(relatedTarget)
  );
};

const idCounter = {};
export const makeRandomID = (prefix = '') => {
  if (!idCounter[prefix]) idCounter[prefix] = 0;
  const id = ++idCounter[prefix];
  return `${prefix}${id}`;
};

export const SPRING_CONFIG_150 = {
  friction: 167.55160819145564,
  tension: 7018.385351885767,
};

export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const arraySwapIndex = (arr, o, n) => {
  let x = arr.slice();
  x.splice(n < 0 ? x.length + n : n, 0, x.splice(o, 1)[0]);
  return x;
};

export const isAsyncFunction = (functionToCheck) =>
  functionToCheck &&
  {}.toString.call(functionToCheck) === '[object AsyncFunction]';
export const isFunction = (functionToCheck) =>
  functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
export const isObject = (obj) =>
  obj && {}.toString.call(obj) === '[object Object]';
export const isArray = (arr) =>
  arr && {}.toString.call(arr) === '[object Array]';
export const isString = (str) =>
  str && {}.toString.call(str) === '[object String]';
export const isNumber = (value) => /^-?\d+\.?\d*$/.test(value);

export const humanize = (text, { capital = 'sentence' } = {}) => {
  text = String(text || '')
    .trim()
    .replace(/_/g, ' ')
    .replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
  if (text.length == 0) return text;
  switch (capital) {
    case 'sentence':
      return text[0].toUpperCase() + text.slice(1).toLowerCase();
    case 'title':
      return text
        .split(/ +/g)
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    case 'capital':
      return text.toUpperCase();
  }
  return text;
};

export const listFormat = (stringCollection) => {
  if (!stringCollection) return '';
  let last = '';
  if (stringCollection.length > 1) {
    last = ` and ${stringCollection.pop()}`;
  }
  return stringCollection.join(', ') + last;
};

export const convertServerErrorsToMap = (errors = []) => {
  return errors
    .map(({ attribute: key, errors, type }) => {
      const value = () => {
        if (type == 'nested_attributes') return errors;
        if (isString(errors[0])) return errors[0];
        return convertServerErrorsToMap(errors);
      };
      return { [key]: value() };
    })
    .reduce((total, field) => ({ ...total, ...field }), {});
};

const recursivelyAssign = (val, func, checkFunc) => {
  val = checkFunc(val);
  if (isObject(val)) val = func(val);
  if (isArray(val))
    val = val.map((item) => recursivelyAssign(item, func, checkFunc));
  return val;
};

export const undefinedToNull = (obj) => {
  obj = { ...obj };
  Object.keys(obj).forEach(
    (key) =>
      (obj[key] = recursivelyAssign(obj[key], undefinedToNull, (val) =>
        val === undefined ? null : val))
  );
  return obj;
};

export const nullToUndefined = (obj) => {
  obj = { ...obj };
  Object.keys(obj).forEach(
    (key) =>
      (obj[key] = recursivelyAssign(obj[key], nullToUndefined, (val) =>
        val === null ? undefined : val))
  );
  return obj;
};

export const resolveChildren = (children, defaultArgs, elseReturn) => {
  if (isFunction(children)) return children(defaultArgs);
  if (elseReturn) return elseReturn();
  return children;
};

export const setLocationHash = (value) => {
  if (value == (window.location.hash || '').replace('#', '') || '') return;
  history.replaceState('', '', `#${value}`);
  window.dispatchEvent(new Event('hashchange'));
};

export const copyToClipboard = (text) => {
  if (window.clipboardData && window.clipboardData.setData)
    return clipboardData.setData('Text', text); // Useful for IE
  let textArea = document.createElement('textarea');
  //Stops textarea from appearing
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let successful = false;
  // TODO: Change to toast
  try {
    successful = document.execCommand('copy');
    if (!successful) console.warn(`Cannot copy to clipboard ${text}`); // eslint-disable-line no-console
  } catch (err) {
    console.warn(`Cannot copy to clipboard ${text}`); // eslint-disable-line no-console
  }
  document.body.removeChild(textArea);
  return successful;
};

// window.copyToClipboard = copyToClipboard;

export const locationInApp = () =>
  location.pathname + location.search + location.hash;

export const deepMerge = (existing = {}, priority = {}) => ({
  ...existing,
  ...priority,
  ...Object.keys(existing)
    .filter((key) => Object.prototype.hasOwnProperty.call(priority, key))
    .reduce((obj, key) => {
      let value = priority[key];
      if (isObject(value)) value = { ...deepMerge(existing[key], value) };
      return {
        ...obj,
        [key]: value,
      };
    }, {}),
});
