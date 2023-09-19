import { twMerge } from 'tailwind-merge';
import Loader from './Loading';
const CrButton = ({ name, fn, styles, loading, disabled }) => {
    return (
        <button
            disabled={disabled || loading}
            onClick={() => fn()}
            className={twMerge(
                `font-['lato'] h-[34px] px-6 w-fit 
            bg-secondaryBlue text-white mt-4 hover:opacity-[0.8] dark-shadow
            rounded-md flex items-center justify-center mx-auto font-bold`,
                styles,
                `${disabled || loading ? 'bg-primary/50 cursor-not-allowed' : ''}`
            )}
        >
            {loading ? <Loader /> : name}
        </button>
    );
};

export default CrButton;
