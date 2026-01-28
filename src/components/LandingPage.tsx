import React from 'react';

interface LandingPageProps {
    onLoginClick: () => void;
    language: 'en' | 'fr';
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, language }) => {
    const text = {
        hero: {
            title: language === 'fr' ? 'BÂTIR UN AVENIR DURABLE' : 'BUILDING A SUSTAINABLE FUTURE',
            subtitle: language === 'fr'
                ? 'INVESTISSEMENT STRATÉGIQUE ET DÉVELOPPEMENT COMMUNAUTAIRE AU CAMEROUN'
                : 'STRATEGIC INVESTMENT AND COMMUNITY DEVELOPMENT IN CAMEROON',
            cta: language === 'fr' ? 'ACCÈS MEMBRES' : 'MEMBER ACCESS'
        },
        about: {
            title: language === 'fr' ? 'NOTRE MISSION' : 'OUR MISSION',
            content: language === 'fr'
                ? "Great Ideas est une association dédiée à la création de valeur pour ses membres et au développement des communautés locales. Nous acquérons des actifs stratégiques, les valorisons par un développement rigoureux et redistribuons les bénéfices à travers des projets communautaires d'envergure."
                : "Great Ideas is an association dedicated to creating value for its members and developing local communities. We acquire strategic assets, enhance them through rigorous development, and redistribute benefits through impactful community projects."
        },
        services: [
            {
                title: language === 'fr' ? 'DÉVELOPPEMENT D\'ACTIFS' : 'ASSET DEVELOPMENT',
                content: language === 'fr'
                    ? 'Acquisition et valorisation de terrains pour la construction résidentielle et le développement urbain moderne.'
                    : 'Acquisition and enhancement of land for residential construction and modern urban development.',
                icon: '🏗️'
            },
            {
                title: language === 'fr' ? 'AGRO-INDUSTRIE' : 'AGRI-TRANSFORMATION',
                content: language === 'fr'
                    ? 'Exploitation de terres agricoles et transformation de produits pour une autonomie alimentaire locale.'
                    : 'Agricultural land management and product transformation for local food autonomy.',
                icon: '🚜'
            },
            {
                title: language === 'fr' ? 'COMMERCE LOCAL' : 'COMMODITY TRADING',
                content: language === 'fr'
                    ? 'Négoce de produits de consommation de base pour stabiliser et dynamiser les marchés locaux.'
                    : 'Trading of basic consumer commodities to stabilize and boost local markets.',
                icon: '📦'
            }
        ],
        community: {
            title: language === 'fr' ? 'IMPACT COMMUNAUTAIRE' : 'COMMUNITY IMPACT',
            content: language === 'fr'
                ? 'Au cœur de Douala et dans nos zones d\'opérations, nous œuvrons activement pour l\'amélioration des conditions de vie des populations défavorisées par des initiatives concrètes de développement.'
                : 'At the heart of Douala and throughout our operating zones, we actively work to improve the living conditions of underprivileged populations through concrete development initiatives.'
        },
        footer: {
            office: language === 'fr' ? 'SIÈGE SOCIAL : DOUALA, CAMEROUN' : 'HEADQUARTERS: DOUALA, CAMEROON',
            rights: '© 2026 GREAT IDEAS ASSOCIATION. ALL RIGHTS RESERVED.'
        }
    };

    return (
        <div style={{ background: '#FFFFFF', color: '#000000', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header / Navigation */}
            <nav style={{
                background: '#000000',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--spacing-xl)',
                borderBottom: '4px solid #CC0000',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 'var(--font-size-xl)', letterSpacing: '-0.04em' }}>
                    GREAT <span style={{ color: '#CC0000' }}>IDEAS</span>
                </div>
                <button
                    onClick={onLoginClick}
                    style={{
                        background: '#CC0000',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: 'var(--spacing-xs) var(--spacing-lg)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        fontSize: 'var(--font-size-xs)',
                        letterSpacing: '0.1em',
                        cursor: 'pointer'
                    }}
                >
                    {text.hero.cta}
                </button>
            </nav>

            {/* Hero Section */}
            <header style={{
                padding: '120px var(--spacing-xl)',
                textAlign: 'center',
                borderBottom: '1px solid #000',
                background: '#000',
                color: '#FFF'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.04em'
                    }}>
                        {text.hero.title}
                    </h1>
                    <p style={{
                        marginTop: 'var(--spacing-xl)',
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 700,
                        color: '#CC0000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {text.hero.subtitle}
                    </p>
                </div>
            </header>

            {/* Mission Section */}
            <section style={{ padding: '80px var(--spacing-xl)', background: '#F8F8F8' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#CC0000', textTransform: 'uppercase', marginBottom: 'var(--spacing-md)', letterSpacing: '0.1em' }}>
                            {text.about.title}
                        </h2>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, lineHeight: 1.2, margin: 0, textTransform: 'uppercase' }}>
                            {text.about.content}
                        </p>
                    </div>
                    <div style={{ height: '400px', border: '8px solid #000', background: '#DDD' }}>
                        {/* Placeholder for an impactful image */}
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                            🌍
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <section style={{ padding: '80px var(--spacing-xl)', borderBottom: '1px solid #EEE' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, marginBottom: '60px', textTransform: 'uppercase', borderLeft: '12px solid #CC0000', paddingLeft: '20px' }}>
                        {language === 'fr' ? 'DOMAINES D\'INTERVENTION' : 'FIELDS OF INTERVENTION'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {text.services.map((service, i) => (
                            <div key={i} style={{ border: '4px solid #000', padding: '40px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{service.icon}</div>
                                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase' }}>
                                    {service.title}
                                </h3>
                                <p style={{ fontSize: 'var(--font-size-md)', color: '#444', fontWeight: 600, lineHeight: 1.5 }}>
                                    {service.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section style={{ padding: '80px var(--spacing-xl)', background: '#000', color: '#FFF' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#CC0000', textTransform: 'uppercase', marginBottom: '20px' }}>
                        {text.community.title}
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, lineHeight: 1.1, textTransform: 'uppercase' }}>
                        {text.community.content}
                    </p>
                    <div style={{ marginTop: '40px', fontWeight: 900, color: '#AAA', fontSize: 'var(--font-size-sm)' }}>
                        📍 {text.footer.office}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '40px var(--spacing-xl)', textAlign: 'center', borderTop: '4px solid #000' }}>
                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: '#666' }}>
                    {text.footer.rights}
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
