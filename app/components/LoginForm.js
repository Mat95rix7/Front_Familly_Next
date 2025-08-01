'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SuccessModal from './SuccessModal';
import { useAuth } from '../context/AuthContext'

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorAuth('');

    try {
      const data = await login({username, password});

      if (!data) {
        setErrorAuth('Identifiants invalides');
        return;
      }

      if (data) {
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            router.push('/')
          }, 2000);
      }
    } catch (error) {     
        setErrorAuth(error.code);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className='w-full max-w-xs '>
        <h1 className="text-4xl mb-10 text-amber-500 font-bold capitalize text-center">
          Connexion
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
          <input
            className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorAuth && <p className="mb-3 text-center text-sm text-amber-500">{errorAuth}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="!bg-gradient-to-t from-amber-400 to-amber-700 text-white !text-xl font-bold !py-4 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 ease-in-out disabled:opacity-50"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className='text-white text-sm text-center mt-3'>Vous n&apos;avez pas de compte ? <Link href="/auth/register" className='!text-amber-400'>Inscrivez-Vous</Link></p>
        </form>
        <SuccessModal showModal={showModal} setShowModal={setShowModal} type="connexion" />
      </div>
  );
}
