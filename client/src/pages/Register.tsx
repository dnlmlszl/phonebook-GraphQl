import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { REGISTER_MUTATION } from '../queries/queries';

interface RegisterProps {
  setError: (message: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setError }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const [createUser, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => navigate('/login'),
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      setError(messages);
    },
  });

  useEffect(() => {
    if (error) {
      setError(error.graphQLErrors.map((e) => e.message).join('\n'));
    }
  }, [setError, error]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser({ variables: { username, password } });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold text-slate-700 mb-6">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
        <div className="mt-3">
          <p className="text-sm font-semibold tracking-wider text-slate-500">
            Already a member?{' '}
            <Link
              to="/login"
              className="pl-2 hover:text-slate-300 transition duration-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
