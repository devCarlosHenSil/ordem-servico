import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000); // 5 segundos
    return () => clearTimeout(timer);
  }, [navigate]);
  
  console.log('SplashScreen is rendered');

  return (
    <div className="bg-blue-500 text-white flex items-center justify-center h-screen animate-fadeIn">
      <h1 className="text-4xl font-bold">Bem-vindo à Xentry Labs</h1>
    </div>
  );
  
};

export default SplashScreen;
