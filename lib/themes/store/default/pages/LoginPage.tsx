"use client"
import React, { useState } from 'react'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Github, Chrome } from 'lucide-react'
import { useCustomerLoginMutation } from '@/lib/services/authApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { resolveTokens } from '@/lib/themes/store/default/config'

type StoreData = any

export default function LoginPage({ storeData, storeSlug }: { storeData: StoreData; storeSlug: string }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [login, { isLoading: isLoggingIn }] = useCustomerLoginMutation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const tokens = resolveTokens(storeData || {})
  const themeStyles: React.CSSProperties = {
    ['--p-color' as any]: tokens.primary,
    ['--h-color' as any]: tokens.headingColor,
    ['--t-color' as any]: tokens.textColor,
    ['--radius' as any]: storeData?.borderRadius ?? tokens.borderRadius,
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password, storeSlug: storeSlug ?? storeData.slug }).unwrap()
      const redirect = searchParams?.get('redirect') ?? `/store/${storeSlug ?? storeData.slug}`
      router.push(redirect)
    } catch (err: any) {
      setError(err?.data?.message || 'فشل تسجيل الدخول')
    }
  }

  const InputField = ({ label, type, icon: Icon, placeholder, value, onChange }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 pr-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 right-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={18} />
        </div>
        <input 
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-100 rounded-[var(--radius)] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-[var(--p-color)] transition-all text-sm font-medium"
          style={{ borderRadius: 'var(--radius)' }}
        />
        {type === 'password' && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-4 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans" dir="rtl" style={themeStyles}>
      <div className="w-full max-w-[500px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 md:p-12 overflow-hidden" style={{ borderRadius: 'calc(var(--radius) * 2)' }}>
        <div className="space-y-8">
          <div className="text-center space-y-2">
            {storeData?.logoUrl ? (
              <img src={storeData.logoUrl} alt={storeData.name || storeData.storeName || 'logo'} className="mx-auto h-10 object-contain" />
            ) : (
              <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--p-color)' }}>{storeData?.name || storeData?.storeName || 'LOGO'}</h2>
            )}
            <h1 className="text-xl font-black text-slate-900" style={{ color: 'var(--h-color)' }}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h1>
            <p className="text-slate-400 text-xs font-bold">{isLogin ? 'أهلاً بك مجدداً، يسعدنا رؤيتك!' : 'انضم إلينا واستمتع بتجربة تسوق فريدة'}</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {!isLogin && (
              <InputField label="الاسم الكامل" type="text" icon={User} placeholder="مثال: محمد علي" value={fullName} onChange={(e: any) => setFullName(e.target.value)} />
            )}
            <InputField label="البريد الإلكتروني" type="email" icon={Mail} placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} />
            <div className="space-y-1">
              <InputField label="كلمة المرور" type="password" icon={Lock} placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} />
              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-bold text-blue-600 hover:underline">نسيت كلمة المرور؟</button>
                </div>
              )}
            </div>

            <button 
              className="w-full py-4 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10 transition-all hover:brightness-110 active:scale-[0.98] mt-2"
              style={{ backgroundColor: 'var(--p-color)', borderRadius: 'var(--radius)' }}
              type="submit"
              disabled={isLoggingIn}
            >
              {isLogin ? 'دخول' : 'إنشاء الحساب'}
              <ArrowRight size={18} className="rotate-180" />
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-300">أو المتابعة بواسطة</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-[var(--radius)] hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">
              <Chrome size={16} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-[var(--radius)] hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">
              <Github size={16} /> Apple
            </button>
          </div>

          <div className="pt-4 border-t border-slate-50 text-center">
            <p className="text-sm font-bold text-slate-500">
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="mr-2 text-blue-600 hover:underline"
              >
                {isLogin ? 'سجل الآن' : 'سجل دخولك'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
