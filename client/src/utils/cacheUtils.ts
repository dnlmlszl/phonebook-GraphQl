import { ApolloCache } from '@apollo/client';
import { AllPersonsResponse, Person } from '../interfaces/graphQl';
import { ALL_PERSONS } from '../queries/queries';

export const updateCache = (
  cache: ApolloCache<AllPersonsResponse>,
  addedPerson: Person
) => {
  const uniqByName = (persons: Person[]): Person[] => {
    const seen = new Set<string>();
    return persons.filter((item) => {
      if (seen.has(item.name)) {
        return false;
      } else {
        seen.add(item.name);
        return true;
      }
    });
  };

  const existingPersons = cache.readQuery<AllPersonsResponse>({
    query: ALL_PERSONS,
  });

  if (existingPersons && Array.isArray(existingPersons.allPersons)) {
    cache.writeQuery<AllPersonsResponse>({
      query: ALL_PERSONS,
      data: {
        allPersons: uniqByName([...existingPersons.allPersons, addedPerson]),
      },
    });
  }
};

// export const updateCache = (cache, query, addedPerson) => {
//   const uniqByName = (a) => {
//     let seen = new Set();
//     return a.filter((item) => {
//       let k = item.name;
//       return seen.has(k) ? false : seen.add(k);
//     });
//   };

//   cache.updateQuery(query, ({ allPersons }) => {
//     return {
//       allPersons: uniqByName(allPersons.concat(addedPerson)),
//     };
//   });
// };
