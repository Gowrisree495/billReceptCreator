import React from 'react';

const Header = ({ lang, languages, onLangSwitch, isMuted, onToggleMute, theme, onToggleTheme }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center transition-colors duration-300">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-widest">BILL<span className="text-emerald-600 dark:text-emerald-500">BOOK</span></h1>

            <div className="flex items-center space-x-3">
                {/* Controls Group */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-slate-900 rounded-lg p-1">
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-md text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <span className="material-icons text-sm">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button
                        onClick={onToggleMute}
                        className="p-2 rounded-md text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <span className="material-icons text-sm">{isMuted ? 'volume_off' : 'volume_up'}</span>
                    </button>
                </div>

                {/* Language Switcher */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-slate-900 rounded-lg p-1">
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => onLangSwitch(l.code)}
                            className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${lang === l.code ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300'}`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
