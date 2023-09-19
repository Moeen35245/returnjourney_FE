import React, { useEffect, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { twMerge } from 'tailwind-merge';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

function ProfileInput({
    label,
    name,
    value,
    pClassName,
    inputClassName,
    onChange,
    validation,
    placeholder = '',
    type = 'text',
    required,
    disabled,
    textarea,
    simpleLable,
    dateMax,
    dateMin,
    onBlur,
    inputRef,
    onFocus,
    labelClassName,
    ...rest
}) {
    // this is to display the error message only when the user clicks away from the input
    const [isError, setIsError] = useState(false);
    const [maxLengthError, setMaxLengthError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleOnChange = (e) => {
        const value = e.target.value;

        if (dateMin) {
            if (new Date(dateMin) > new Date(value)) {
                setIsError(true);
            } else {
                setIsError(false);
            }
        }
        if (dateMax) {
            if (new Date(dateMax) < new Date(value)) {
                setIsError(true);
            } else {
                setIsError(false);
            }
        }

        if (validation) {
            if (validation.maxLength) {
                if (value.length > validation.maxLength) {
                    setMaxLengthError(true);
                    setIsError(true);
                } else {
                    setMaxLengthError(false);
                    setIsError(false);
                }
            }
            if (validation.regex) {
                const regex = new RegExp(validation?.regex);

                if (value.length && !regex.test(value)) {
                    setIsError(true);
                    if (onChange) {
                        onChange(e);
                    }
                    return;
                } else setIsError(false);
            }
        }
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={`flex flex-col`}>
            {simpleLable ? (
                <label className={twMerge(`block text-sm font-medium text-black mb-2 `, labelClassName)}>
                    {' '}
                    {simpleLable}
                </label>
            ) : null}
            <div className={`rounded-full ${isError && 'mb-2'}  ${disabled && 'opacity-60'} ${pClassName}`} {...rest}>
                <div className={`flex rounded-full relative`}>
                    {label && (
                        <span
                            className={`inline-flex items-center rounded-lg border border-r-0 border-none ${
                                labelClassName?.includes('isAddress') ? 'py-0' : 'py-2'
                            } text-textBlack font-bold bg-white px-2 sm:px-4 text-sm sm:text-lg ${labelClassName}`}
                        >
                            {label}
                        </span>
                    )}
                    {!textarea ? (
                        <input
                            type={type === 'password' && showPassword ? 'text' : type}
                            name={name}
                            placeholder={placeholder}
                            value={value}
                            onChange={handleOnChange}
                            required={required}
                            // onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please provide this information.")}
                            disabled={disabled}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            ref={inputRef}
                            // if type is date, then disable the last 18 years from the calendar
                            max={
                                type === 'date' && name === 'dob'
                                    ? new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                          .toISOString()
                                          .split('T')[0]
                                    : dateMax || ''
                            }
                            min={dateMin || ''}
                            className={twMerge(
                                `  block w-full min-w-0 flex-1 pl-2 sm:pl-5 font-medium1 text-[#464242] rounded-full border-[1px] py-3 bg-white   ${
                                    isError ? 'focus:ring-red-500 focus:border-red-500 ' : ''
                                }  text-sm sm:text-lg placeholder:text-black/50  ${inputClassName}  ${
                                    labelClassName?.includes('isAddress') && 'rounded-lg'
                                }`
                            )}
                        />
                    ) : (
                        <textarea
                            name={name}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => handleOnChange(e)}
                            required={required}
                            disabled={disabled}
                            className={twMerge(
                                `  block w-full min-w-0 flex-1 pl-2 sm:pl-5 font-bold text-primaryIndigo  rounded-lg border-none py-3 bg-primaryIndigoLight   ${
                                    isError
                                        ? 'focus:ring-red-500 focus:border-red-500 '
                                        : 'focus:border-primaryIndigo focus:ring-primaryIndigo'
                                }  text-sm sm:text-lg placeholder:text-primaryIndigo/50 ${inputClassName}`
                            )}
                            rows={5}
                        />
                    )}
                    {type === 'password' && (
                        <div
                            className='cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword ? (
                                <EyeSlashIcon className='h-5 w-5 text-secondaryBlue' aria-hidden='true' />
                            ) : (
                                <EyeIcon className='h-5 w-5 text-secondaryBlue' aria-hidden='true' />
                            )}
                        </div>
                    )}
                    {isError && type != 'password' && (
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                            <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden='true' />
                        </div>
                    )}
                    {isError && (
                        <div className='absolute bottom-0 py-1 translate-y-full '>
                            <p className='FORM_ERROR_EXISTS text-red-500 text-sm font-medium '>
                                {maxLengthError
                                    ? `Cannot exceed ${validation?.maxLength} characters`
                                    : validation?.errorMsg
                                    ? validation?.errorMsg
                                    : 'invalid input'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileInput;
