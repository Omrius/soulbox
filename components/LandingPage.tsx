// components/LandingPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../contexts/I18nContext.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { 
    PlayIcon,
    CheckCircleIcon,
    PlusIcon,
    VoiceWaveIcon,
    VaultIcon,
    ShieldIcon,
    MenuIcon
} from './icons/Icon.tsx';
import { fetchLegalDocuments } from '../services/authService.ts';
import { LegalDocuments } from '../types.ts';

interface LandingPageProps {
    onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const { t } = useI18n();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [legalDocs, setLegalDocs] = useState<LegalDocuments>({});
    const [activeSection, setActiveSection] = useState<string>('');

    const navLinks = useMemo(() => [
        { key: 'landingPage.header.product', href: '#product', id: 'product' },
        { key: 'landingPage.header.howItWorks', href: '#how-it-works', id: 'how-it-works' },
        { key: 'landingPage.header.security', href: '#security', id: 'security' },
        { key: 'landingPage.header.pricing', href: '#pricing', id: 'pricing' },
        { key: 'landingPage.header.faq', href: '#faq', id: 'faq' },
    ], []);

    useEffect(() => {
        const handleScroll = () => {
            // Header height is roughly 80px, add a small offset
            const scrollPosition = window.scrollY + 85;
            let newActiveSection = '';

            // Find the last section whose top is above the current scroll position
            for (const link of navLinks) {
                const section = document.getElementById(link.id);
                if (section && section.offsetTop <= scrollPosition) {
                    newActiveSection = link.href;
                } else {
                    break;
                }
            }
            
            if (newActiveSection !== activeSection) {
                setActiveSection(newActiveSection);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check on load
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navLinks, activeSection]);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    useEffect(() => {
        const loadLegalDocs = async () => {
            const docs = await fetchLegalDocuments();
            setLegalDocs(docs);
        };
        loadLegalDocs();
    }, []);
    
    const valuePropsIcons = [
        <VoiceWaveIcon key="voice" />,
        <VaultIcon key="vault" />,
        <ShieldIcon key="shield" />
    ];

    const handleNavLinkClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-header">
                <div className="landing-container landing-header__container">
                    <a href="/" className="landing-header__logo">SoulBox</a>
                    <nav className={`landing-header__nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
                        {navLinks.map(link => (
                            <a 
                                key={link.key} 
                                href={link.href} 
                                onClick={handleNavLinkClick} 
                                className={`landing-header__nav-link ${activeSection === link.href ? 'active' : ''}`}
                            >
                                {t(link.key)}
                            </a>
                        ))}
                        <div className="landing-header__mobile-actions">
                             <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="btn btn-secondary">{t('landingPage.header.login')}</a>
                             <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="btn btn-primary">{t('landingPage.header.ctaTest')}</a>
                        </div>
                    </nav>
                    <div className="landing-header__actions">
                        <LanguageSwitcher />
                        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="landing-header__login-btn">{t('landingPage.header.login')}</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="btn btn-primary">{t('landingPage.header.ctaTest')}</a>
                    </div>
                    <button className="landing-header__mobile-toggle" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                        <MenuIcon />
                    </button>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="landing-container hero-section__container">
                        <h1 className="hero-section__title">{t('landingPage.hero.h1')}</h1>
                        <p className="hero-section__lead">{t('landingPage.hero.lead')}</p>
                        <div className="hero-section__actions">
                            <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="btn btn-primary btn--large">{t('landingPage.hero.ctaTry')}</a>
                            <a href="#demo" className="btn btn-secondary btn--large">{t('landingPage.hero.ctaListen')}</a>
                        </div>
                    </div>
                </section>

                {/* Value Props Section */}
                <section id="product" className="value-props-section">
                    <div className="landing-container">
                        <div className="value-props-grid">
                            {(t('landingPage.valueProps') as any[]).map((prop, index) => (
                                <div key={index} className="value-prop-card">
                                    <div className="value-prop-card__icon">{valuePropsIcons[index]}</div>
                                    <h3 className="value-prop-card__title">{prop.title}</h3>
                                    <p className="value-prop-card__body">{prop.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="how-it-works-section">
                    <div className="landing-container">
                        <h2 className="section-title">{t('landingPage.howItWorks.title')}</h2>
                        <div className="how-it-works__steps-grid">
                            {(t('landingPage.howItWorks.steps') as any[]).map((step, index) => (
                                <div key={index} className="how-it-works__step">
                                    <div className="how-it-works__step-number">0{index + 1}</div>
                                    <h3 className="how-it-works__step-title">{step.title}</h3>
                                    <p className="how-it-works__step-body">{step.body}</p>
                                </div>
                            ))}
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="btn btn-primary btn--large">{t('landingPage.howItWorks.cta')}</a>
                    </div>
                </section>

                {/* Demo Section */}
                <section id="demo" className="demo-section">
                    <div className="landing-container">
                         <h2 className="section-title">{t('landingPage.demo.title')}</h2>
                         <p className="section-subtitle">{t('landingPage.demo.subtitle')}</p>
                         <div className="demo__audio-player">
                            <button className="demo__play-btn"><PlayIcon /></button>
                            <div className="demo__transcription">
                                <p>"{t('landingPage.demo.transcription')}"</p>
                            </div>
                         </div>
                    </div>
                </section>
                
                {/* Security Section */}
                <section id="security" className="security-section">
                    <div className="landing-container">
                         <h2 className="section-title">{t('landingPage.security.title')}</h2>
                         <p className="section-subtitle">{t('landingPage.security.subtitle')}</p>
                         <div className="security__features-list">
                            {(t('landingPage.security.features') as string[]).map(feature => (
                                <span key={feature} className="security__feature-tag">{feature}</span>
                            ))}
                         </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="pricing-section">
                    <div className="landing-container">
                        <h2 className="section-title">{t('landingPage.pricing.title')}</h2>
                        <div className="pricing-grid">
                            {(t('landingPage.pricing.tiers') as any[]).map(tier => (
                                <div key={tier.name} className={`pricing-tier ${tier.isFeatured ? 'is-featured' : ''}`}>
                                    {tier.isFeatured && <div className="pricing-tier__featured-badge">{t('billing.recommended')}</div>}
                                    <h3 className="pricing-tier__name">{tier.name}</h3>
                                    <p className="pricing-tier__price">{tier.price}<span>/mois</span></p>
                                    <ul className="pricing-tier__features">
                                        {(tier.features as string[]).map(feature => (
                                            <li key={feature}><CheckCircleIcon /><span>{feature}</span></li>
                                        ))}
                                    </ul>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="btn btn-primary w-full">{tier.cta}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* Testimonials Section */}
                <section className="testimonials-section">
                    <div className="landing-container">
                        <h2 className="section-title">{t('landingPage.testimonials.title')}</h2>
                        <div className="testimonials-grid">
                             {(t('landingPage.testimonials.quotes') as any[]).map((testimonial, index) => (
                                <blockquote key={index} className="testimonial-card">
                                    <p className="testimonial-card__quote">"{testimonial.quote}"</p>
                                    <footer className="testimonial-card__author">
                                        <cite className="testimonial-card__name">{testimonial.name}</cite>
                                        <span className="testimonial-card__relation">{testimonial.relation}</span>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="faq-section">
                    <div className="landing-container">
                        <h2 className="section-title">{t('landingPage.faq.title')}</h2>
                        <div className="faq-accordion">
                            {(t('landingPage.faq.questions') as any[]).map((item, index) => (
                                <div key={index} className={`faq-item ${openFaq === index ? 'is-open' : ''}`}>
                                    <button className="faq-item__question" onClick={() => toggleFaq(index)}>
                                        <span>{item.q}</span>
                                        <PlusIcon className="faq-item__icon" />
                                    </button>
                                    <div className="faq-item__answer-wrapper">
                                        <div className="faq-item__answer">
                                            <p>{item.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container landing-footer__container">
                    <div className="landing-footer__main">
                        <div>
                            <h3 className="landing-footer__title">{t('landingPage.footer.productTitle')}</h3>
                            <ul className="landing-footer__links">
                                {navLinks.map(link => (
                                    <li key={link.key}><a href={link.href}>{t(link.key)}</a></li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h3 className="landing-footer__title">{t('landingPage.footer.legalTitle')}</h3>
                            <ul className="landing-footer__links">
                                {legalDocs.cgu && <li><a href={legalDocs.cgu.url} target="_blank" rel="noopener noreferrer">{t('landingPage.footer.cgu')}</a></li>}
                                {legalDocs.privacy && <li><a href={legalDocs.privacy.url} target="_blank" rel="noopener noreferrer">{t('landingPage.footer.privacy')}</a></li>}
                                {legalDocs.legal && <li><a href={legalDocs.legal.url} target="_blank" rel="noopener noreferrer">{t('landingPage.footer.legal')}</a></li>}
                                {legalDocs.contact && <li><a href={legalDocs.contact.url} target="_blank" rel="noopener noreferrer">{t('landingPage.footer.contact')}</a></li>}
                            </ul>
                        </div>
                        <div className="landing-footer__newsletter">
                             <h3 className="landing-footer__title">{t('landingPage.footer.newsletterTitle')}</h3>
                             <form className="landing-footer__form">
                                <input type="email" placeholder={t('common.email')} className="form-input" />
                                <button type="submit" className="btn btn-primary">{t('landingPage.footer.subscribe')}</button>
                             </form>
                        </div>
                    </div>
                    <div className="landing-footer__bottom">
                        <p>{t('landingPage.footer.copyright', { year: new Date().getFullYear() })}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;