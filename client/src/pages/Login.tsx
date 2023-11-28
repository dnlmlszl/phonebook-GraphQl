import { useApolloClient, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_PERSONS, LOGIN_MUTATION } from '../queries/queries';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';

interface LoginProps {
  setError: (message: string) => void;
}

interface User {
  username: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ setError }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setCurrentUser } = useUser();

  const navigate = useNavigate();
  const client = useApolloClient();

  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted() {
      client.resetStore();
    },
    refetchQueries: [{ query: ALL_PERSONS }],
  });

  useEffect(() => {
    if (error) {
      setError(error.graphQLErrors.map((e) => e.message).join('\n'));
    }
  }, [setError, error]);

  useEffect(() => {
    if (data && data.login) {
      localStorage.setItem('userToken', data.login.value);
      const decoded = jwtDecode<User>(data.login.value);
      setCurrentUser(decoded);
      navigate('/');
    }
  }, [data, setCurrentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ variables: { username, password } });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold text-slate-700 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
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
            Login
          </button>
        </form>
        <div className="mt-3">
          <p className="text-sm font-semibold tracking-wider text-slate-500">
            Not a member yet?{' '}
            <Link
              to="/register"
              className="pl-2 hover:text-slate-300 transition duration-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
