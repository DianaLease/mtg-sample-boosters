import React, { useState, Suspense } from "react";
import './App.css';
import { fetchSetData } from "./api";

// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function getRandomSetId() {
  const sets = ['eld', 'dom', 'uma', 'ice', 'tmp']
  return sets[Math.floor(Math.random() * Math.floor(4))]
}

const initialResource = fetchSetData(getRandomSetId());

function App() {
  const [resource, setResource] = useState(
    initialResource
  );
  return (
    <>
      <button
        onClick={() => {
          setResource(
            fetchSetData(getRandomSetId())
          );
        }}
      >
        Next
      </button>
      <MagicSetPage resource={resource} />
    </>
  );
}

function MagicSetPage({ resource }) {
  return (
    <>
    <ErrorBoundary fallback={<h2>Error fetching.</h2>}>
      <Suspense
        fallback={<h2>Loading set...</h2>}
      >
        <SetDetails resource={resource} />
      </Suspense>
      <Suspense
        fallback={<h2>Loading cards...</h2>}
      >
        <ExampleBooster resource={resource} />
      </Suspense>
      </ErrorBoundary>
    </>
  );
}

function SetDetails({ resource }) {
  const setData = resource.set.read();
  return <h1>{setData.set.name}</h1>;
}

function ExampleBooster({ resource }) {
  const cardsData = resource.cards.read();
  return (
    <ul>
      {cardsData.cards.map(card => (
        <img src={card.imageUrl} alt={card.name} />
      ))}
    </ul>
  );
}

export default App;
