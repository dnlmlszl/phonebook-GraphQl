import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_PERSONS, EDIT_NUMBER } from '../queries/queries';
import { Person, PersonFormProps } from '../interfaces/graphQl';
import { useNavigate } from 'react-router-dom';

interface EditNumberInput {
  name: string;
  phone?: string | null;
}

interface AllPersonsResponse {
  allPersons: Person[];
}

interface EditNumberResponse {
  editNumber: Person;
}

const PhoneForm: React.FC<PersonFormProps> = ({ setError }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const navigate = useNavigate();

  const [changeNumber, result] = useMutation<
    EditNumberResponse,
    EditNumberInput
  >(EDIT_NUMBER, {
    // refetchQueries: [{ query: ALL_PERSONS }],
    update: (cache, mutationResult) => {
      const editNumber = mutationResult.data?.editNumber;
      const existingPersons = cache.readQuery<AllPersonsResponse>({
        query: ALL_PERSONS,
      });
      if (editNumber && existingPersons) {
        cache.writeQuery<AllPersonsResponse>({
          query: ALL_PERSONS,
          data: {
            allPersons: existingPersons.allPersons.map((person) =>
              person.name === editNumber.name
                ? { ...person, phone: editNumber.phone }
                : person
            ),
          },
        });
      }
    },
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      setError(messages);
    },
  });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      changeNumber({ variables: { name, phone: phone || null } });
      navigate('/');
    } catch (error) {
      console.error('Error when updating a number', error);
    } finally {
      setName('');
      setPhone('');
    }
  };

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('Person not found');
    }
    if (result.error) {
      setError(result.error.graphQLErrors.map((e) => e.message).join('\n'));
    }
  }, [result.data, setError, result.error]);

  if (result.loading) return <div>Loading...</div>;

  return (
    <section className="my-8 max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-slate-700 text-center mb-8">
        Change number
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
        <div className="my-6 space-y-4">
          Phone{' '}
          <input
            value={phone}
            className="p-3 w-full border-b-2 border-purple-300 focus:border-purple-500 focus:border-b-0 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition ease-in-out duration-300"
        >
          Change number
        </button>
      </form>
    </section>
  );
};

export default PhoneForm;
