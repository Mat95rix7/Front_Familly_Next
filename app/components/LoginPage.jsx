import { LoginForm } from '../components/LoginForm';
import BannerLogin from '../components/BannerLoginRegister';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showDeactivationModal, setShowDeactivationModal] = useState(false);
  const navigate = useNavigate();
  return (
        <div className="flex h-screen">
          
          {/* Section Connexion */}

          <div className="flex-1 flex flex-col items-center justify-center  p-5">
            <div className="relative flex flex-col items-center justify-center 
              bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl w-full max-w-xl py-10 
              shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
              border border-gray-700 hover:border-amber-500 animate-fade-in">
              <LoginForm 
              showDeactivationModal={showDeactivationModal} 
              setShowDeactivationModal={setShowDeactivationModal} 
               />
            </div>
          </div>

          {/* Section Image */}
          
          <div className="hidden md:flex flex-1 flex-col mx-10 my-auto rounded-2xl ">
              
              <div className="relative rounded-2xl w-full max-w-xl 
              shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
              border border-gray-700 hover:border-amber-500 animate-fade-in mx-auto mt-5">
                <BannerLogin excludeIndex={1} direction={'+'}/>
              </div>
              
              <div className="relative rounded-2xl w-full max-w-xl
              shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
              border border-gray-700 hover:border-amber-500 animate-fade-in mx-auto mt-5">
                <BannerLogin excludeIndex={-1} direction={'-'}/>
              </div>
          </div>

                  {/* Modal pour compte désactivé */}
        {showDeactivationModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-600 text-gray-900 bg-opacity-50  p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
                Compte désactivé
              </h2>
              <p className="mb-6 text-sm md:text-base text-center sm:text-justify">
                Votre compte est actuellement désactivé. Si vous souhaitez le réactiver,
                veuillez nous contacter.
              </p>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-evenly space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm md:text-base"
                  onClick={() => setShowDeactivationModal(false)}
                >
                  Fermer
                </button>
                <button
                  className="w-full sm:w-auto bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 text-sm md:text-base"
                  onClick={() => navigate('/contact')}
                >
                  Contacter le support
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
  );
}

export default LoginPage;