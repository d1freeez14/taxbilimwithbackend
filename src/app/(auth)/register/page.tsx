'use client';

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import {useSession} from "@/lib/useSession";
import {useRouter} from "next/navigation";
import {AuthService} from "@/services/auth";

type FormData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<FormData>({
    mode: 'onTouched'
  })
  const [showPassword, setShowPassword] = useState(false)
  const {saveSession} = useSession();

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const session = await AuthService.register(
        `${data.firstName} ${data.lastName}`.trim(),
        data.email,
        data.password
      );

      // если нужны зеркала в localStorage — оставь:
      // localStorage.setItem('token', session.token);
      // localStorage.setItem('user', JSON.stringify(session.user));

      saveSession({
        token: session.token,
        user: session.user,
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  }

  return (
    <div className={'w-full h-full flex flex-col justify-between items-center p-10 gap-1'}>
      <div className={'flex items-center justify-center self-start border border-[#676E76] rounded-full p-2.5'}>
        <Icon icon={'tabler:chevron-left'} className={'w-5 h-5 text-[#676E76]'}/>
      </div>

      <div className={'w-[75%] flex flex-col justify-center gap-5'}>
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            Завершите регистрацию в Tax Bilim <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-600">
            Надёжный проводник в мире налогового образования
          </p>
        </div>

        <div className={'flex flex-col gap-4 justify-center'}>
          <button
            className={'flex items-center justify-center gap-2 px-[18px] py-[10px] border border-[#676E76] border-opacity-20 rounded-[8px] active:bg-[#eeeeee]'}>
            <Image src={'/google-logo.png'} alt={''} width={20} height={20}/>
            <p className={'text-[14px] text-[#596066] font-semibold'}>Войти через Google</p>
          </button>
          <div className={'flex items-center w-full gap-2'}>
            <hr className={'border-t border-[#CED2D6] w-full'}/>
            <p className={'text-[#9EA5AD] text-[14px] font-medium'}>или</p>
            <hr className={'border-t border-[#CED2D6] w-full'}/>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-3.5"
            noValidate
          >
            {/* First Name */}
            <div className="col-span-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-[#676E76]"
              >
                Имя
              </label>
              <input
                id="firstName"
                type="text"
                placeholder={'Талгат'}
                {...register('firstName', {required: 'Имя обязательно'})}
                className={`mt-2 block w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  errors.firstName
                    ? 'border-red-500 '
                    : 'border-[#676E76] border-opacity-20'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="col-span-1">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-[#676E76]"
              >
                Фамилия
              </label>
              <input
                id="lastName"
                type="text"
                placeholder={'Оркенов'}
                {...register('lastName', {required: 'Фамилия обязательна'})}
                className={`mt-2 block w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  errors.lastName
                    ? 'border-red-500 '
                    : 'border-[#676E76] border-opacity-20'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#676E76]"
              >
                Email
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    icon="pajamas:mail"
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value:
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: 'Неверный формат'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                    errors.email
                      ? 'border-red-500 '
                      : 'border-[#676E76] border-opacity-20'
                  }`}
                  placeholder="user@taxbilim.kz"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#676E76]"
              >
                Пароль
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    icon="prime:lock"
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: {
                      value: 8,
                      message: 'Пароль должен содержать не менее 8 символов'
                    }
                  })}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none ${
                    errors.password
                      ? 'border-red-500 '
                      : 'border-[#676E76] border-opacity-20'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  <Icon
                    icon={
                      showPassword
                        ? 'mdi:eye-off-outline'
                        : 'mdi:eye-outline'
                    }
                    className="w-5 h-5"
                  />
                </button>
              </div>

              {/* red underline + custom message when too short */}
              {errors.password?.type === 'minLength' && (
                <>
                  <div className="mt-1 h-0.5 bg-[#EE7A67]"/>
                  <p className="mt-1 flex items-center text-sm text-gray-600">
                    <span className="mr-1">😖</span>
                    {errors.password.message}
                  </p>
                </>
              )}
            </div>

            {/* Submit */}
            <div className="col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#EE7A67] hover:bg-[#ee7a67cc] text-white font-semibold rounded-lg"
              >
                {isSubmitting ? 'Регистрируем…' : 'Зарегистрироваться'}
              </button>
            </div>
          </form>

          {/* Already have account */}
          <p className="text-center text-gray-600">
            У вас есть аккаунт?{' '}
            <Link href="/login" className="text-[#EE7A67] hover:underline">
              Войдите
            </Link>
          </p>
        </div>
      </div>

      <div className={'flex flex-col text-center'}>
        <p className={'text-sm text-[#9EA5AD] font-medium'}>
          Нажимая на кнопку &quot;Зарегистрироваться&quot;, вы соглашаетесь с нашими
        </p>
        <p className={'text-sm text-[#EE7A67] font-medium'}>
          Условиями использования и Политикой конфиденциальности
        </p>
      </div>
    </div>
  )
}

export default RegisterPage;