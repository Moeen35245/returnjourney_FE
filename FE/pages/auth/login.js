'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProfileInput from '@/components/ProfileInput';
import CrButton from '@/components/CrButton';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
// import nookies, { setCookie, destroyCookie } from 'nookies';
import useCustomMutation from '@/hooks/useMutationHook';
import Cookies from 'js-cookie';
import inputValidations from '@/util/validaton';

const Login = () => {
    const divRef = useRef(null);

    const router = useRouter();
    const mutation = useCustomMutation();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [disable, setDisable] = useState(true);

    const onSubmitHandler = async () => {
        if (!phone || !password) {
            toast.error('Enter credentials', toastConfig());
        }

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/users/login',
                data: { phone: phone, password: password },
                method: 'POST',
            });

            if (response.status === 200) {
                toast.success('Login successfully', toastConfig());

                new Promise((resolve, reject) => {
                    // Remove Token
                    Cookies.remove('token');
                    Cookies.remove('uid');
                    Cookies.remove('email');
                    // Add Token
                    Cookies.set('token', response.responseData.data.token, { expires: 3600 * 24 * 7 });
                    Cookies.set('uid', response.responseData.data.userId, { expires: 3600 * 24 * 7 });
                    Cookies.set('phone', response.responseData.data.phone, { expires: 3600 * 24 * 7 });
                    resolve();
                })
                    .then(() => {
                        router.push('/');
                    })
                    .catch((err) => console.log(err));

                // localStorage.setItem('user', JSON.stringify(response.responseData.data));
                // router.push('/admin/onboard');
            } else {
                if (response.status === 401) {
                    toast.error('Invalid credentials', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response);
        } catch (error) {
            toast.error('Something went wrong', toastConfig());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !(phone && password);

        setDisable(errExist || fieldsCheck);
    }, [phone, password]);

    console.log(disable);

    return (
        <main className='bg-[#b2f5ea96] lg:px-8 px-5 py-12 h-[100vh]'>
            <div className='grid lg:grid-cols-2 grid-cols-1 bg-white rounded-2xl h-[85vh] overflow-hidden'>
                <div ref={divRef} className='flex justify-center items-center '>
                    <div className='lg:w-[60%] w-[87%]'>
                        <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Sign in to your account </h3>
                        <ProfileInput
                            simpleLable='Phone'
                            labelClassName='text-base ml-1 text-dark2 font-bold'
                            name='phone'
                            placeholder='ex :-9988667755'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type='text'
                            required
                            pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                            inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            validation={inputValidations.phone}
                        />
                        <ProfileInput
                            simpleLable='Password'
                            labelClassName='text-base ml-1 text-dark2 font-bold'
                            name='password'
                            placeholder='**********'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type='password'
                            pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                            inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            validation={inputValidations.password}
                        />

                        <span
                            onClick={() => router.push('/auth/reset')}
                            className='text-sm text-primary underline cursor-pointer hover:opacity-70 transition-all '
                        >
                            forgot password
                        </span>
                        <CrButton
                            disabled={disable}
                            loading={isLoading}
                            fn={onSubmitHandler}
                            name='Sign in'
                            styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
                        />
                        <div className='w-full h-[1px] bg-gray-400 my-6'></div>
                        <div className='flex justify-center gap-3'>
                            <span>Not yet a user?</span>
                            <span className='text-primary hover:opacity-90 transition-all '>
                                <Link href='/auth/signup'>Sign up here</Link>
                            </span>
                        </div>
                    </div>
                </div>

                <div className='bg-primary p-8 lg:block hidden'>
                    <div className='relative h-full w-full'>
                        <Image alt='banner' src='/login.png' layout='fill' objectFit='cover' className='z-10' />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
