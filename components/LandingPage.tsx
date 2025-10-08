// components/LandingPage.tsx
import React, { useState } from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import {
    PlayIcon,
    CheckCircleIcon,
    PlusIcon,
    ShieldCheckIcon,
    VoiceWaveIcon,
    VaultIcon,
    ShieldIcon,
    MenuIcon
} from './icons/Icon.tsx';

interface LandingPageProps {
    onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const { t } = useI18n();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Safely get translation data, ensuring it's an array before mapping
    const faqData = t('landingPage.faq.questions') || [];
    const pricingData = t('landingPage.pricing.tiers') || [];
    const valuePropsData = t('landingPage.valueProps') || [];
    const howItWorksData = t('landingPage.howItWorks.steps') || [];
    const securityFeatures = t('landingPage.security.features') || [];
    const testimonialsData = t('landingPage.testimonials.quotes') || [];

    const valuePropIcons = [
        <VoiceWaveIcon className="w-12 h-12 text-gold" />,
        <VaultIcon className="w-12 h-12 text-gold" />,
        <ShieldIcon className="w-12 h-12 text-gold" />
    ];

    const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
        const handleLinkClick = () => {
            if (isMobile) setIsMobileMenuOpen(false);
        };
        const handleLoginClick = () => {
            onLoginClick();
            if (isMobile) setIsMobileMenuOpen(false);
        }
        
        const baseClasses = isMobile ? "block py-2 text-lg" : "";

        return (
            <>
                <a href="#how-it-works" onClick={handleLinkClick} className={`${baseClasses} hover:text-gold dark:hover:text-gold transition-colors`}>{t('landingPage.header.howItWorks')}</a>
                <a href="#security" onClick={handleLinkClick} className={`${baseClasses} hover:text-gold dark:hover:text-gold transition-colors`}>{t('landingPage.header.security')}</a>
                <a href="#pricing" onClick={handleLinkClick} className={`${baseClasses} hover:text-gold dark:hover:text-gold transition-colors`}>{t('landingPage.header.pricing')}</a>
                <a href="#faq" onClick={handleLinkClick} className={`${baseClasses} hover:text-gold dark:hover:text-gold transition-colors`}>{t('landingPage.header.faq')}</a>
                <button onClick={handleLoginClick} className={`${baseClasses} hover:text-gold dark:hover:text-gold transition-colors`}>{t('landingPage.header.login')}</button>
            </>
        )
    };

    return (
        <div className="bg-off-white dark:bg-deep-blue text-gray-800 dark:text-gray-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-deep-blue/80 backdrop-blur-sm shadow-sm">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <button onClick={onLoginClick} className="text-2xl font-bold text-gray-800 dark:text-white transition-colors hover:text-gold dark:hover:text-gold">SoulBox</button>
                    <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300 font-medium">
                       <NavLinks />
                    </div>
                    <div className="flex items-center space-x-4">
                         <button onClick={onLoginClick} className="bg-gold text-white font-bold py-2 px-5 rounded-full hover:opacity-90 transition-opacity text-sm shadow-md hidden sm:block">
                            {t('landingPage.header.ctaTest')}
                        </button>
                        <LanguageSwitcher />
                         <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open menu">
                                <MenuIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                            </button>
                        </div>
                    </div>
                </nav>
                 {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-deep-blue shadow-lg absolute w-full">
                        <div className="container mx-auto px-6 py-4 flex flex-col items-center space-y-4 text-gray-700 dark:text-gray-300">
                           <NavLinks isMobile />
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative text-white text-center py-32 px-6 overflow-hidden min-h-[70vh] flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488998527040-77b948a1e838?q=80&w=2670&auto=format&fit=crop')` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/70 to-deep-blue/50"></div>
                    <div className="relative z-10 container mx-auto flex flex-col items-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">{t('landingPage.hero.h1')}</h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl font-light text-gray-200">{t('landingPage.hero.lead')}</p>
                        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button onClick={onLoginClick} className="bg-gold text-white font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
                                {t('landingPage.hero.ctaTry')}
                            </button>
                            <a href="#demo" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:text-deep-blue transition-colors flex items-center justify-center">
                                <PlayIcon className="w-5 h-5 mr-2" />
                                {t('landingPage.hero.ctaListen')}
                            </a>
                        </div>
                    </div>
                </section>
                
                {/* Value Propositions */}
                <section className="py-20 bg-off-white dark:bg-deep-blue">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Array.isArray(valuePropsData) && valuePropsData.map((prop: any, index: number) => (
                            <div key={index} className="bg-white dark:bg-brand-secondary p-8 rounded-xl shadow-lg text-center flex flex-col items-center transform transition-transform hover:-translate-y-2">
                                <div className="p-4 bg-gold/10 rounded-full mb-6">
                                    {valuePropIcons[index]}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{prop.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{prop.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-brand-dark">
                    <div className="container mx-auto px-6 text-center">
                         <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white">{t('landingPage.howItWorks.title')}</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Dotted line for desktop */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full transform -translate-y-1/2">
                                <svg width="100%" height="2"><line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" strokeDasharray="8 8" className="stroke-current text-gray-300 dark:text-gray-700"/></svg>
                            </div>
                             {Array.isArray(howItWorksData) && howItWorksData.map((step: any, index: number) => (
                                <div key={index} className="relative z-10 flex flex-col items-center">
                                     <div className="w-20 h-20 rounded-full bg-gold text-white flex items-center justify-center text-3xl font-bold mb-4 border-8 border-gray-50 dark:border-brand-dark shadow-md">{index + 1}</div>
                                     <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{step.body}</p>
                                </div>
                             ))}
                        </div>
                        <button onClick={onLoginClick} className="mt-16 bg-gold text-white font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-opacity shadow-lg">
                            {t('landingPage.howItWorks.cta')}
                        </button>
                    </div>
                </section>

                {/* Interactive Demo */}
                <section id="demo" className="py-20 bg-white dark:bg-brand-secondary">
                     <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('landingPage.demo.title')}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">{t('landingPage.demo.subtitle')}</p>
                        <div className="max-w-2xl mx-auto bg-off-white dark:bg-deep-blue p-6 rounded-lg shadow-inner">
                             <audio controls className="w-full">
                                <source src="" type="audio/mpeg" />
                                {t('common.browserNoAudio')}
                            </audio>
                             <p className="mt-4 text-left text-base text-gray-700 dark:text-gray-300 italic p-4 bg-gray-200 dark:bg-brand-tertiary rounded">"{t('landingPage.demo.transcription')}"</p>
                        </div>
                    </div>
                </section>
                
                {/* Security */}
                <section id="security" className="py-20 bg-gray-50 dark:bg-brand-dark">
                     <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('landingPage.security.title')}</h2>
                         <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">{t('landingPage.security.subtitle')}</p>
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                             {Array.isArray(securityFeatures) && securityFeatures.map((feature: string, index: number) => (
                                <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-brand-secondary shadow-sm">
                                    <ShieldCheckIcon className="w-10 h-10 text-gold mb-3"/>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{feature}</p>
                                </div>
                             ))}
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-20 bg-off-white dark:bg-deep-blue">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('landingPage.pricing.title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {Array.isArray(pricingData) && pricingData.map((tier: any, index: number) => (
                                <div key={index} className={`bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-lg flex flex-col transition-all duration-300 ${tier.isFeatured ? 'border-2 border-gold transform md:scale-105' : 'border dark:border-brand-tertiary'}`}>
                                    {tier.isFeatured && <span className="absolute -top-4 right-6 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">{t('billing.recommended')}</span>}
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                                    <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{tier.price}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('billing.perMonth')}</p>
                                    <ul className="mt-8 space-y-4 text-gray-600 dark:text-gray-300 flex-grow">
                                        {Array.isArray(tier.features) && tier.features.map((feature: string, fIndex: number) => (
                                            <li key={fIndex} className="flex items-start">
                                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={onLoginClick} className={`mt-8 w-full py-3 px-6 rounded-lg font-bold transition-colors ${tier.isFeatured ? 'bg-gold text-white hover:opacity-90' : 'bg-gray-200 dark:bg-brand-tertiary text-gray-800 dark:text-white hover:bg-gold hover:text-white'}`}>
                                        {tier.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                 {/* Testimonials */}
                <section className="py-20 bg-gray-50 dark:bg-brand-dark">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('landingPage.testimonials.title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array.isArray(testimonialsData) && testimonialsData.map((testimonial: any, index: number) => (
                                <div key={index} className="bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-lg">
                                    <p className="text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                                    <div className="mt-6 flex items-center">
                                        {/* Placeholder for avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gold/20 flex-shrink-0"></div>
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.relation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="py-20 bg-off-white dark:bg-deep-blue">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t('landingPage.faq.title')}</h2>
                        <div className="space-y-4">
                            {Array.isArray(faqData) && faqData.map((item: any, index: number) => (
                                <div key={index} className="bg-white dark:bg-brand-secondary rounded-lg shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex justify-between items-center text-left p-6"
                                    >
                                        <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{item.q}</span>
                                        <span className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`}>
                                            <PlusIcon className="w-6 h-6 text-gold"/>
                                        </span>
                                    </button>
                                    <div className={`transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                      <div className="p-6 pt-0">
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                                      </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-brand-secondary text-white">
                <div className="container mx-auto px-6 py-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold">SoulBox</h3>
                            <p className="mt-2 text-sm text-gray-400">{t('landingPage.hero.lead')}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">{t('landingPage.footer.productTitle')}</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li><a href="#how-it-works" className="text-gray-400 hover:text-gold">{t('landingPage.header.howItWorks')}</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-gold">{t('landingPage.header.pricing')}</a></li>
                                <li><a href="#security" className="text-gray-400 hover:text-gold">{t('landingPage.header.security')}</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold">{t('landingPage.footer.legalTitle')}</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-gold">{t('landingPage.footer.cgu')}</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-gold">{t('landingPage.footer.privacy')}</a></li>
                                 <li><a href="#" className="text-gray-400 hover:text-gold">{t('landingPage.footer.contact')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">{t('landingPage.footer.newsletterTitle')}</h4>
                             <form className="mt-4 flex">
                                <input type="email" placeholder={t('common.email')} className="w-full px-4 py-2 rounded-l-md bg-brand-tertiary border-none text-white focus:ring-2 focus:ring-gold"/>
                                <button type="submit" className="bg-gold px-4 rounded-r-md hover:opacity-90">{t('landingPage.footer.subscribe')}</button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-brand-tertiary pt-8 text-center text-gray-500 text-sm">
                        <p>{t('landingPage.footer.copyright', { year: new Date().getFullYear() })}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;