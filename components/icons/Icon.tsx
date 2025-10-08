import React from 'react';

type IconProps = {
  className?: string;
};

// Generic SVG props
const svgProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: "1.5",
  stroke: "currentColor",
};

export const MenuIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 48 48" className={className}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.223 0-9.64-3.657-11.303-8H6.306C9.656 39.663 16.318 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.24 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);


export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M3 10.5v9.75a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V10.5M9 21V12h6v9" /></svg>
);

// Fix: Add missing LockIcon.
export const LockIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
);

// Fix: Add missing MessageIcon.
export const MessageIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.345c-.44.041-.882.122-1.305.242a5.986 5.986 0 01-2.995.242c-1.123 0-2.21-.356-3.134-.958a5.986 5.986 0 01-2.02-2.133 5.986 5.986 0 01-.5-2.133 6.01 6.01 0 01.242-2.995c.12-.423.201-.865.242-1.305l.345-3.722c.093-1.133.956-1.98 2.097-1.98h4.286c.97 0 1.813.616 2.097 1.5z" /></svg>
);

// --- Redesigned Landing Page Icons ---
export const VaultIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C9.23858 2 7 4.23858 7 7V11H17V7C17 4.23858 14.7614 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 11H19V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 15.5V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const VoiceWaveIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
// --- End Redesigned Icons ---


export const BillingIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-6 2.25h6M12 9.75l.487.032a1.875 1.875 0 011.648 1.282l.523 1.437a1.875 1.875 0 001.648 1.282l1.437.523a1.875 1.875 0 010 3.3l-1.437.523a1.875 1.875 0 00-1.648 1.282l-.523 1.437a1.875 1.875 0 01-1.648 1.282L12 21M3.375 9.75l.487.032a1.875 1.875 0 001.648 1.282l.523 1.437a1.875 1.875 0 011.648 1.282l1.437.523a1.875 1.875 0 000 3.3l-1.437.523a1.875 1.875 0 01-1.648 1.282l-.523 1.437a1.875 1.875 0 00-1.648 1.282L3 21m0 0h2.125" /></svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226M12 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 2.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 11.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM17.65 6.35a1.5 1.5 0 10-2.122-2.122 1.5 1.5 0 002.122 2.122zM6.35 17.65a1.5 1.5 0 10-2.122-2.122 1.5 1.5 0 002.122 2.122zM21.75 12a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM3.75 12a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM17.65 17.65a1.5 1.5 0 102.122-2.122 1.5 1.5 0 00-2.122 2.122zM6.35 6.35a1.5 1.5 0 102.122-2.122 1.5 1.5 0 00-2.122 2.122z" /></svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path d="M15.5 13.5c1-1.5 1.5-3.5 1-5.5-1-3-4-4.5-6.5-4.5-3 0-5.5 1-7 3.5-1 2-1.5 4.5 0 6.5 1 1.5 2.5 2.5 4.5 3v4.5c0 1 .5 1.5 1.5 1.5h1c1 0 1.5-.5 1.5-1.5v-3c1.5-1 2.5-2 3.5-3.5zm-10-3c0-2 1.5-4.5 3.5-5.5 2.5-1 5 0 6 2.5.5 2.5-1 4.5-3 5.5-2.5 1-5 0-6.5-2.5z" stroke="none" fill="currentColor"/></svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} fill="currentColor" className={className}><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 13.5z" /></svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.964A5.25 5.25 0 0112 10.5a5.25 5.25 0 015.25 5.25m-10.5 0a5.25 5.25 0 015.25-5.25m-5.25 5.25V18m0-1.5a5.25 5.25 0 1110.5 0m-10.5 0a5.25 5.25 0 1110.5 0" /></svg>
);

export const MicrophoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0c-1.67-.253-3.287-.673-4.83-1.243a.75.75 0 01-.298-1.205A8.217 8.217 0 004.5 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0L15 17.625h-6l.752 1.275z" clipRule="evenodd" /></svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 4.811 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

export const UploadCloudIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.168.05l8.25 4.5a.75.75 0 010 1.318l-8.25 4.5a.75.75 0 01-.168.05l-8.25-4.5a.75.75 0 010-1.318l8.25-4.5a.75.75 0 01.168-.05zM12 6.953 9.428 8.428l2.572 1.472L14.572 8.428 12 6.953zm-2.572 3.474L6.856 12l2.572 1.473 2.572-1.473L9.428 10.428z" clipRule="evenodd" /></svg>
);

export const FileTextIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
);

export const WarningIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M11.986 2.63a.75.75 0 01.028 0l9.333 16.167a.75.75 0 01-.659 1.203H2.25a.75.75 0 01-.659-1.203L11.986 2.63zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08m-1.186 0c-.195.025-.39.05-.588.08m1.186 0h4.5a2.25 2.25 0 100-2.186m-4.5 2.186c-.195.025-.39.05-.588.08m0 0a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08m0 0h4.5a2.25 2.25 0 100-2.186m-12.25-6.186a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08m-1.186 0c-.195.025-.39.05-.588.08m1.186 0h4.5a2.25 2.25 0 100-2.186m-4.5 2.186c-.195.025-.39.05-.588.08m0 0a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08" /></svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M11.25 2.25c-1.24 0-2.25.985-2.25 2.193V6.75h4.5V4.443c0-1.208-1.01-2.193-2.25-2.193zM9 6.75V4.443c0-1.921 1.6-3.443 3.5-3.443s3.5 1.522 3.5 3.443V6.75h2.153a1.5 1.5 0 011.5 1.5v9.375a1.5 1.5 0 01-1.5 1.5H3.347a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5H9zm1.5 9a.75.75 0 000-1.5h-3a.75.75 0 000 1.5h3z" clipRule="evenodd" /></svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 013 6.993V6.75" /></svg>
);

export const DevicePhoneMobileIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3.75 0V3m3.75 0V3m-3.75 0h3.75" /></svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M9 2.25a.75.75 0 00-.75.75v16.5a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75zm6.25.75a.75.75 0 00-1.5 0v16.5a.75.75 0 001.5 0V3zm-3.25.75a.75.75 0 00-1.5 0v16.5a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75zm-6.5.75a.75.75 0 00-1.5 0v16.5a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75zM21 3a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5h1.5A.75.75 0 0021 3z" clipRule="evenodd" /></svg>
);

export const UserGroupIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className} fill="currentColor"><path d="M4.5 6.375a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zM4.5 10.125a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zM5.25 13.5a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5H5.25z" /><path fillRule="evenodd" d="M16.5 3.75a3 3 0 00-3-3H6a3 3 0 00-3 3v16.5a3 3 0 003 3h7.5a3 3 0 003-3V3.75zm-3.75 2.25a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" /></svg>
);

export const ShieldExclamationIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className} fill="currentColor"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.168.05l8.25 4.5a.75.75 0 010 1.318l-8.25 4.5a.75.75 0 01-.168.05l-8.25-4.5a.75.75 0 010-1.318l8.25-4.5a.75.75 0 01.168-.05zM12 6.953 9.428 8.428l2.572 1.472L14.572 8.428 12 6.953zm-2.572 3.474L6.856 12l2.572 1.473L12 12.721l2.572.752L12 14.947l-2.572-1.473zM12 15.75a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
);

export const CCGIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

export const RGPDPIcon: React.FC<IconProps> = ({ className }) => (
    <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.344.652-.705.923-1.085A11.953 11.953 0 0021.482 12c0-1.74-.253-3.414-.72-5.016z" /></svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className} fill="currentColor"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...svgProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
);