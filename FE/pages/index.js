import Image from 'next/image';
import { Inter } from 'next/font/google';
import CrButton from '@/components/CrButton';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const router = useRouter();
    return (
        <main className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}>
            <h1 className='text-4xl font-semibold'>You are at home page</h1>
            <CrButton
                fn={() => {
                    new Promise((resolve, reject) => {
                        // Remove Token
                        Cookies.remove('token');
                        Cookies.remove('uid');
                        Cookies.remove('email');

                        resolve();
                    })
                        .then(() => {
                            router.push('/auth/login');
                        })
                        .catch((err) => console.log(err));
                }}
                name='Sign out'
                styles={`bg-red1 font-inherit w-[400px] py-6 rounded-xl text-base font-bold`}
            />
        </main>
    );
}

export async function getServerSideProps(context) {
    const { token, uid } = context.req.cookies;
    // console.log(token);

    if (!token || !uid) {
        // Redirect to /home if user is active
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false, // Set this to true if it's a permanent redirect
            },
        };
    }
    return {
        props: {},
    };
}
