'use client';
import Image from 'next/image';
import ProfileInput from '@/components/ProfileInput';
import CrButton from '@/components/CrButton';
import useCustomMutation from '@/hooks/useMutationHook';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import inputValidations from '@/util/validaton';
import Cookies from 'js-cookie';
import Loader from '@/components/Loading';
// import nookies, { setCookie, destroyCookie } from 'nookies';

const SignUp = () => {
    const divRef = useRef(null);
    const router = useRouter();
    const mutation = useCustomMutation();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    // const [role, setRole] = useState('O');
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoader, setResendLoader] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [disable, setDisable] = useState(true);
    const [timer, setTimer] = useState(120); // Timer set to 60 seconds
    const [showResendButton, setShowResendButton] = useState(false);

    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Initialize with four empty strings
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]; // Refs for input elements

    const submitHandler = async () => {
        if (password !== confirm) {
            toast.error('Password not match', toastConfig());
            return;
        }
        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/users/signup',
                data: { phone: phone, password: password, confirm: confirm },
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('OTP sent', toastConfig());
                setIsOtpSent(true);
            } else {
                if (
                    response.status === 422 ||
                    response.status === 401 ||
                    response.status === 404 ||
                    response.status === 400
                ) {
                    toast.error(`${response.responseData.message}`, toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response);
        } catch (error) {
            toast.error('Something went wrong', toastConfig());
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const otpVerify = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter 6 otp', toastConfig());
            return;
        }

        let otpString = '';
        otp.forEach((el) => (otpString = otpString + el));

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/users/verify',
                data: { phone: phone, code: otpString },
                method: 'POST',
            });

            if (response.status === 200) {
                toast.success('Otp has been verified', toastConfig());
                new Promise((resolve, reject) => {
                    // Remove Token
                    Cookies.remove('token');
                    Cookies.remove('uid');
                    Cookies.remove('email');
                    // Add Token
                    Cookies.set('token', response.responseData.data.token, { expires: 3600 * 24 * 7 });
                    Cookies.set('uid', response.responseData.data.uid, { expires: 3600 * 24 * 7 });
                    Cookies.set('phone', response.responseData.data.phone, { expires: 3600 * 24 * 7 });
                    resolve();
                })
                    .then(() => {
                        router.push('/');
                    })
                    .catch((err) => console.log(err));
            } else {
                if (
                    response.status === 422 ||
                    response.status === 401 ||
                    response.status === 404 ||
                    response.status === 400
                ) {
                    toast.error(`${response.responseData.message}`, toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response.responseData.data);
        } catch (error) {
            toast.error('Something went wrong', toastConfig());
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        setResendLoader(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/users/resend',
                data: { phone: phone },
                method: 'POST',
            });

            if (response.status === 201 || response.status === 200) {
                toast.success(`${response.responseData.message}`, toastConfig());
                setTimer(120);
                setShowResendButton(false);
                setResendLoader(false);
            } else {
                if (
                    response.status === 422 ||
                    response.status === 401 ||
                    response.status === 404 ||
                    response.status === 400
                ) {
                    toast.error(`${response.responseData.message}`, toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response);
        } catch (error) {
            toast.error('Something went wrong', toastConfig());
            console.log(error);
        }
    };
    const handleInputChange = (e, index) => {
        const value = e.target.value;

        // Allow only single digits and prevent non-digit input
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to the next input box if not the last box
            if (index < 5 && value.length === 1) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    // Function to handle backspace/delete key
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);

            // Move focus to the previous input box if not the first box
            if (index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    useEffect(() => {
        let interval;
        if (isOtpSent) {
            if (timer > 0) {
                interval = setInterval(() => {
                    setTimer(timer - 1);
                }, 1000);
            } else {
                setShowResendButton(true);
                clearInterval(interval);
            }
        }

        return () => clearInterval(interval);
    }, [timer, isOtpSent]);

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !(phone && password && confirm);

        setDisable(errExist || fieldsCheck);
    }, [phone, password, confirm]);

    return (
        <main className='bg-[#b2f5ea96] lg:px-8 px-5 py-12 h-[100vh]'>
            <div className='grid lg:grid-cols-2 grid-cols-1 bg-white rounded-2xl h-[85vh] overflow-hidden'>
                {isOtpSent ? (
                    <div className='flex justify-center items-center  '>
                        <div ref={divRef} className='lg:w-[60%] w-[87%]'>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6 ml-2'>Enter Otp</h3>
                            <div className='flex justify-between px-2 mb-6'>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type='text'
                                        className='h-11 w-11 border-2 border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary/50 pl-4 text-lg font-semibold text-primary'
                                        value={digit}
                                        onChange={(e) => handleInputChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                            <CrButton
                                disabled={disable}
                                fn={otpVerify}
                                name='Verify'
                                loading={isLoading}
                                styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
                            />
                            <div className='w-full h-[1px] bg-gray-400 my-6'></div>
                            {!showResendButton ? (
                                <div className='flex justify-center gap-3'>
                                    <span>Resend in</span>
                                    <span className='text-primary w-[40px]'>
                                        {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' + (timer % 60) : timer % 60}
                                    </span>
                                </div>
                            ) : (
                                <div className='flex justify-center gap-3'>
                                    <span>Not get yet?</span>
                                    <span
                                        onClick={resendOtp}
                                        className='text-primary hover:opacity-90 transition-all cursor-pointer hover:underline'
                                    >
                                        resend
                                    </span>
                                    {resendLoader && <Loader style={'w-4 h-4'} />}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-center items-center '>
                        <div ref={divRef} className='lg:w-[60%] w-[87%]'>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Welcome! </h3>
                            <ProfileInput
                                simpleLable='Phone'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='Phone'
                                placeholder='ex :-9988776655'
                                type='phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                            <ProfileInput
                                simpleLable='Confirm'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='confirm'
                                placeholder='**********'
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                type='password'
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                validation={inputValidations.password}
                            />
                            <CrButton
                                disabled={disable}
                                fn={submitHandler}
                                name='Sign in'
                                loading={isLoading}
                                styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
                            />
                            <div className='w-full h-[1px] bg-gray-400 my-6'></div>
                            <div className='flex justify-center gap-3'>
                                <span>Already registered? </span>
                                <span className='text-primary hover:opacity-90 transition-all '>
                                    <Link href='/auth/login'>Sign in here</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className='bg-primary p-8 lg:block hidden'>
                    <div className='relative h-full w-full'>
                        <Image alt='banner' src='/login.png' layout='fill' objectFit='cover' className='z-10' />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignUp;
