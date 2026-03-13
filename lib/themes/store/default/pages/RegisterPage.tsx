"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Github, Chrome } from 'lucide-react'
import { useCustomerRegisterMutation } from '@/lib/services/authApi'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ThemeTokens } from '@/lib/themes/types'

interface Props {
  storeSlug: string
  theme: ThemeTokens
  logo?: string | null
  storeName?: string
}

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const registerSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(10, 'رقم الجوال غير صحيح'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

type RegisterFormData = z.infer<typeof registerSchema>

interface Props {
  storeSlug: string
  theme: ThemeTokens
  logo?: string | null
  storeName?: string
}

export default function RegisterPage({ storeSlug, theme, logo, storeName }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })
  const [error, setError] = useState<string | null>(null)
  const [registerCustomer, { isLoading }] = useCustomerRegisterMutation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await registerCustomer({ 
        email: data.email, 
        password: data.password, 
        fullName: data.fullName, 
        phone: data.phone, 
        storeSlug 
      }).unwrap()
      const redirect = searchParams?.get('redirect') ?? `/store/${storeSlug}`
      router.push(redirect)
    } catch (err: any) {
      setError(err?.data?.message || 'فشل إنشاء الحساب')
    }
  }

  const InputField = ({ label, type, icon: Icon, placeholder, inputProps, error }: any) => (
    <div className="space-y-2 text-right">
      <label className="text-sm font-bold text-slate-700 pr-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 right-4 flex items-center text-slate-400 group-focus-within:text-[var(--p-color)] transition-colors">
          <Icon size={18} />
        </div>
        <input 
          {...inputProps}
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={`w-full pr-12 pl-4 py-4 bg-slate-50 border rounded-[var(--radius)] outline-none focus:bg-white focus:ring-4 focus:ring-[var(--p-color)]/5 transition-all text-sm font-medium ${error ? 'border-red-500' : 'border-slate-100 focus:border-[var(--p-color)]'}`}
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
      {error && <p className="text-red-500 text-[10px] pr-2 mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] bg-white shadow-2xl shadow-slate-200/50 p-8 md:p-12" style={{ borderRadius: 'calc(var(--radius) * 1.5)' }}>
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Link href={`/store/${storeSlug}`}>
              {logo ? (
                <img src={logo} alt={storeName} className="mx-auto h-12 object-contain mb-4" />
              ) : (
                <h2 className="text-3xl font-black text-[var(--p-color)] mb-4">{storeName}</h2>
              )}
            </Link>
            <h1 className="text-2xl font-black text-slate-900">إنشاء حساب جديد</h1>
            <p className="text-slate-400 text-sm font-bold">انضم إلينا واستمتع بتجربة تسوق فريدة</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
            <InputField 
              label="الاسم الكامل" 
              type="text" 
              icon={User} 
              placeholder="مثال: محمد علي" 
              inputProps={register('fullName')} 
              error={errors.fullName?.message}
            />
            <InputField 
              label="رقم الجوال" 
              type="tel" 
              icon={Phone} 
              placeholder="05xxxxxxxx" 
              inputProps={register('phone')} 
              error={errors.phone?.message}
            />
            <InputField 
              label="البريد الإلكتروني" 
              type="email" 
              icon={Mail} 
              placeholder="name@example.com" 
              inputProps={register('email')} 
              error={errors.email?.message}
            />
            <InputField 
              label="كلمة المرور" 
              type="password" 
              icon={Lock} 
              placeholder="••••••••" 
              inputProps={register('password')} 
              error={errors.password?.message}
            />

            <button 
              disabled={isLoading} 
              type="submit" 
              className="w-full py-4 text-white font-black text-sm flex items-center justify-center gap-3 bg-[var(--p-color)] rounded-[var(--radius)] shadow-lg shadow-[var(--p-color)]/20 transition-all hover:brightness-110 active:scale-[0.98] mt-2 disabled:opacity-50"
            >
              {isLoading ? 'جاري التحميل...' : 'إنشاء الحساب'}
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

          <div className="pt-6 border-t border-slate-50 text-center">
            <p className="text-sm font-bold text-slate-500">
              لديك حساب بالفعل؟
              <Link href={`/store/${storeSlug}/login`} className="mr-2 text-[var(--p-color)] hover:underline">سجل دخولك</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
