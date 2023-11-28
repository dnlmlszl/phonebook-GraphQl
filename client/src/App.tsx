import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import { ApolloCache, useQuery, useSubscription } from '@apollo/client';
import { AllPersonsResponse, Person } from './interfaces/graphQl';
import { ALL_PERSONS, PERSON_ADDED } from './queries/queries';
import Persons from './pages/Persons';
import PersonForm from './pages/PersonForm';
import PhoneForm from './pages/PhoneForm';
import Login from './pages/Login';
import PrivateRoute from './pages/PrivateRoute';
import Notify from './components/Notify';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import { updateCache } from './utils/cacheUtils';



const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, loading } = useQuery<AllPersonsResponse>(ALL_PERSONS, {
    pollInterval: 2000,
  });

  useSubscription<{ personAdded: Person }>(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData, client }) => {
      console.log('Subscription data: ', subscriptionData);
      if (subscriptionData.data) {
        const addedPerson = subscriptionData.data.personAdded;
        notify(`${addedPerson.name} added`);
        updateCache(
          client.cache as ApolloCache<AllPersonsResponse>,
          addedPerson
        );
      }
    },
  });

  if (!data) return <div>No data</div>;

  const persons = data.allPersons;

  if (loading) {
    return <div>loading...</div>;
  }

  if (!Array.isArray(persons)) {
    return <div>Error: Data is not an array of persons</div>;
  }

  const notify = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <main className="bg-purple-50 p-10 space-y-8 min-h-screen">
      <Router>
        <Navbar />
        {errorMessage && <Notify errorMessage={errorMessage} />}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Persons persons={data.allPersons} />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <PersonForm setError={notify} />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit"
            element={
              <PrivateRoute>
                <PhoneForm setError={notify} />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login setError={notify} />} />
          <Route path="/register" element={<Register setError={notify} />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
