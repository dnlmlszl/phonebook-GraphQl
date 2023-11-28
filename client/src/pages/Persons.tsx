import { useState } from 'react';
import { useQuery } from '@apollo/client';

import Person from '../components/Person';
import { FindPersonResponse, PersonsProps } from '../interfaces/graphQl';
import { FIND_PERSON } from '../queries/queries';

const Persons: React.FC<PersonsProps> = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState<string | null>(null);

  const result = useQuery<FindPersonResponse>(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  });

  if (nameToSearch && result.data && result.data.findPerson) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    );
  }

  return (
    <section className="my-8 max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-slate-700 text-center mb-8">
        Persons
      </h2>
      {persons.map((p) => (
        <article
          key={p.name}
          className="flex flex-col md:flex-row items-center justify-between bg-slate-200 p-6 m-2 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between w-1/2">
            <span className="font-meidum text-lg">{p.name}</span>{' '}
            <span className="font-italic text-lg">{p.phone}</span>
          </div>
          <button
            className="mt-4 md:mt-0 py-2 px-6 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition ease-in-out duration-300"
            onClick={() => setNameToSearch(p.name)}
          >
            Show address
          </button>
        </article>
      ))}
    </section>
  );
};

export default Persons;
