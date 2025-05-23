import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SearchPage from './components/pages/SearchPage';
import NotFoundPage from './components/pages/NotFoundPage';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;