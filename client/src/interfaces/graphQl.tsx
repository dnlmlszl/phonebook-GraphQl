export interface Address {
  street: string;
  city: string;
}

export interface Person {
  name: string;
  phone?: string;
  address: Address;
  id: string;
}

export interface AllPersonsResponse {
  allPersons: Person[];
}

export interface PersonsProps {
  persons: Person[];
}

export interface FindPersonResponse {
  findPerson: Person | null;
}

export interface PersonFormProps {
  setError: (error: string) => void;
}
