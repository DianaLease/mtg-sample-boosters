import React, { useState, Suspense } from "react";
import './App.css';
import { fetchSetData } from "./api";

// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <>
          {this.props.fallback}
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onTryAgain();
            }}
          >
            Try Again
          </button>
        </>
      )
    }
    return this.props.children;
  }
}

function getRandomSetId(randomInt) {
  const sets = ['eld', 'dom', 'uma', 'ice', 'tmp', 'isd', 'rna']
  return sets[randomInt]
}

const initialResource = fetchSetData(getRandomSetId(Math.floor(Math.random() * Math.floor(6))));

function App() {
  const [resource, setResource] = useState(
    initialResource
  );

  const handleClick = () => {
    setResource(
      fetchSetData(getRandomSetId(Math.floor(Math.random() * Math.floor(6))))
    );
  };

  return (
    <div style={{ margin: '25px'}}>
      <button
        onClick={handleClick}>
        Get random booster pack
      </button>
      <MagicSetPage resource={resource} setResource={handleClick} />
    </div>
  );
}

function MagicSetPage({ resource, setResource }) {
  return (
    <>
    <ErrorBoundary fallback={<h2>Error fetching set.</h2>} onTryAgain={setResource}>
      <Suspense
        fallback={<h2>Loading set...</h2>}
      >
        <SetDetails resource={resource} />
      </Suspense>
    </ErrorBoundary>
    <ErrorBoundary fallback={<h2>Error fetching cards.</h2>} onTryAgain={setResource}>
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
    <div>
      {cards.map(card => (
        card.imageUrl && <img key={card.id} src={card.imageUrl} alt={card.name} style={{ height: '300px', margin: '10px'}}/>
      ))}
    </div>
  );
}

export default App;
