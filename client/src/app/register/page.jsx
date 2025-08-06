import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthForm type="register" />
    </div>
  );
};

export default RegisterPage;
