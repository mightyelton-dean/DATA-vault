// ===== CONFIGURATION =====
// 👇 Change to your Railway URL after deploying
const API_URL = 'http://localhost:5000/api';

// ===== DEMO AGENTS (remove when backend is live) =====
const DEMO_AGENTS = [
    { email: 'agent@ceedi.com', password: 'agent123', name: 'Demo Agent' },
    { email: 'admin@ceedi.com', password: 'admin123', name: 'Admin Agent' }
];

// ===== AUTH HELPERS =====
function isLoggedIn() { return !!localStorage.getItem('authToken'); }
function getAgentName() {
    try { return JSON.parse(localStorage.getItem('agentData'))?.name || 'Agent'; }
    catch { return 'Agent'; }
}
function setLoggedIn(name, email) {
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('agentData', JSON.stringify({ name, email }));
}
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('agentData');
    updateAuthUI();
    displayStaticBundles();
    showToast('Logged out successfully.');
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'toast show';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== HEADER AUTH UI =====
function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    let statusBar = document.getElementById('agentStatusBar');

    if (isLoggedIn()) {
        if (loginBtn) {
            loginBtn.textContent = '🎛 Dashboard';
            loginBtn.onclick = () => window.location.href = 'agent-dashboard.html';
        }
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'agentStatusBar';
            statusBar.className = 'agent-status-bar';
            const bundlesSection = document.getElementById('bundles');
            if (bundlesSection) bundlesSection.insertBefore(statusBar, bundlesSection.querySelector('.bundles-grid'));
        }
        statusBar.innerHTML = `✅ Logged in as <strong>${getAgentName()}</strong> &nbsp;|&nbsp; <button onclick="logout()">Logout</button>`;
        statusBar.style.display = 'flex';
    } else {
        if (loginBtn) {
            loginBtn.textContent = translations[currentLanguage]?.nav_login || 'Agent Login';
            loginBtn.onclick = openLoginModal;
        }
        if (statusBar) statusBar.style.display = 'none';
    }
}

// ===== FULL TRANSLATION DICTIONARY =====
const translations = {
    en: {
        nav_bundles: 'Bundles', nav_features: 'Features', nav_services: 'Services',
        nav_contact: 'Contact', nav_login: 'Agent Login',
        hero_title: 'Affordable Data Bundles<br>All Networks • Unlimited',
        hero_description: 'Get data delivered for MTN, AirtelTigo & Telecel at unbeatable prices. Save up to 40% on every purchase.',
        bundles_title: 'Featured Data Bundles',
        bundles_subtitle: 'Choose the perfect bundle for your needs',
        features_title: 'Why Choose Ceedi-data?',
        feat1_title: 'Fast Delivery', feat1_desc: 'Data bundles delivered fast to your phone, guaranteed.',
        feat2_title: 'Best Prices', feat2_desc: 'Save up to 40% compared to buying directly from network providers.',
        feat3_title: '100% Secure', feat3_desc: 'Your transactions are encrypted and protected with bank-level security.',
        feat4_title: '24/7 Support', feat4_desc: 'Our dedicated support team is always available to help you.',
        feat5_title: 'Loyalty Rewards', feat5_desc: 'Earn points on every purchase and get exclusive bonuses.',
        feat6_title: 'Agent Program', feat6_desc: 'Join our reseller program and earn commissions on every sale.',
        services_title: 'Our Services', services_subtitle: 'Everything you need in one platform',
        svc1_title: 'Premium Data Bundle', svc1_desc: 'High-speed data bundles for MTN, AirtelTigo, and Telecel with fast delivery.',
        svc2_title: 'Legal Documents', svc2_desc: 'Quick access to birth certificates, passports, affidavits, and gazettes.',
        svc3_title: 'MTN Agent SIM', svc3_desc: 'Become an MTN agent and start earning commissions on every transaction.',
        tools_title: 'Agent Utility Tools', tools_subtitle: 'Extra features for faster daily operations',
        tool1_title: '📦 Bulk Order Upload', tool1_desc: 'Upload many customer requests at once with CSV templates.',
        tool2_title: '📥 Download Template', tool2_desc: 'Download the official file template to avoid formatting errors.',
        tool3_title: '🛰️ Network Status', tool3_desc: 'Check MTN, AirtelTigo and Telecel delivery windows in real time.',
        faq_title: 'Frequently Asked Questions', faq_subtitle: 'Common questions from agents and customers',
        faq1_q: 'How fast is bundle delivery?', faq1_a: 'Bundles are delivered fast, usually within minutes of your order.',
        faq2_q: 'Can I place orders for any network?', faq2_a: 'Yes. MTN, AirtelTigo and Telecel are supported depending on current availability.',
        faq3_q: 'How are agent commissions calculated?', faq3_a: 'Commissions are calculated per successful sale and reflected in your agent wallet.',
        faq4_q: 'Will prices update automatically?', faq4_a: 'Yes. Once backend API integration is enabled, prices can auto-sync with your configured markup.',
        footer_rights: '© 2025 Ceedi-data. All rights reserved.',
        footer_contact: 'Contact: support@ceedi-data.com | +233 XX XXX XXXX',
        loading_bundles: 'Loading bundles...',
        swipe_hint: 'Swipe left/right to explore services on mobile',
        svc1_f1: '✓ Fast Delivery', svc1_f2: '✓ Best Prices', svc1_f3: '✓ All Networks',
        svc2_f1: '✓ Birth Cert', svc2_f2: '✓ Passport', svc2_f3: '✓ Affidavit & Gazette',
        svc3_f1: '✓ Agent Registration', svc3_f2: '✓ High Commission', svc3_f3: '✓ Get an MTN agent SIM without stress',
        svc_get_started: 'Get Started', svc_upload: 'Upload Docs', svc_join: 'Join Now',
        tool1_btn: 'Open Upload', tool2_btn: 'Download Template', tool3_btn: 'Check Status',
        footer_copy: '© 2025 Ceedi-data. All rights reserved.',
        login_title: 'Agent Login', login_email_ph: 'Email Address', login_pass_ph: 'Password',
        login_btn: 'Login', login_no_account: "Don't have an account?", login_register_link: ' Register here',
        reg_title: 'Become an Agent', reg_name_ph: 'Full Name', reg_email_ph: 'Email Address',
        reg_phone_ph: 'Phone Number', reg_sim_ph: 'MTN SIM Number', reg_bank_ph: 'Bank Account Number',
        reg_pass_ph: 'Password (min 6 chars)', reg_pass2_ph: 'Confirm Password',
        reg_terms: 'I agree to Terms & Conditions', reg_btn: 'Create Account',
        reg_have_account: 'Already have an account?', reg_login_link: ' Login here',
        reg_google: 'Continue with Google', reg_or: 'or sign up with email',
        btn_get_started: 'Get Started', btn_upload_docs: 'Upload Docs', btn_join_now: 'Join Now',
        btn_open_upload: 'Open Upload', btn_download: 'Download Template', btn_check_status: 'Check Status'
    },
    fr: {
        nav_bundles: 'Forfaits', nav_features: 'Avantages', nav_services: 'Services',
        nav_contact: 'Contact', nav_login: 'Connexion Agent',
        hero_title: 'Forfaits Data Abordables<br>Tous Réseaux • Illimité',
        hero_description: 'Livraison rapide de données pour MTN, AirtelTigo et Telecel à des prix imbattables. Économisez jusqu\'à 40%.',
        bundles_title: 'Forfaits Data en Vedette', bundles_subtitle: 'Choisissez le forfait parfait pour vos besoins',
        features_title: 'Pourquoi Choisir Ceedi-data?',
        feat1_title: 'Livraison Rapide', feat1_desc: 'Vos forfaits data livrés rapidement, garanti.',
        feat2_title: 'Meilleurs Prix', feat2_desc: 'Économisez jusqu\'à 40% par rapport aux opérateurs.',
        feat3_title: '100% Sécurisé', feat3_desc: 'Vos transactions sont cryptées avec une sécurité bancaire.',
        feat4_title: 'Support 24/7', feat4_desc: 'Notre équipe est disponible en permanence pour vous aider.',
        feat5_title: 'Récompenses Fidélité', feat5_desc: 'Gagnez des points à chaque achat et obtenez des bonus exclusifs.',
        feat6_title: 'Programme Agent', feat6_desc: 'Rejoignez notre programme et gagnez des commissions sur chaque vente.',
        services_title: 'Nos Services', services_subtitle: 'Tout ce dont vous avez besoin en une plateforme',
        svc1_title: 'Forfait Data Premium', svc1_desc: 'Forfaits haut débit pour MTN, AirtelTigo et Telecel avec livraison rapide.',
        svc2_title: 'Documents Légaux', svc2_desc: 'Accès rapide aux actes de naissance, passeports, affidavits et gazettes.',
        svc3_title: 'SIM Agent MTN', svc3_desc: 'Devenez agent MTN et commencez à gagner des commissions.',
        tools_title: 'Outils Agents', tools_subtitle: 'Fonctionnalités supplémentaires pour accélérer vos opérations',
        tool1_title: '📦 Import Commandes', tool1_desc: 'Importez de nombreuses commandes en une seule fois avec des modèles CSV.',
        tool2_title: '📥 Modèle à Télécharger', tool2_desc: 'Téléchargez le modèle officiel pour éviter les erreurs de formatage.',
        tool3_title: '🛰️ État du Réseau', tool3_desc: 'Vérifiez les délais de livraison MTN, AirtelTigo et Telecel en temps réel.',
        faq_title: 'Questions Fréquentes', faq_subtitle: 'Questions courantes des agents et clients',
        faq1_q: 'Combien de temps prend la livraison?', faq1_a: 'Les commandes sont livrées rapidement, généralement en quelques minutes.',
        faq2_q: 'Puis-je commander pour n\'importe quel réseau?', faq2_a: 'Oui. MTN, AirtelTigo et Telecel sont pris en charge.',
        faq3_q: 'Comment les commissions sont-elles calculées?', faq3_a: 'Les commissions sont calculées par vente réussie et reflétées dans votre portefeuille.',
        faq4_q: 'Les prix se mettront-ils à jour automatiquement?', faq4_a: 'Oui, une fois l\'intégration API activée, les prix peuvent se synchroniser automatiquement.',
        footer_rights: '© 2025 Ceedi-data. Tous droits réservés.',
        footer_contact: 'Contact: support@ceedi-data.com | +233 XX XXX XXXX',
        loading_bundles: 'Chargement des forfaits...',
        swipe_hint: 'Faites glisser pour explorer les services sur mobile',
        svc1_f1: '✓ Livraison Rapide', svc1_f2: '✓ Meilleurs Prix', svc1_f3: '✓ Tous Réseaux',
        svc2_f1: '✓ Acte de Naissance', svc2_f2: '✓ Passeport', svc2_f3: '✓ Affidavit & Gazette',
        svc3_f1: '✓ Inscription Agent', svc3_f2: '✓ Haute Commission', svc3_f3: '✓ Obtenez une SIM Agent MTN sans stress',
        svc_get_started: 'Commencer', svc_upload: 'Envoyer Docs', svc_join: 'Rejoindre',
        tool1_btn: 'Ouvrir Import', tool2_btn: 'Télécharger', tool3_btn: 'Vérifier',
        footer_copy: '© 2025 Ceedi-data. Tous droits réservés.',
        login_title: 'Connexion Agent', login_email_ph: 'Adresse Email', login_pass_ph: 'Mot de passe',
        login_btn: 'Connexion', login_no_account: "Pas encore de compte?", login_register_link: ' Inscrivez-vous',
        reg_title: 'Devenir Agent', reg_name_ph: 'Nom complet', reg_email_ph: 'Adresse Email',
        reg_phone_ph: 'Numéro de téléphone', reg_sim_ph: 'Numéro SIM MTN', reg_bank_ph: 'Numéro de compte bancaire',
        reg_pass_ph: 'Mot de passe (min 6 car.)', reg_pass2_ph: 'Confirmer le mot de passe',
        reg_terms: "J'accepte les Conditions Générales", reg_btn: "S'inscrire comme Agent",
        reg_have_account: 'Déjà un compte?', reg_login_link: ' Se connecter',
        reg_google: 'Continuer avec Google', reg_or: 'ou inscrivez-vous par email',
        btn_get_started: 'Commencer', btn_upload_docs: 'Envoyer Docs', btn_join_now: 'Rejoindre',
        btn_open_upload: 'Ouvrir Import', btn_download: 'Télécharger', btn_check_status: 'Vérifier'
    },
    tw: {
        nav_bundles: 'Data Mpɔtam', nav_features: 'Nhyehyɛe', nav_services: 'Nnwuma',
        nav_contact: 'Bɔ Yɛn Ho', nav_login: 'Agent Kɔ Mu',
        hero_title: 'Data Mpɔtam a Ɛyɛ Nea Yɛtumi Tua<br>Network Nyinaa • Expire Nni Ho',
        hero_description: 'Nya data mua ntɛm ma MTN, AirtelTigo ne Telecel dɛn biara. Gye ho sika kosi 40%.',
        bundles_title: 'Data Mpɔtam a Yɛpɛ', bundles_subtitle: 'Yi mpɔtam a ɛfata wʼahwehwɛde',
        features_title: 'Adɛn Enti Worehwehwɛ Ceedi-data?',
        feat1_title: 'Mua Ntɛm', feat1_desc: 'Wʼdata bɛba wʼtelefon mu dɔnko dɔnko 1-5 aɛ, yɛbɔ ho kɔ.',
        feat2_title: 'Ɛhon Kakra', feat2_desc: 'Gye ho sika kosi 40% sene network companies.',
        feat3_title: '100% Ahobammɔ', feat3_desc: 'Wʼtransaction nyinaa yɛ them mu ma sɔ.',
        feat4_title: 'Boa 24/7', feat4_desc: 'Yɛn team wɔ hɔ bɔɔla bɔɔla sɛ woboa wo.',
        feat5_title: 'Akyɛde', feat5_desc: 'Nya points bɔɔla bɔɔla a woatɔ na nya bonus.',
        feat6_title: 'Agent Program', feat6_desc: 'Bɛkɔ yɛn program mu na nya commission bɔɔla bɔɔla.',
        services_title: 'Yɛn Nnwuma', services_subtitle: 'Biribiara a wohia wɔ baabi koro',
        svc1_title: 'Data Mpɔtam', svc1_desc: 'Data mua ntɛm ntɛm ma MTN, AirtelTigo ne Telecel.',
        svc2_title: 'Nhyehyɛe Krataa', svc2_desc: 'Kɔ krataa ahodoɔ bi ho ntɛm ntɛm.',
        svc3_title: 'MTN Agent SIM', svc3_desc: 'Yɛ MTN agent na nya commission.',
        tools_title: 'Agent Nnwuma Afoa', tools_subtitle: 'Nhyehyɛe a ɛboa wo kɔ ntɛm',
        tool1_title: '📦 Ntoboa Pii Upload', tool1_desc: 'Upload ntoboa pii bɔɔla bɔɔla.',
        tool2_title: '📥 Nhyehyɛe Download', tool2_desc: 'Download nhyehyɛe a ɛha atwerɛ.',
        tool3_title: '🛰️ Network Tebea', tool3_desc: 'Hwɛ MTN, AirtelTigo ne Telecel mua tebea.',
        faq_title: 'Nsɛmmisa a Wɔbisa Pii', faq_subtitle: 'Nsɛmmisa a agents ne customers bisa',
        faq1_q: 'Data bɛba ntɛm bɛn?', faq1_a: 'Data bɛba ntɛm. Ɛmma wo twɛn kakra.',
        faq2_q: 'Metumi abɔ ntoboa ma network biara anaa?', faq2_a: 'Aane. MTN, AirtelTigo ne Telecel nyinaa tumi.',
        faq3_q: 'Ɛyɛ dɛn na wɔbu commission?', faq3_a: 'Wɔbu commission bɔɔla a woatɔn ade wɔ wo wallet mu.',
        faq4_q: 'Adetɔ bo bɛsesa auto anaa?', faq4_a: 'Aane, sɛ API yɛ ready a, bo bɛsesa auto.',
        footer_rights: '© 2025 Ceedi-data. Ahwɛ nyinaa wɔ mu.',
        footer_contact: 'Contact: support@ceedi-data.com | +233 XX XXX XXXX',
        loading_bundles: 'Mpɔtam reba...',
        swipe_hint: 'Fa wo nsam kata ho na hwɛ nnwuma wɔ mobile so',
        svc1_f1: '✓ Mua Ntɛm', svc1_f2: '✓ Ɛhon Kakra', svc1_f3: '✓ Network Nyinaa',
        svc2_f1: '✓ Abusua Krataa', svc2_f2: '✓ Passport', svc2_f3: '✓ Affidavit',
        svc3_f1: '✓ Agent Nhyehyɛe', svc3_f2: '✓ Commission Kɛse', svc3_f3: '✓ SIM Agent MTN a Nni Ɔhaw',
        svc_get_started: 'Fi Ase', svc_upload: 'Fa Krataa', svc_join: 'Bɛkɔ Mu',
        tool1_btn: 'Bue Upload', tool2_btn: 'Download', tool3_btn: 'Hwɛ Tebea',
        footer_copy: '© 2025 Ceedi-data. Ahwɛ nyinaa wɔ mu.',
        login_title: 'Agent Kɔ Mu', login_email_ph: 'Email', login_pass_ph: 'Password',
        login_btn: 'Kɔ Mu', login_no_account: "Wonnye account anaa?", login_register_link: ' Kyerɛ wo din ha',
        reg_title: 'Yɛ Agent', reg_name_ph: 'Wo Din Nyinaa', reg_email_ph: 'Email',
        reg_phone_ph: 'Telefon Nɔma', reg_sim_ph: 'MTN SIM Nɔma', reg_bank_ph: 'Bank Nɔma',
        reg_pass_ph: 'Password (bɔɔla 6)', reg_pass2_ph: 'Password Bio',
        reg_terms: 'Medi Rules ho', reg_btn: 'Yɛ Agent',
        reg_have_account: 'Wowɔ account?', reg_login_link: ' Kɔ Mu Ha',
        reg_google: 'Fa Google Di Kan', reg_or: 'anaasɛ kyerɛ wo din wɔ email mu',
        btn_get_started: 'Fi Ase', btn_upload_docs: 'Fa Krataa', btn_join_now: 'Bɛkɔ Mu',
        btn_open_upload: 'Bue Upload', btn_download: 'Download', btn_check_status: 'Hwɛ Tebea'
    },
    es: {
        nav_bundles: 'Paquetes', nav_features: 'Características', nav_services: 'Servicios',
        nav_contact: 'Contacto', nav_login: 'Inicio de Sesión',
        hero_title: 'Paquetes de Datos Asequibles<br>Todas las Redes • Ilimitados',
        hero_description: 'Entrega rápida para MTN, AirtelTigo y Telecel a precios inmejorables. Ahorre hasta 40%.',
        bundles_title: 'Paquetes de Datos Destacados', bundles_subtitle: 'Elige el paquete perfecto para tus necesidades',
        features_title: '¿Por qué elegir Ceedi-data?',
        feat1_title: 'Entrega Rápida', feat1_desc: 'Tus paquetes llegan rápido a tu teléfono, garantizado.',
        feat2_title: 'Mejores Precios', feat2_desc: 'Ahorra hasta 40% comparado con los operadores de red.',
        feat3_title: '100% Seguro', feat3_desc: 'Tus transacciones están cifradas con seguridad bancaria.',
        feat4_title: 'Soporte 24/7', feat4_desc: 'Nuestro equipo siempre está disponible para ayudarte.',
        feat5_title: 'Recompensas', feat5_desc: 'Gana puntos en cada compra y obtén bonos exclusivos.',
        feat6_title: 'Programa de Agentes', feat6_desc: 'Únete al programa revendedor y gana comisiones en cada venta.',
        services_title: 'Nuestros Servicios', services_subtitle: 'Todo lo que necesitas en una plataforma',
        svc1_title: 'Paquete de Datos Premium', svc1_desc: 'Paquetes de alta velocidad para MTN, AirtelTigo y Telecel.',
        svc2_title: 'Documentos Legales', svc2_desc: 'Acceso rápido a actas de nacimiento, pasaportes y más.',
        svc3_title: 'SIM Agente MTN', svc3_desc: 'Conviértete en agente MTN y empieza a ganar comisiones.',
        tools_title: 'Herramientas para Agentes', tools_subtitle: 'Funciones adicionales para operaciones más rápidas',
        tool1_title: '📦 Carga Masiva', tool1_desc: 'Sube muchos pedidos a la vez con plantillas CSV.',
        tool2_title: '📥 Descargar Plantilla', tool2_desc: 'Descarga la plantilla oficial para evitar errores.',
        tool3_title: '🛰️ Estado de Red', tool3_desc: 'Consulta los tiempos de entrega en tiempo real.',
        faq_title: 'Preguntas Frecuentes', faq_subtitle: 'Preguntas comunes de agentes y clientes',
        faq1_q: '¿Cuánto tarda la entrega?', faq1_a: 'Los paquetes se entregan rápido, normalmente en pocos minutos.',
        faq2_q: '¿Puedo pedir para cualquier red?', faq2_a: 'Sí. MTN, AirtelTigo y Telecel están disponibles.',
        faq3_q: '¿Cómo se calculan las comisiones?', faq3_a: 'Se calculan por venta exitosa y se reflejan en tu monedero.',
        faq4_q: '¿Los precios se actualizan automáticamente?', faq4_a: 'Sí, una vez activada la integración API.',
        footer_rights: '© 2025 Ceedi-data. Todos los derechos reservados.',
        footer_contact: 'Contacto: support@ceedi-data.com | +233 XX XXX XXXX',
        loading_bundles: 'Cargando paquetes...',
        swipe_hint: 'Desliza para explorar servicios en móvil',
        svc1_f1: '✓ Entrega Rápida', svc1_f2: '✓ Mejores Precios', svc1_f3: '✓ Todas las Redes',
        svc2_f1: '✓ Acta de Nacimiento', svc2_f2: '✓ Pasaporte', svc2_f3: '✓ Affidavit & Gaceta',
        svc3_f1: '✓ Registro de Agente', svc3_f2: '✓ Alta Comisión', svc3_f3: '✓ Obtenga una SIM Agente MTN sin complicaciones',
        svc_get_started: 'Comenzar', svc_upload: 'Subir Docs', svc_join: 'Unirme',
        tool1_btn: 'Abrir Carga', tool2_btn: 'Descargar', tool3_btn: 'Verificar',
        footer_copy: '© 2025 Ceedi-data. Todos los derechos reservados.',
        login_title: 'Inicio de Sesión', login_email_ph: 'Correo Electrónico', login_pass_ph: 'Contraseña',
        login_btn: 'Iniciar Sesión', login_no_account: "¿No tienes cuenta?", login_register_link: ' Regístrate aquí',
        reg_title: 'Convertirse en Agente', reg_name_ph: 'Nombre Completo', reg_email_ph: 'Correo Electrónico',
        reg_phone_ph: 'Número de Teléfono', reg_sim_ph: 'Número SIM MTN', reg_bank_ph: 'Número de Cuenta Bancaria',
        reg_pass_ph: 'Contraseña (mín. 6 car.)', reg_pass2_ph: 'Confirmar Contraseña',
        reg_terms: 'Acepto los Términos y Condiciones', reg_btn: 'Registrarse como Agente',
        reg_have_account: '¿Ya tienes cuenta?', reg_login_link: ' Inicia sesión aquí',
        reg_google: 'Continuar con Google', reg_or: 'o regístrate con email',
        btn_get_started: 'Comenzar', btn_upload_docs: 'Subir Docs', btn_join_now: 'Unirme',
        btn_open_upload: 'Abrir Carga', btn_download: 'Descargar', btn_check_status: 'Verificar'
    },
    pt: {
        nav_bundles: 'Pacotes', nav_features: 'Recursos', nav_services: 'Serviços',
        nav_contact: 'Contato', nav_login: 'Login do Agente',
        hero_title: 'Pacotes de Dados Acessíveis<br>Todas as Redes • Ilimitados',
        hero_description: 'Entrega rápida para MTN, AirtelTigo e Telecel com preços imbatíveis. Economize até 40%.',
        bundles_title: 'Pacotes de Dados em Destaque', bundles_subtitle: 'Escolha o pacote perfeito para suas necessidades',
        features_title: 'Por que escolher Ceedi-data?',
        feat1_title: 'Entrega Rápida', feat1_desc: 'Seus pacotes chegam rápido, garantido.',
        feat2_title: 'Melhores Preços', feat2_desc: 'Economize até 40% em relação às operadoras.',
        feat3_title: '100% Seguro', feat3_desc: 'Suas transações são criptografadas com segurança bancária.',
        feat4_title: 'Suporte 24/7', feat4_desc: 'Nossa equipe está sempre disponível para ajudá-lo.',
        feat5_title: 'Recompensas', feat5_desc: 'Ganhe pontos em cada compra e obtenha bônus exclusivos.',
        feat6_title: 'Programa de Agentes', feat6_desc: 'Junte-se ao programa revendedor e ganhe comissões.',
        services_title: 'Nossos Serviços', services_subtitle: 'Tudo que você precisa em uma plataforma',
        svc1_title: 'Pacote de Dados Premium', svc1_desc: 'Pacotes de alta velocidade para MTN, AirtelTigo e Telecel.',
        svc2_title: 'Documentos Legais', svc2_desc: 'Acesso rápido a certidões, passaportes e mais.',
        svc3_title: 'SIM Agente MTN', svc3_desc: 'Torne-se agente MTN e comece a ganhar comissões.',
        tools_title: 'Ferramentas para Agentes', tools_subtitle: 'Recursos extras para operações mais rápidas',
        tool1_title: '📦 Upload em Massa', tool1_desc: 'Faça upload de muitos pedidos de uma vez com modelos CSV.',
        tool2_title: '📥 Baixar Modelo', tool2_desc: 'Baixe o modelo oficial para evitar erros de formatação.',
        tool3_title: '🛰️ Status da Rede', tool3_desc: 'Verifique os prazos de entrega em tempo real.',
        faq_title: 'Perguntas Frequentes', faq_subtitle: 'Perguntas comuns de agentes e clientes',
        faq1_q: 'Quanto tempo leva a entrega?', faq1_a: 'Os pacotes chegam rápido, geralmente em poucos minutos.',
        faq2_q: 'Posso pedir para qualquer rede?', faq2_a: 'Sim. MTN, AirtelTigo e Telecel são suportados.',
        faq3_q: 'Como são calculadas as comissões?', faq3_a: 'Por venda bem-sucedida, refletida na sua carteira.',
        faq4_q: 'Os preços serão atualizados automaticamente?', faq4_a: 'Sim, após integração da API.',
        footer_rights: '© 2025 Ceedi-data. Todos os direitos reservados.',
        footer_contact: 'Contato: support@ceedi-data.com | +233 XX XXX XXXX',
        loading_bundles: 'Carregando pacotes...',
        swipe_hint: 'Deslize para explorar serviços no celular',
        svc1_f1: '✓ Entrega Rápida', svc1_f2: '✓ Melhores Preços', svc1_f3: '✓ Todas as Redes',
        svc2_f1: '✓ Certidão de Nascimento', svc2_f2: '✓ Passaporte', svc2_f3: '✓ Affidavit & Gazette',
        svc3_f1: '✓ Registro de Agente', svc3_f2: '✓ Alta Comissão', svc3_f3: '✓ Obtenha um SIM Agente MTN sem complicações',
        svc_get_started: 'Começar', svc_upload: 'Enviar Docs', svc_join: 'Entrar',
        tool1_btn: 'Abrir Upload', tool2_btn: 'Baixar', tool3_btn: 'Verificar',
        footer_copy: '© 2025 Ceedi-data. Todos os direitos reservados.',
        login_title: 'Login do Agente', login_email_ph: 'Endereço de Email', login_pass_ph: 'Senha',
        login_btn: 'Entrar', login_no_account: "Não tem conta?", login_register_link: ' Registre-se aqui',
        reg_title: 'Tornar-se Agente', reg_name_ph: 'Nome Completo', reg_email_ph: 'Endereço de Email',
        reg_phone_ph: 'Número de Telefone', reg_sim_ph: 'Número SIM MTN', reg_bank_ph: 'Número de Conta Bancária',
        reg_pass_ph: 'Senha (mín. 6 car.)', reg_pass2_ph: 'Confirmar Senha',
        reg_terms: 'Aceito os Termos e Condições', reg_btn: 'Registrar como Agente',
        reg_have_account: 'Já tem conta?', reg_login_link: ' Entre aqui',
        reg_google: 'Continuar com Google', reg_or: 'ou cadastre-se com email',
        btn_get_started: 'Começar', btn_upload_docs: 'Enviar Docs', btn_join_now: 'Entrar',
        btn_open_upload: 'Abrir Upload', btn_download: 'Baixar', btn_check_status: 'Verificar'
    },
    ar: {
        nav_bundles: 'الحزم', nav_features: 'المميزات', nav_services: 'الخدمات',
        nav_contact: 'اتصل بنا', nav_login: 'دخول الوكيل',
        hero_title: 'حزم بيانات بأسعار معقولة<br>جميع الشبكات • غير محدودة',
        hero_description: 'احصل على توصيل سريع لحزم البيانات لـ MTN وAirtelTigo وTelecel بأسعار لا تُقبل المنافسة. وفّر حتى 40%.',
        bundles_title: 'حزم البيانات المميزة', bundles_subtitle: 'اختر الحزمة المثالية لاحتياجاتك',
        features_title: 'لماذا تختار Ceedi-data؟',
        feat1_title: 'توصيل سريع', feat1_desc: 'حزم البيانات تصلك بسرعة، مضمون.',
        feat2_title: 'أفضل الأسعار', feat2_desc: 'وفّر حتى 40% مقارنة بالشراء المباشر من مزودي الشبكة.',
        feat3_title: '100% آمن', feat3_desc: 'معاملاتك مشفرة ومحمية بأمان مصرفي.',
        feat4_title: 'دعم 24/7', feat4_desc: 'فريق الدعم المتخصص متاح دائماً لمساعدتك.',
        feat5_title: 'مكافآت الولاء', feat5_desc: 'اكسب نقاطاً مع كل عملية شراء واحصل على مكافآت حصرية.',
        feat6_title: 'برنامج الوكلاء', feat6_desc: 'انضم إلى برنامج إعادة البيع واكسب عمولات على كل عملية بيع.',
        services_title: 'خدماتنا', services_subtitle: 'كل ما تحتاجه في منصة واحدة',
        svc1_title: 'حزمة بيانات مميزة', svc1_desc: 'حزم بيانات عالية السرعة مع التسليم الفوري.',
        svc2_title: 'المستندات القانونية', svc2_desc: 'وصول سريع إلى شهادات الميلاد وجوازات السفر والمزيد.',
        svc3_title: 'شريحة وكيل MTN', svc3_desc: 'كن وكيل MTN وابدأ في كسب العمولات.',
        tools_title: 'أدوات الوكيل', tools_subtitle: 'ميزات إضافية لعمليات أسرع',
        tool1_title: '📦 رفع طلبات جماعية', tool1_desc: 'ارفع طلبات عديدة دفعة واحدة.',
        tool2_title: '📥 تحميل النموذج', tool2_desc: 'حمّل النموذج الرسمي لتجنب أخطاء التنسيق.',
        tool3_title: '🛰️ حالة الشبكة', tool3_desc: 'تحقق من أوقات تسليم الشبكات.',
        faq_title: 'الأسئلة الشائعة', faq_subtitle: 'أسئلة شائعة من الوكلاء والعملاء',
        faq1_q: 'كم يستغرق التسليم؟', faq1_a: 'تصلك الحزم بسرعة، عادةً في دقائق.',
        faq2_q: 'هل يمكنني الطلب لأي شبكة؟', faq2_a: 'نعم. MTN وAirtelTigo وTelecel مدعومة.',
        faq3_q: 'كيف تُحسب العمولات؟', faq3_a: 'تُحسب لكل عملية بيع ناجحة وتظهر في محفظتك.',
        faq4_q: 'هل ستُحدَّث الأسعار تلقائياً؟', faq4_a: 'نعم بعد تفعيل تكامل API.',
        footer_rights: '© 2025 Ceedi-data. جميع الحقوق محفوظة.',
        footer_contact: 'للتواصل: support@ceedi-data.com | +233 XX XXX XXXX',
        loading_bundles: 'جارٍ تحميل الحزم...',
        swipe_hint: 'اسحب يساراً/يميناً لاستكشاف الخدمات على الجوال',
        svc1_f1: '✓ توصيل سريع', svc1_f2: '✓ أفضل الأسعار', svc1_f3: '✓ جميع الشبكات',
        svc2_f1: '✓ شهادة الميلاد', svc2_f2: '✓ جواز السفر', svc2_f3: '✓ تصريح وجريدة',
        svc3_f1: '✓ تسجيل الوكيل', svc3_f2: '✓ عمولة عالية', svc3_f3: '✓ احصل على شريحة وكيل MTN بسهولة',
        svc_get_started: 'ابدأ الآن', svc_upload: 'رفع المستندات', svc_join: 'انضم الآن',
        tool1_btn: 'فتح الرفع', tool2_btn: 'تحميل النموذج', tool3_btn: 'تحقق من الحالة',
        footer_copy: '© 2025 Ceedi-data. جميع الحقوق محفوظة.',
        login_title: 'دخول الوكيل', login_email_ph: 'البريد الإلكتروني', login_pass_ph: 'كلمة المرور',
        login_btn: 'دخول', login_no_account: "ليس لديك حساب؟", login_register_link: ' سجّل هنا',
        reg_title: 'كن وكيلاً', reg_name_ph: 'الاسم الكامل', reg_email_ph: 'البريد الإلكتروني',
        reg_phone_ph: 'رقم الهاتف', reg_sim_ph: 'رقم شريحة MTN', reg_bank_ph: 'رقم الحساب البنكي',
        reg_pass_ph: 'كلمة المرور (٦ أحرف على الأقل)', reg_pass2_ph: 'تأكيد كلمة المرور',
        reg_terms: 'أوافق على الشروط والأحكام', reg_btn: 'التسجيل كوكيل',
        reg_have_account: 'لديك حساب بالفعل؟', reg_login_link: ' ادخل هنا',
        reg_google: 'المتابعة مع Google', reg_or: 'أو سجّل بالبريد الإلكتروني',
        btn_get_started: 'ابدأ الآن', btn_upload_docs: 'رفع المستندات', btn_join_now: 'انضم الآن',
        btn_open_upload: 'فتح الرفع', btn_download: 'تحميل النموذج', btn_check_status: 'تحقق'
    }
};

function detectLanguage() {
    const saved = localStorage.getItem('selectedLanguage');
    if (saved && translations[saved]) return saved;
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
}

let currentLanguage = detectLanguage();

function initLanguage() {
    const select = document.getElementById('languageSelect');
    if (select) select.value = currentLanguage;
    applyTranslations();
}

function applyTranslations() {
    const lang = translations[currentLanguage] || translations.en;
    // Translate all text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (lang[key] !== undefined) el.innerHTML = lang[key];
    });
    // Translate all placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (lang[key] !== undefined) el.placeholder = lang[key];
    });
    // RTL support for Arabic
    const isRTL = currentLanguage === 'ar';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    applyTranslations();
    updateAuthUI(); // re-translate login button too
}

// ===== THEME =====
function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// ===== MODALS =====
function openLoginModal()        { document.getElementById('loginModal').classList.add('show'); }
function closeLoginModal()       { document.getElementById('loginModal').classList.remove('show'); }
function openRegistrationModal() { document.getElementById('registrationModal').classList.add('show'); }
function closeRegistrationModal(){ document.getElementById('registrationModal').classList.remove('show'); }
function switchToRegister(e)     { e.preventDefault(); closeLoginModal(); openRegistrationModal(); }
function switchToLogin(e)        { e.preventDefault(); closeRegistrationModal(); openLoginModal(); }

window.onclick = function(event) {
    if (event.target === document.getElementById('loginModal')) closeLoginModal();
    if (event.target === document.getElementById('registrationModal')) closeRegistrationModal();
};

// ===== AUTH FORMS =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { showToast('Please fill in all fields'); return; }

    const demo = DEMO_AGENTS.find(a => a.email === email && a.password === password);
    if (demo) {
        setLoggedIn(demo.name, demo.email);
        closeLoginModal();
        document.getElementById('loginForm').reset();
        showToast('✅ Login successful! Welcome, ' + demo.name);
        updateAuthUI();
        displayStaticBundles();
        return;
    }
    loginAgent(email, password);
}

function handleRegistration(e) {
    e.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const phone    = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const password2= document.getElementById('regPassword2').value;
    const terms    = document.getElementById('regTerms').checked;

    if (!name || !email || !phone || !password || !password2) { showToast('Please fill in all fields'); return; }
    if (password !== password2) { showToast('Passwords do not match'); return; }
    if (!terms) { showToast('Please accept Terms & Conditions'); return; }
    registerAgent(name, email, phone, password);
}

function handleGoogleSignUp() {
    showToast('🔑 Google sign-up coming soon! Use email registration for now.');
}

async function registerAgent(name, email, phone, password) {
    try {
        const res = await fetch(`${API_URL}/agents/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });
        const data = await res.json();
        if (data.success) {
            showToast('✅ Registration successful! You can now log in.');
            closeRegistrationModal();
            document.getElementById('registrationForm').reset();
            openLoginModal();
        } else {
            showToast('❌ ' + (data.message || 'Registration failed'));
        }
    } catch { showToast('Backend not connected yet. Contact admin to activate your account.'); }
}

async function loginAgent(email, password) {
    try {
        const res = await fetch(`${API_URL}/agents/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('agentData', JSON.stringify(data.agent));
            showToast('✅ Login successful!');
            closeLoginModal();
            document.getElementById('loginForm').reset();
            updateAuthUI();
            displayStaticBundles();
            setTimeout(() => window.location.href = 'agent-dashboard.html', 800);
        } else {
            showToast('❌ ' + (data.message || 'Invalid credentials'));
        }
    } catch { showToast('Invalid credentials. Demo: agent@ceedi.com / agent123'); }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    createParticles();
    fetchBundles();
    setupSmoothScroll();
    setupMobileNav();
    updateAuthUI();
});

// ===== PARTICLES =====
function createParticles() {
    const bg = document.querySelector('.animated-bg');
    if (!bg) return;
    const colors = ['rgba(0,240,255,0.4)', 'rgba(184,41,255,0.3)', 'rgba(255,215,0,0.3)'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `width:${Math.random()*6+2}px;height:${p.style.width};background:${colors[i%3]};left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*15}s;animation-duration:${Math.random()*10+15}s;`;
        bg.appendChild(p);
    }
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ===== MOBILE NAV HAMBURGER =====
function setupMobileNav() {
    const toggle = document.getElementById('navToggle');
    const nav    = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = nav.classList.toggle('show');
        toggle.setAttribute('aria-expanded', open);
        toggle.innerHTML = open ? '✕' : '☰';
    });

    // Close when a nav link is clicked on mobile
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                nav.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.innerHTML = '☰';
            }
        });
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && nav.classList.contains('show')) {
            if (!nav.contains(e.target) && e.target !== toggle) {
                nav.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.innerHTML = '☰';
            }
        }
    });

    // Reset on desktop resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            nav.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML = '☰';
        }
    });
}

// ===== BUNDLES =====
async function fetchBundles() {
    try {
        const res = await fetch(`${API_URL}/bundles`);
        const data = await res.json();
        if (data.success && data.data.length) return displayBundles(data.data);
    } catch {}
    displayStaticBundles();
}

function displayBundles(bundles) {
    const container = document.getElementById('bundlesContainer');
    if (!container) return;
    container.innerHTML = '';
    bundles.forEach((b, i) => container.appendChild(createBundleCard(b, i)));
}

function createBundleCard(bundle, index) {
    const loggedIn = isLoggedIn();
    const card = document.createElement('div');
    card.className = 'bundle-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const badgeColors = {
        'hot':        'rgba(255,68,68,0.1); border-color:#ff4444; color:#ff4444',
        'popular':    'rgba(0,255,136,0.1); border-color:#00ff88; color:#00ff88',
        'best-value': 'rgba(0,240,255,0.1); border-color:#00f0ff; color:#00f0ff',
        'premium':    'rgba(184,41,255,0.1); border-color:#b829ff; color:#b829ff',
        'ultimate':   'rgba(255,215,0,0.1); border-color:#ffd700; color:#ffd700',
        'enterprise': 'rgba(255,255,255,0.1); border-color:#fff; color:#fff'
    };
    const bStyle = badgeColors[bundle.badge?.type] || badgeColors.popular;

    const priceHtml = loggedIn
        ? `<div class="bundle-price">GH₵ ${bundle.price.toFixed(2)}<span>GH₵ ${bundle.originalPrice.toFixed(2)}</span></div>`
        : `<div class="bundle-price-wrapper">
             <div class="bundle-price price-blur">GH₵ ${bundle.price.toFixed(2)}<span>GH₵ ${bundle.originalPrice.toFixed(2)}</span></div>
             <div class="lock-badge" onclick="openLoginModal()">🔒 Login to see price</div>
           </div>`;

    const buyBtn = loggedIn
        ? `<button class="buy-btn" onclick="purchaseBundle('${bundle._id}','${bundle.name}',${bundle.price})">Buy Now</button>`
        : `<button class="buy-btn" onclick="openLoginModal()" style="opacity:0.7;">🔒 Login to Buy</button>`;

    card.innerHTML = `
        <div class="bundle-header">
            <div class="bundle-size">${bundle.size}</div>
            <div class="bundle-badge" style="background:${bStyle}">${bundle.badge?.text || 'POPULAR'}</div>
        </div>
        ${priceHtml}
        <ul class="bundle-features">
            ${bundle.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${buyBtn}`;
    return card;
}

function displayStaticBundles() {
    displayBundles([
        { _id:'1', name:'1GB', size:'1GB', price:3.50, originalPrice:6.00, badge:{text:'HOT DEAL',type:'hot'}, features:['Unlimited • Never expires','Fast delivery','All networks supported','24/7 customer support'] },
        { _id:'2', name:'5GB', size:'5GB', price:15.00, originalPrice:25.00, badge:{text:'POPULAR',type:'popular'}, features:['Unlimited • Never expires','Fast delivery','All networks supported','Priority support'] },
        { _id:'3', name:'10GB', size:'10GB', price:28.00, originalPrice:45.00, badge:{text:'BEST VALUE',type:'best-value'}, features:['Unlimited • Never expires','Fast delivery','All networks supported','VIP support & rewards'] }
    ]);
}

// ===== PURCHASE =====
async function purchaseBundle(bundleId, bundleName, price) {
    const token = localStorage.getItem('authToken');
    if (!token) { openLoginModal(); return; }

    const phone = prompt(`Recipient phone number for ${bundleName}:`);
    if (!phone) return;
    const network = prompt('Network (MTN / AirtelTigo / Telecel):');
    if (!network) return;

    const btn = event?.target;
    if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

    try {
        const res = await fetch(`${API_URL}/bundles/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ bundleId, recipientPhone: phone, network, paymentMethod: 'paystack' })
        });
        const data = await res.json();
        if (data.success) {
            if (data.data?.authorizationUrl) window.location.href = data.data.authorizationUrl;
            else showToast('✅ Order placed! Ref: ' + data.data?.paymentReference);
        } else {
            showToast('❌ ' + data.message);
        }
    } catch { showToast('Backend not connected yet. Will work after deployment.'); }
    finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Buy Now'; }
    }
}
