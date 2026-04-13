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
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#5B5FC7] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-[#1F2937]">Myus</h1>
          <p className="text-[#6B7280] mt-2 text-sm">Monitoreo de dispositivos</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-200">
          <h2 className="text-xl font-medium text-[#1F2937] mb-6 text-center">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-3.5 pl-12 pr-4 text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-2 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-3.5 pl-12 pr-12 text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5B5FC7] hover:bg-[#4749A3] text-white font-medium py-3.5 px-6 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200/50 text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Cargando...
                </span>
              ) : isRegister ? (
                'Crear cuenta'
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-[#6B7280] text-sm">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); clearError(); }}
              className="text-[#5B5FC7] font-medium hover:underline"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>

        <p className="text-center text-[#9CA3AF] text-xs mt-8">
          Al continuar, aceptas nuestros términos
        </p>
      </div>
    </div>
  );
};