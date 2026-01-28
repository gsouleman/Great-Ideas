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
                ? "Great Ideas est une association dédiée à la création de valeur pour ses membres et au développement des communautés locales. Nous sommes activement engagés dans l'agriculture, l'agro-transformation et le négoce de matières premières. Nous acquérons des actifs stratégiques, les valorisons par un développement rigoureux et redistribuons les bénéfices à travers des projets communautaires d'envergure."
                : "Great Ideas is an association dedicated to creating value for its members and developing local communities. We are actively involved in agriculture, agri-transformation, and commodity trading. We acquire strategic assets, enhance them through rigorous development, and redistribute benefits through impactful community projects."
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
        project: {
            title: language === 'fr' ? 'PROJET RÉSIDENTIEL MASSOUMBOU' : 'MASSOUMBOU VILLAGE PROJECT',
            subtitle: language === 'fr' ? 'DÉVELOPPEMENT IMMOBILIER RÉCENT' : 'RECENT REAL ESTATE DEVELOPMENT',
            content: language === 'fr'
                ? "Notre dernier projet phare à Massoumbou redéfinit l'habitat villageois moderne. Nous développons des lotissements sécurisés avec des infrastructures durables, offrant à nos membres un cadre de vie exceptionnel alliant modernité et nature."
                : "Our latest flagship project in Massoumbou village redefines modern rural living. We are developing secured residential plots with sustainable infrastructure, offering our members an exceptional living environment that blends modernity with nature."
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
            <section style={{ padding: '80px var(--spacing-xl)', background: '#F8F8F8', borderBottom: '1px solid #000' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#CC0000', textTransform: 'uppercase', marginBottom: 'var(--spacing-md)', letterSpacing: '0.1em' }}>
                            {text.about.title}
                        </h2>
                        <p style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 600,
                            lineHeight: 1.5,
                            margin: '0 auto',
                            textTransform: 'uppercase',
                            maxWidth: '1000px',
                            textAlign: 'justify',
                            textAlignLast: 'center'
                        }}>
                            {text.about.content}
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Project Section - Massoumbou */}
            <section style={{ padding: '100px var(--spacing-xl)', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr)', gap: '80px', alignItems: 'center' }}>
                    <div style={{ border: '12px solid #000', height: '500px', position: 'relative', overflow: 'hidden' }}>
                        <img
                            src="/assets/landing/massoumbou_project.png"
                            alt="Massoumbou Village Project"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#CC0000', color: '#FFF', padding: '10px 20px', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}>
                            {text.project.subtitle}
                        </div>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <h2 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, lineHeight: 1, marginBottom: '30px', textTransform: 'uppercase' }}>
                            {text.project.title}
                        </h2>
                        <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: '#444', lineHeight: 1.4, margin: 0 }}>
                            {text.project.content}
                        </p>
                        <div style={{ marginTop: '40px', paddingLeft: '20px', borderLeft: '8px solid #CC0000', fontWeight: 800, textTransform: 'uppercase', color: '#000' }}>
                            Massoumbou, NKAM Region
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <section style={{ padding: '80px var(--spacing-xl)', background: '#000', color: '#FFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, marginBottom: '60px', textTransform: 'uppercase', borderLeft: '12px solid #CC0000', paddingLeft: '20px' }}>
                        {language === 'fr' ? 'NOS ACTIVITÉS CLÉS' : 'OUR CORE ACTIVITIES'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {[
                            { ...text.services[0], image: '/assets/landing/modern_city.png' },
                            { ...text.services[1], image: '/assets/landing/agri_transformation.png' },
                            { ...text.services[2], image: '/assets/landing/local_commodities.png' }
                        ].map((service, i) => (
                            <div key={i} style={{ border: '4px solid #FFF', background: '#111' }}>
                                <div style={{ height: '200px', borderBottom: '4px solid #FFF', overflow: 'hidden' }}>
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '30px' }}>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase', color: '#CC0000' }}>
                                        {service.title}
                                    </h3>
                                    <p style={{ fontSize: 'var(--font-size-md)', color: '#CCC', fontWeight: 600, lineHeight: 1.5 }}>
                                        {service.content}
                                    </p>
                                </div>
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
