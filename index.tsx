import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Import i18n configuration
import LoadingSpinner from './components/LoadingSpinner';
import { initializeConfig } from './services/configService';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const FullScreenLoader: React.FC<{ message?: string }> = ({ message }) => (
    <div className="h-screen w-full flex items-center justify-center bg-dark-bg">
        <div className="text-center">
            <LoadingSpinner />
            {message && <p className="mt-2 text-dark-text-secondary">{message}</p>}
        </div>
    </div>
);

const root = ReactDOM.createRoot(rootElement);

// Initial render with a loader while fetching configuration
root.render(<FullScreenLoader message="Loading configuration..." />);

initializeConfig()
  .then(() => {
    // Once the configuration is successfully loaded, render the main application.
    root.render(
      <React.StrictMode>
        <Suspense fallback={<FullScreenLoader message="Loading translations..." />}>
          <App />
        </Suspense>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    // If configuration fails to load, display a clear error message.
    console.error("Failed to initialize application:", error);
    root.render(
        <div className="h-screen w-full flex flex-col items-center justify-center bg-dark-bg text-red-500 p-4 text-center">
            <h1 className="text-xl font-bold">Application Error</h1>
            <p className="mt-2 max-w-md">{error.message}</p>
        </div>
    );
  });
