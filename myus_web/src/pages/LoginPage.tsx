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
    <div className="min-h-screen w-full flex bg-[#FAFAFA]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#5B5FC7] flex-col justify-between p-16">
        <div>
          <div className="flex items-center gap-4 mb-20">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="text-white text-3xl font-bold tracking-tight">Myus</span>
          </div>
          <h1 className="text-white text-5xl font-bold leading-tight mb-6">
            Control total sobre tus dispositivos
          </h1>
          <p className="text-white/70 text-xl leading-relaxed">
            Monitorea notificaciones, contactos, llamadas, ubicación y archivos en tiempo real desde cualquier lugar.
          </p>
        </div>
        <div className="flex items-center gap-4 text-white/50 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Todos los sistemas operativos</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#5B5FC7] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="text-[#1F2937] text-2xl font-bold">Myus</span>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              {isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
            </h2>
            <p className="text-[#6B7280] mb-8">
              {isRegister ? 'Comienza en minutos' : 'Ingresa tus credenciales para continuar'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full border border-gray-300 rounded-xl py-3.5 px-4 text-[#111827] placeholder-[#9CA3AF] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="contraseña"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-xl py-3.5 px-4 text-[#111827] placeholder-[#9CA3AF] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5B5FC7] hover:bg-[#4749A3] text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="text-center mt-8 text-[#6B7280] text-sm">
              {isRegister ? '¿Ya tienes cuenta?' : '¿Sin cuenta?'}{' '}
              <button
                onClick={() => { setIsRegister(!isRegister); clearError(); }}
                className="text-[#5B5FC7] font-medium hover:underline"
              >
                {isRegister ? 'Inicia sesión' : 'Crea una'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};