import { Person as PersonType } from '../interfaces/graphQl';

export interface PersonComponentProps {
  person: PersonType;
  onClose: () => void;
}

const Person: React.FC<PersonComponentProps> = ({ person, onClose }) => {
  return (
    <section className="my-8 max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-slate-700 text-center mb-8">
        {person.name}
      </h2>
      <article className="flex items-center justify-between">
        <div className="text-lg">
          {person.address.street} {person.address.city}
        </div>
        <div className="text-lg">{person.phone}</div>
        <button
          className="mt-2 md:mt-4 py-2 px-6 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition ease-in-out duration-300"
          onClick={onClose}
        >
          Close
        </button>
      </article>
    </section>
  );
};

export default Person;
