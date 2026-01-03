import React, { useRef } from 'react';

const SmartRow = ({
    label,
    value,
    onChange,
    icon,
    type = "text",
    onMicClick,
    isListening,
    placeholder,
    readOnly = false,
    activeColor = "border-red-500",
    inactiveColor = "border-transparent",
    iconColor = "text-emerald-400",
    onClick,
    error,
    required
}) => {
    const inputRef = useRef(null);
    const borderColor = error ? "border-red-500" : (isListening ? activeColor : inactiveColor);

    const handleContainerClick = () => {
        if (onClick) {
            onClick();
        } else if (inputRef.current) {
            if (type === 'date' && inputRef.current.showPicker) {
                inputRef.current.showPicker();
            } else if (!readOnly) {
                inputRef.current.focus();
            }
        }
    };

    return (
        <div>
            <div
                className={`relative flex items-center bg-white dark:bg-slate-900 rounded-xl p-4 border-2 transition-colors duration-200 ${borderColor} focus-within:border-emerald-500 dark:focus-within:border-slate-700 border-gray-200 dark:border-transparent shadow-sm dark:shadow-none`}
                onClick={handleContainerClick}
            >
                {/* Icon */}
                <div className={`flex-shrink-0 mr-4 ${iconColor}`}>
                    <span className="material-icons text-3xl">{icon}</span>
                </div>

                {/* Input / Label */}
                <div className="flex-grow">
                    <label className="block text-gray-500 dark:text-slate-400 text-xs mb-1 uppercase tracking-wider font-bold">
                        {label} {required && <span className="text-red-500 text-lg leading-none">*</span>}
                    </label>
                    {type === 'date' ? (
                        <input
                            ref={inputRef}
                            type="date"
                            className="w-full bg-transparent text-gray-900 dark:text-white text-xl font-bold outline-none placeholder-gray-400 dark:placeholder-slate-600 appearance-none"
                            value={value}
                            onChange={onChange}
                            readOnly={readOnly}
                            style={{ colorScheme: 'light dark' }}
                        />
                    ) : (
                        <input
                            ref={inputRef}
                            type={type}
                            className="w-full bg-transparent text-gray-900 dark:text-white text-xl font-bold outline-none placeholder-gray-400 dark:placeholder-slate-600"
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            readOnly={readOnly}
                        />
                    )}
                </div>

                {/* Mic Button */}
                {onMicClick && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMicClick();
                        }}
                        className={`flex-shrink-0 p-3 rounded-full transition-all ${isListening ? 'bg-red-600 animate-pulse text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                    >
                        <span className="material-icons">{isListening ? 'mic' : 'mic_none'}</span>
                    </button>
                )}
            </div>
            {error && <div className="text-red-500 text-xs px-4 -mt-3 mb-4 font-bold animate-pulse">{error}</div>}
            {!error && <div className="mb-4"></div>}
        </div>
    );
};

export default SmartRow;
