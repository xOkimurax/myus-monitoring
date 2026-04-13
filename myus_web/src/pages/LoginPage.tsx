import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = isRegister
      ? await register(email, password)
      : await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-gray-50 to-[#F3F4F6] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#5B5FC7] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-300/50">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#1F2937] tracking-tight">Myus</h1>
          <p className="text-[#6B7280] mt-3 text-lg">Monitoreo de dispositivos móviles</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 p-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-8 text-center">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-3">Correo electrónico</label>
              <div className="relative">
                <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 pl-14 pr-5 text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#5B5FC7] focus:bg-white focus:ring-4 focus:ring-[#5B5FC7]/10 focus:outline-none transition-all text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-3">Contraseña</label>
              <div className="relative">
                <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 pl-14 pr-14 text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#5B5FC7] focus:bg-white focus:ring-4 focus:ring-[#5B5FC7]/10 focus:outline-none transition-all text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5B5FC7] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5B5FC7] hover:bg-[#4749A3] active:bg-[#3B3B8F] text-white font-semibold py-4 px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-300/60 hover:-translate-y-0.5 active:translate-y-0 text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : isRegister ? (
                'Crear cuenta'
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-[#6B7280] text-base">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); clearError(); }}
              className="text-[#5B5FC7] font-semibold hover:underline"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>

        <p className="text-center text-[#9CA3AF] text-sm mt-8">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
};