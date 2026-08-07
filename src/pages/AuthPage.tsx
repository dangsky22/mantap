import { FormEvent, useState } from 'react';
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from || '/onboarding';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Konfirmasi kata sandi belum sama.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === 'signup') await signup(email, password);
      else await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = (err as { code?: string }).code;
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
        'auth/invalid-credential': 'Email atau kata sandi belum tepat.',
        'auth/weak-password': 'Gunakan kata sandi minimal 6 karakter.',
        'auth/invalid-email': 'Masukkan alamat email yang valid.',
      };
      setError(messages[code || ''] || 'Terjadi kendala. Coba lagi sebentar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080B10] text-slate-100 grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-white/5">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-teal/20 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue/20 blur-[120px]" />
        <Link to="/" className="relative flex items-center gap-2.5 w-fit">
          <Brand />
        </Link>
        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal-200">
            <SparklesIcon className="h-4 w-4" /> Ruang untuk berpikir jernih
          </span>
          <h1 className="mt-7 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">Keputusan tetap milikmu. <span className="text-teal-300">Kejernihannya kita cari bersama.</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">Guido.AI membantu kamu mengurai pilihan, risiko, dan alasan tanpa menghakimi atau mendikte.</p>
        </div>
        <div className="relative space-y-3 text-sm text-slate-300">
          {['Pertanyaan reflektif, bukan jawaban instan', 'Konteks diskusi tersimpan secara pribadi', 'Keputusan final selalu di tanganmu'].map((item) => (
            <div key={item} className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-teal-300" />{item}</div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-12 flex items-center gap-2.5 lg:hidden"><Brand /></Link>
          <p className="text-sm font-semibold text-teal-300">{mode === 'login' ? 'SELAMAT DATANG KEMBALI' : 'BUAT AKUN BARU'}</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{mode === 'login' ? 'Masuk ke ruang berpikirmu' : 'Mulai ruang berpikirmu'}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{mode === 'login' ? 'Masuk untuk melanjutkan diskusi dan melihat keputusanmu.' : 'Daftar untuk menyimpan konteks dan keputusanmu secara pribadi.'}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-slate-200">Email
              <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20" />
            </label>
            <label className="block text-sm font-medium text-slate-200">Kata sandi
              <input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20" />
            </label>
            {mode === 'signup' && (
              <label className="block text-sm font-medium text-slate-200">Konfirmasi kata sandi
                <input type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20" />
              </label>
            )}
            {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
            <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-blue px-4 py-3.5 font-bold text-white shadow-lg shadow-teal-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Memproses...' : mode === 'signup' ? 'Buat akun & lanjutkan' : 'Masuk ke Guido.AI'} <ArrowRightIcon className="h-5 w-5" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setConfirmPassword(''); }}
              className="font-semibold text-teal-300 transition hover:text-teal-200"
            >
              {mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
          <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">Dengan melanjutkan, kamu setuju menggunakan Guido.AI sebagai mitra berpikir—bukan pengambil keputusan.</p>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return <><span className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden"><img src="/logo.png" alt="Guido.AI Logo" className="w-10 h-10 object-contain" /></span><span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Guido<span className="text-teal-300">.AI</span></span></>;
}
