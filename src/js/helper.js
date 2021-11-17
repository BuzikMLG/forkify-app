import { TIMEOUT_CONST } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 *
 * @param {*} url
 * @param {*} uploadData
 * @returns
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_CONST)]);
    const formattedData = await res.json();
    if (!res.ok) throw new Error(formattedData.message);
    return formattedData.data;
  } catch (e) {
    throw e;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_CONST)]);
//     const formattedData = await res.json();
//     console.log(formattedData);
//     if (!res.ok) throw new Error(formattedData.message);
//     return formattedData.data;
//   } catch (e) {
//     throw e;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     console.log(uploadData);
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_CONST)]);
//     const formattedData = await res.json();
//     if (!res.ok) throw new Error(formattedData.message);
//     return formattedData.data;
//   } catch (e) {
//     throw e;
//   }
// };
