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
  const sets = ['eld', 'dom', 'uma', 'ice', 'tmp', 'isd', 'rna']
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
    <ErrorBoundary fallback={<h2>Error fetching set.</h2>}>
      <Suspense
        fallback={<h2>Loading set...</h2>}
      >
        <SetDetails resource={resource} />
      </Suspense>
    </ErrorBoundary>
    <ErrorBoundary fallback={<h2>Error fetching cards.</h2>}>
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
  const set = resource.set.read();
  return (
  <>
  <h2>Set Name: {set.name}</h2>
  <h3>Release Date: {set.releaseDate}</h3>
  </>
  );
}

function ExampleBooster({ resource }) {
  const cards = resource.cards.read();
  return (
    <ul>
      {cards.map(card => (
        <img key={card.id} src={card.imageUrl} alt={card.name} style={{ height: '200px', margin: '10px'}}/>
      ))}
    </ul>
  );
}

export default App;
