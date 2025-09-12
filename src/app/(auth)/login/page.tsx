'use client'
import {Icon} from "@iconify/react";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {useState} from "react";
import Link from "next/link";
import {useSession} from "@/lib/useSession";
import {AuthService} from "@/services/auth";
import {useRouter} from "next/navigation";

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter();
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormData>()
  const [showPassword, setShowPassword] = useState(false)
  const {saveSession} = useSession();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await AuthService.login(data.email, data.password);

      saveSession({
        token: result.token,
        user: result.user,
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please try again.");
    }
  }
  return (
    <div className={'w-full h-full flex flex-col justify-between items-center p-10 '}>
      <div className={'flex items-center justify-center self-start border border-[#676E76] rounded-full p-2.5'}>
        <Icon icon={'tabler:chevron-left'} className={'w-5 h-5 text-[#676E76]'}/>
      </div>
      <div className={'w-[75%] flex flex-col justify-center gap-6'}>
        <div className={'flex flex-col gap-2 text-center'}>
          <h1 className={'text-[36px] font-semibold'}>Вход в Tax Bilim</h1>
          <p className={'text-[#676E76] text-[16px] font-medium'}>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/*EMAIL*/}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#676E76]">Email</label>
              <div className="mt-2 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={'pajamas:mail'} className={'text-[#676E76] w-5 h-5'}/>
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email обязателен' })}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                    errors.email
                      ? 'border-red-500 '
                      : 'border-[#676E76] border-opacity-20'
                  }`}
                  placeholder="user@taxbilim.kz"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            {/*PASSWORD*/}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#676E76]">Пароль</label>
              <div className="mt-2 relative rounded-md ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={'prime:lock'} className={'text-[#676E76] w-5 h-5'}/>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Пароль обязателен' })}
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
                  {showPassword ? (
                    <Icon icon={'mdi:eye-off-outline'} className="h-5 w-5 text-[#676E76]" />
                  ) : (
                    <Icon icon={'mdi:eye-outline'} className="h-5 w-5 text-[#676E76]" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-1">
              <Icon icon={'lets-icons:question'} className={'w-4 h-4 text-[#676E76]'}/>
              <Link href="/forgot-password" className="text-sm text-[#676E76] hover:underline">
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#EE7A67] hover:bg-[#ee7a67cc] text-white text-[14px] font-semibold rounded-[8px]"
            >
              {isSubmitting ? 'Входим…' : 'Войти'}
            </button>
          </form>
          <p className="text-center text-sm text-[#454C52] font-medium">
            У вас нет аккаунта?{' '}
            <Link href="/register" className="text-[#EE7A67] hover:underline">
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>
      <div className={'flex flex-col text-center'}>
        <p className={'text-sm text-[#9EA5AD] font-medium'}>
          Нажимая на кнопку &quot;Войти&quot;, вы соглашаетесь с нашими
        </p>
        <p className={'text-sm text-[#EE7A67] font-medium'}>
          Условиями использования и Политикой конфиденциальности
        </p>
      </div>
    </div>
  );
};

export default LoginPage;