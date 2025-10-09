// components/PricingTiers.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { PlanTier } from '../types';
import { createCheckoutSession } from '../services/paymentService';
import { CheckCircleIcon } from './icons/Icon';

interface Tier {
    name: PlanTier;
    priceId: string; // Stripe Price ID
    price: string;
    featuresKey: string;
    isFeatured?: boolean;
}

const tiersData: Tier[] = [
    {
        name: PlanTier.STANDARD,
        priceId: 'price_standard_monthly',
        price: '9.99€/mois',
        featuresKey: 'billing.featuresStandard',
    },
    {
        name: PlanTier.PREMIUM,
        priceId: 'price_premium_monthly',
        price: '19.99€/mois',
        featuresKey: 'billing.featuresPremium',
        isFeatured: true,
    },
    {
        name: PlanTier.PREMIUM_PLUS,
        priceId: 'price_premium_plus_monthly',
        price: '29.99€/mois',
        featuresKey: 'billing.featuresPremiumPlus',
    }
];


const PricingTiers: React.FC = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string) => {
        setIsLoading(priceId);
        setError(null);
        try {
            const { url } = await createCheckoutSession(priceId);
            if (url) {
                window.location.href = url;
            } else {
                throw new Error(t('billing.checkoutError'));
            }
        } catch (err) {
            console.error("Payment error:", err);
            const message = err instanceof Error ? err.message : t('billing.checkoutError');
            setError(message);
            setIsLoading(null);
        }
    };

    return (
        <div style={{textAlign: 'center'}}>
            <h1 className="page-title">{t('billing.title')}</h1>
            <p className="page-subheadline">
                {t('billing.subheadline')}
            </p>
            
            {error && (
                <div className="error-box" style={{marginTop: '2rem', maxWidth: '56rem', margin: '2rem auto 0'}}>
                    <p style={{margin: 0}}>{error}</p>
                </div>
            )}

            <div className="dashboard-stats-grid" style={{maxWidth: '56rem', margin: '3rem auto 0'}}>
                {tiersData.map(tier => {
                    // The `t` function needs to be told this key returns an array
                    const features = t(tier.featuresKey) as unknown as string[];
                    return (
                        <div key={tier.name} className={`card ${tier.isFeatured ? 'featured' : ''}`} style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                            {tier.isFeatured && <span style={{backgroundColor: 'var(--brand-accent)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', alignSelf: 'flex-start', marginBottom: '1rem'}}>{t('billing.recommended')}</span>}
                            <h2 className="h2">{tier.name}</h2>
                            <p style={{marginTop: '1rem', fontSize: '2.25rem', fontWeight: 700}}>{tier.price}</p>
                            
                            <ul style={{marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, listStyle: 'none', padding: 0}}>
                                {features.map(feature => (
                                    <li key={feature} style={{display: 'flex', alignItems: 'flex-start'}}>
                                        <CheckCircleIcon style={{width: '1.25rem', height: '1.25rem', color: 'var(--color-success)', marginRight: '0.75rem', marginTop: '0.25rem', flexShrink: 0}} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(tier.priceId)}
                                disabled={user?.role === 'CLONE' && user.plan === tier.name || !!isLoading}
                                className="btn btn-primary w-full"
                                style={{marginTop: '2rem'}}
                            >
                                {isLoading === tier.priceId ? t('billing.redirecting') : (user?.role === 'CLONE' && user.plan === tier.name ? t('billing.currentPlan') : t('billing.choosePlan'))}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default PricingTiers;