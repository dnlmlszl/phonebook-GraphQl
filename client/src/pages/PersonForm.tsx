import { useState } from 'react';
import { ApolloCache, useMutation } from '@apollo/client';
import {
  AllPersonsResponse,
  Person,
  PersonFormProps,
} from '../interfaces/graphQl';
import { CREATE_PERSON } from '../queries/queries';
import { useNavigate } from 'react-router-dom';
import { updateCache } from '../utils/cacheUtils';

interface CreatePersonInput {
  name: string;
  phone?: string | null;
  street: string;
  city: string;
}

const PersonForm: React.FC<PersonFormProps> = ({ setError }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const navigate = useNavigate();

  const [createPerson, { loading }] = useMutation<
    { addPerson: Person },
    CreatePersonInput
  >(CREATE_PERSON, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      setError(messages);
    },
    update: (cache, response) => {
      const addedPerson = response.data?.addPerson;
      if (addedPerson) {
        updateCache(cache as ApolloCache<AllPersonsResponse>, addedPerson);
      }
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createPerson({
        variables: { name, phone: phone || null, street, city },
      });

      navigate('/');
    } catch (error) {
      console.error('Error when creating person? ', error);
    } finally {
      setName('');
      setPhone('');
      setStreet('');
      setCity('');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="my-8 max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-slate-700 text-center mb-8">
        Create new
      </h2>
      <form onSubmit={submit} className="space-y-6">
        <div className="mt-6 space-y-4">
          Name{' '}
          <input
            value={name}
            className="p-3 w-full border-b-2 border-purple-300 focus:border-purple-500 focus:border-b-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div className="mt-6 space-y-4">
          Phone{' '}
          <input
            value={phone}
            className="p-3 w-full border-b-2 border-purple-300 focus:border-purple-500 focus:border-b-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div className="mt-6 space-y-4">
          Street{' '}
          <input
            value={street}
            className="p-3 w-full border-b-2 border-purple-300 focus:border-purple-500 focus:border-b-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div className="my-6 space-y-4">
          City{' '}
          <input
            value={city}
            className="p-3 w-full border-b-2 border-purple-300 focus:border-purple-500 focus:border-b-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition ease-in-out duration-300"
        >
          Add new
        </button>
      </form>
    </section>
  );
};

export default PersonForm;
