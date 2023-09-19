import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
// import ProgressBar from '@badrap/bar-of-progress';
import NextNProgress from 'nextjs-progressbar';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

// const progress = new ProgressBar({
//     size: 4,
//     color: '#FDB400',
//     className: 'z-50',
//     delay: 100,
// });

// Router.events.on('routeChangeStart', progress.start);
// Router.events.on('routeChangeComplete', progress.finish);
// Router.events.on('routeChangeError', progress.finish);

export default function App({ Component, pageProps }) {
    const [client] = useState(new QueryClient());
    return (
        <QueryClientProvider client={client}>
            <NextNProgress height={5} color='#6366F1' />
            <ToastContainer />
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
