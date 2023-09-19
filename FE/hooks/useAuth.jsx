import Cookies from 'js-cookie';
const useAuthentication = () => {
    const token = Cookies.get('token');
    const uid = Cookies.get('uid');
    const email = Cookies.get('email');

    const isAuthenticated = !!token; // Change 'token' to your cookie key

    console.log(isAuthenticated);
    return { isAuthenticated, uid, token, email };
};

export default useAuthentication;

// 'use client';
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import Cookies from 'js-cookie';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState({
//         uid: '',
//         email: '',
//         token: '',
//     });

//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         console.log('Inside useEffect');

//         const token = Cookies.get('token');
//         const uid = Cookies.get('uid');
//         const email = Cookies.get('email');
//         console.log('Token:', token);
//         console.log('UID:', uid);
//         console.log('Email:', email);

//         if (uid) {
//             console.log('Setting user data');
//             setUser({
//                 uid: uid,
//                 email: email,
//                 token: token,
//             });
//         }
//         setIsLoading(false);
//     }, []);

//     console.log('User state:', user);

//     const logout = () => {
//         console.log('Logging out');
//         Cookies.remove('token');
//         Cookies.remove('uid');
//         Cookies.remove('email');
//         setUser({
//             uid: '',
//             email: '',
//             token: '',
//         });
//         window.location.pathname = '/auth/login';
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated: !!user.uid, user: user, loading: isLoading, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
