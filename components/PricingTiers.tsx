
// components/PricingTiers.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useI18n } from '../contexts/I18nContext.tsx';
import { PlanTier } from '../types.ts';
import { createCheckoutSession } from '../services/paymentService.ts';
import { CheckCircleIcon } from './icons/Icon.tsx';

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

    const handleSubscribe = async (priceId: string) => {
        setIsLoading(priceId);
        try {
            const { url } = await createCheckoutSession(priceId);
            if (url) {
                window.location.href = url;
            } else {
                throw new Error("Impossible de créer la session de paiement.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Une erreur est survenue lors de la redirection vers la page de paiement.");
            setIsLoading(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{t('billing.title')}</h1>
            <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400">
                {t('billing.subheadline')}
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {tiersData.map(tier => {
                    // The `t` function needs to be told this key returns an array
                    const features = t(tier.featuresKey) as unknown as string[];
                    return (
                        <div key={tier.name} className={`bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-lg flex flex-col ${tier.isFeatured ? 'border-2 border-brand-accent' : ''}`}>
                            {tier.isFeatured && <span className="bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">{t('billing.recommended')}</span>}
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{tier.name}</h2>
                            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{tier.price}</p>
                            
                            <ul className="mt-8 space-y-4 text-gray-600 dark:text-gray-300 flex-grow">
                                {features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(tier.priceId)}
                                disabled={user?.role === 'CLONE' && user.plan === tier.name || !!isLoading}
                                className="mt-8 w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-brand-accent hover:bg-opacity-90"
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
