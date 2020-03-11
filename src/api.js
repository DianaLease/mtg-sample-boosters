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
// Don't copy-paste this into your project!
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    res => {
      console.log('res --- ', res);
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
  return fetch(`https://api.magicthegathering.io/v1/sets/${setId}`)
    .then(res => res.json())
    .catch(err => console.log('error - ', err));
}


export function fetchCards(setId) {
  console.log(`fetching cards for ${setId}`);
  return fetch(`https://api.magicthegathering.io/v1/sets/${setId}/booster`)
    .then(res => res.json())
    .catch(err => console.log('error - ', err));
}
