import axios from 'axios';

export function fetchSetData(setId) {
  let setPromise = fetchSet(setId);
  let cardsPromise = fetchCards(setId);
  return {
    setId,
    set: wrapPromise(setPromise),
    cards: wrapPromise(cardsPromise)
  };
}

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project, use a data
// fetching library that integrates with Suspense
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    res => {
      status = "success";
      result = res;
    },
    error => {
      status = "error";
      result = error;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

export function fetchSet(setId) {
  console.log(`fetching set details for ${setId}`);
  return axios.get(`https://api.magicthegathering.io/v1/sets/${setId}`)
    .then(res => {
      if (res.status > 299 || res.status < 200) throw res.statusText;
      return res.data.set
    })
    .catch(err => Promise.reject(err));
}


export function fetchCards(setId) {
  console.log(`fetching cards for ${setId}`);
  return axios.get(`https://api.magicthegathering.io/v1/sets/${setId}/booster`)
    .then(res => {
      if (res.status > 299 || res.status < 200) throw res.statusText;
      return res.data.cards
    })
    .catch(err => Promise.reject(err));
}
