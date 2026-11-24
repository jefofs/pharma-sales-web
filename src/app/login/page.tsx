'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('Servidor indisponível. Verifique se a API está online.');
        } else {
          setError(
            err.response.data?.message || 'Não foi possível autenticar. Verifique os dados.'
          );
        }
      } else {
        setError('Erro inesperado ao realizar login.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setIsRegisterMode((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        {/* Cabeçalho inspirado no LandingScreen mobile */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-blue-600 shadow-lg shadow-blue-600/25 flex items-center justify-center mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-11 h-11 text-white"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pharma <span className="text-blue-600">BioFarma</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2">
            Sua gestão de saúde simplificada
          </p>
        </div>

        {/* Feedback de erro */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rep@demo.com"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Botões espelhando o rodapé do mobile */}
          <div className="pt-3 space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>
                {submitting
                  ? 'Aguarde...'
                  : isRegisterMode
                  ? 'Cadastrar e entrar'
                  : 'Entrar'}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggleMode}
              disabled={submitting}
              className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 text-blue-600 border-2 border-blue-600 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>
                {isRegisterMode ? 'Já tenho uma conta' : 'Criar conta'}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}