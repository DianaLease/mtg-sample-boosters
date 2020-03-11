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
      status = res && !res.error ? "success" : "error";
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
    .then(res => res.data.set)
    .catch(err => console.log('error - ', err));
}


export function fetchCards(setId) {
  console.log(`fetching cards for ${setId}`);
  return axios.get(`https://api.magicthegathering.io/v1/sets/${setId}/booster`)
    .then(res => res.data.cards)
    .catch(err => console.log('error - ', err));
}
