import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UploadIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21 6.75l-3.75-3.75L15.47 4.78l3.75 3.75L21 6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15H7.5A2.5 2.5 0 015 12.5V7.5A2.5 2.5 0 017.5 5H15V9" />
    </svg>
);

export const SendIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const ResetIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-3.183l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.181 3.183" />
    </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.48-2.122l-4.06-4.06a3 3 0 010-4.242l2.12-2.122a3 3 0 014.242 0l4.06 4.06a3 3 0 002.122 3.48m1.118-2.973a3 3 0 014.242 0l2.122 2.122a3 3 0 010 4.242l-4.06 4.06a3 3 0 01-4.242 0l-2.122-2.122m-2.122-4.242l-.53-2.651a3 3 0 012.651-.53m-2.122.53l-2.651.53m2.122-4.242l.53 2.651m-2.122-.53l2.651-.53M3 3l3.53 3.53m0 0a3 3 0 010 4.242l-2.122 2.122a3 3 0 01-4.242 0L.146 9.854a3 3 0 010-4.242L2.268 3.49a3 3 0 014.242 0M3 3l2.122 2.122m0 0a3 3 0 004.242 0l3.53-3.53" />
    </svg>
);