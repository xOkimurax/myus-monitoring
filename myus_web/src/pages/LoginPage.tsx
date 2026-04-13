import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const result = isRegister ? await register(email, password) : await login(email, password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-full max-w-[360px] px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#5B5FC7] rounded-2xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Myus</h1>
          <p className="text-[#A0AEC0] mt-1">Monitoreo de dispositivos</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 border border-[#EDF2F7]">
          <h2 className="text-base font-medium text-[#1A202C] mb-6 text-center">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#718096] mb-2">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#1A202C] placeholder-[#CBD5E0] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#718096] mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#1A202C] placeholder-[#CBD5E0] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5B5FC7] hover:bg-[#4749A3] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 mt-6"
            >
              {isLoading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-[#A0AEC0] text-xs mt-6">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); clearError(); }}
              className="text-[#5B5FC7] font-medium hover:underline"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};