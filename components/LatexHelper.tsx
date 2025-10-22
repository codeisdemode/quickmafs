import React from 'react';

interface LatexHelperProps {
    onInsert: (latex: string, cursorPosOffset: number) => void;
}

const buttons = [
    { label: 'a/b', value: '\\frac{}{}', offset: 6, title: 'Fraction' },
    { label: 'xⁿ', value: '^{}', offset: 2, title: 'Exponent' },
    { label: '√x', value: '\\sqrt{}', offset: 6, title: 'Square Root' },
    { label: '∫', value: '\\int_{}^{}', offset: 5, title: 'Integral' },
    { label: 'Σ', value: '\\sum_{}^{}', offset: 5, title: 'Summation' },
    { label: 'π', value: '\\pi ', offset: 4, title: 'Pi' },
    { label: 'θ', value: '\\theta ', offset: 7, title: 'Theta' },
    { label: '∞', value: '\\infty ', offset: 8, title: 'Infinity' },
];

export const LatexHelper: React.FC<LatexHelperProps> = ({ onInsert }) => {
    return (
        <div className="pt-2">
            <div className="flex flex-wrap items-center gap-1">
                <span className="text-xs text-gray-500 font-medium mr-2">Symbols:</span>
                {buttons.map(({ label, value, offset, title }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => onInsert(value, offset)}
                        title={`Insert ${title}`}
                        className="px-2.5 py-1 text-sm font-mono bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};
