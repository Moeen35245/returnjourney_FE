const inputValidations = {
    email: {
        regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
        errorMsg: 'Please enter a valid email address',
        maxLength: 100,
    },
    password: {
        // must be atleast 6 characters long
        regex: /^.{6,}$/,
        errorMsg: 'Password must be at least 6 characters',
        maxLength: 100,
    },
    passwordStrong: {
        // must be atleast 6 characters long
        regex: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        errorMsg: 'min 8 chars, must contain uppercase, lowercase, numbers and symbols.',
        maxLength: 100,
    },
    name: {
        // can contain only letters spaces numbers
        // must not exceed 50 characters
        regex: /^[a-zA-Z ]{1,50}$/,
        errorMsg: 'Special characters, numbers not allowed',
        maxLength: 50,
    },
    phone: {
        // must be a valid phone number
        regex: /^[1-9][0-9]{9}$/,
        errorMsg: `Invalid phone number`,
        maxLength: 10,
    },
    pincode: {
        // must be 6 digits
        regex: /^[0-9]{6}$/,
        errorMsg: 'Pincode must be 6 digits',
    },

    otp: {
        // must be 6 digits
        regex: /^[0-9]{6}$/,
        errorMsg: 'OTP must be 6 digits',
    },
    address: {
        regex: /^[a-zA-Z0-9()#&\- ]{1,100}$/,
        errorMsg: 'Invalid Input',
        maxLength: 100,
    },
};

export default inputValidations;
