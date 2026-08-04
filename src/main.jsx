import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ChevronRight, ChevronUp, ChevronDown, Globe2, Hand, Mail, MonitorSmartphone, Mouse, Phone, MapPin,
  Sparkles, ShieldCheck, Clock3, UsersRound, BadgeCheck, Layers3, Rocket,
  Search, Palette, Code2, Send, BarChart3, Wrench, Share2, Image, Building2
} from 'lucide-react';
import './styles.css';

const sectionsEs = [
  { id: 'inicio', label: 'INICIO', Icon: Sparkles },
  { id: 'beneficios', label: '¿POR QUÉ UNA WEBSITE?', Icon: ShieldCheck },
  { id: 'paquetes', label: 'PLANES', Icon: Layers3 },
  { id: 'portafolio', label: 'PORTAFOLIO', Icon: MonitorSmartphone },
  { id: 'proceso', label: 'PROCESO', Icon: Rocket },
  { id: 'contacto', label: 'COTIZACIÓN', Icon: Mail },
];

const sectionsEn = [
  { id: 'inicio', label: 'HOME', Icon: Sparkles },
  { id: 'beneficios', label: 'WHY A WEBSITE?', Icon: ShieldCheck },
  { id: 'paquetes', label: 'PLANS', Icon: Layers3 },
  { id: 'portafolio', label: 'PORTFOLIO', Icon: MonitorSmartphone },
  { id: 'proceso', label: 'PROCESS', Icon: Rocket },
  { id: 'contacto', label: 'QUOTE', Icon: Mail },
];

const contentEs = {
  inicio: {
    kicker: 'WEBSITES QUE GENERAN CONFIANZA',
    title: <>HAZ QUE TU NEGOCIO<br /><b>INSPIRE CONFIANZA</b><br />DESDE EL PRIMER CLICK.</>,
    description: <>Una buena website no solo se ve bien. Genera confianza, responde las preguntas de tus clientes y convierte visitas en oportunidades de negocio.</>,
  },
  beneficios: {
    kicker: 'PRIMERA IMPRESIÓN DIGITAL',
    title: <>NO ES SOLO VERSE BIEN.<br />ES <b>INSPIRAR CONFIANZA.</b></>,
    description: <>Tu website trabaja por tu negocio todos los días: explica lo que haces, presenta tu valor y facilita que nuevos clientes den el siguiente paso.</>,
  },
  paquetes: {
    kicker: '',
    title: <>PLANES</>,
    description: <>No pagues por funciones que no necesitas. Elige la opción que mejor se adapta a tu negocio.</>,
  },
  portafolio: {
    kicker: 'PORTAFOLIO',
    title: <>TU NEGOCIO NO NECESITA OTRA PLANTILLA.<br />NECESITA UNA PRESENCIA DIGITAL <b>CONSTRUIDA PARA DESTACAR.</b></>,
    description: <>Cada website nace desde cero para reflejar la identidad de cada negocio. No reutilizamos plantillas porque ninguna empresa es igual a otra.</>,
  },
  proceso: {
    kicker: 'UN PROCESO CLARO',
    title: <>DE TU IDEA<br />A UNA WEBSITE <b>PUBLICADA.</b></>,
    description: <>Te guiamos paso a paso. Primero entendemos tu negocio, luego diseñamos, desarrollamos y publicamos una experiencia lista para recibir clientes.</>,
  },
  contacto: {
    kicker: 'EMPECEMOS TU PROYECTO',
    title: <>DALE A TU NEGOCIO<br />LA PRESENCIA QUE <b>MERECE.</b></>,
    description: <>Cuéntanos qué haces y qué necesitas. Te ayudaremos a elegir el plan correcto o a preparar una solución personalizada.</>,
  },
};

const contentEn = {
  inicio: { kicker: 'WEBSITES THAT BUILD TRUST', title: <>MAKE YOUR BUSINESS<br /><b>INSPIRE TRUST</b><br />FROM THE FIRST CLICK.</>, description: <>A good website does not just look good. It builds trust, answers your customers' questions, and turns visits into business opportunities.</> },
  beneficios: { kicker: 'YOUR DIGITAL FIRST IMPRESSION', title: <>IT IS NOT JUST ABOUT LOOKING GOOD.<br />IT IS ABOUT <b>INSPIRING TRUST.</b></>, description: <>Your website works for your business every day: it explains what you do, presents your value, and makes it easier for new customers to take the next step.</> },
  paquetes: { kicker: '', title: <>PLANS</>, description: <>Do not pay for features you do not need. Choose the option that best fits your business.</> },
  portafolio: { kicker: 'PORTFOLIO', title: <>WE DO NOT USE TEMPLATES.<br />WE DESIGN <b>IDENTITIES.</b></>, description: <>Every website starts from scratch to reflect each business identity. We do not reuse templates because no company is the same as another.</> },
  proceso: { kicker: 'A CLEAR PROCESS', title: <>FROM YOUR IDEA<br />TO A <b>LIVE WEBSITE.</b></>, description: <>We guide you step by step. First we understand your business, then we design, develop, and launch an experience ready to receive customers.</> },
  contacto: { kicker: 'LET US START YOUR PROJECT', title: <>GIVE YOUR BUSINESS<br />THE PRESENCE IT <b>DESERVES.</b></>, description: <>Tell us what you do and what you need. We will help you choose the right plan or prepare a custom solution.</> },
};

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}>
    <img className="brand-logo-official brand-logo-header" src="./standalone/impulso-logo-header-blue.png" alt="Impulso Digital" />
    <img className="brand-logo-official brand-logo-mark" src="./standalone/impulso-logo-mark-blue.png" alt="" aria-hidden="true" />
    <div className="brand-fallback" aria-hidden="true"><div className="brand-glyph"><i /><b /><em /></div><div><strong>IMPULSO</strong><span>DIGITAL</span></div></div>
  </div>;
}

function Header({ mobilePreview, onToggleMobile, lang, onLanguage, isMobileDevice, desktopMode, onToggleDesktop }) {
  return <header className="topbar">
    <Brand compact />
    <div className="utility-buttons" aria-label={lang === 'es' ? 'Opciones rápidas' : 'Quick options'}>
      <button type="button" className={lang === 'es' ? 'is-active' : ''} onClick={() => onLanguage('es')}>ES</button><button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => onLanguage('en')}>EN</button>
      {isMobileDevice ? <button type="button" className={`desktop-mode ${desktopMode ? 'is-active' : ''}`} onClick={onToggleDesktop}>{desktopMode ? (lang === 'es' ? 'VERSIÓN CELULAR' : 'MOBILE VERSION') : (lang === 'es' ? 'VERSIÓN DESKTOP' : 'DESKTOP VERSION')}</button> : <button type="button" className={`mobile-mode ${mobilePreview ? 'is-active' : ''}`} onClick={onToggleMobile}>{mobilePreview ? 'DESKTOP' : (lang === 'es' ? 'VERSIÓN CELULAR' : 'MOBILE VERSION')}</button>}
    </div>
  </header>;
}

function WheelItem({ section, index, active, wheelRotation, onSelect }) {
  const counterRotation = useTransform(wheelRotation, value => -value);
  const itemAngle = -72 + index * 36;
  const { id, label, Icon } = section;
  return <button className={`wheel-item ${id === active ? 'active' : ''}`} style={{ transform: `rotate(${itemAngle}deg) translateX(355px) rotate(${-itemAngle}deg)` }} onClick={event => { event.preventDefault(); event.stopPropagation(); onSelect(index); }}>
    <motion.span className="wheel-item-inner" style={{ rotate: counterRotation }}><Icon /><span>{label}</span>{id === active && <ChevronRight className="active-chevron" />}</motion.span>
  </button>;
}

function MechanicalWheel({ active, onChange, sections, lang }) {
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { stiffness: 26, damping: 24, mass: 3.1 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, startIndex: 0, lastIndex: 0 });
  useEffect(() => {
    const index = sections.findIndex(section => section.id === active);
    if (index >= 0) { dragRef.current.lastIndex = index; rotation.set(72 - index * 36); }
  }, [active, rotation]);
  const start = event => {
    if (event.target.closest?.('.wheel-item')) return;
    const index = Math.max(0, sections.findIndex(section => section.id === active));
    dragRef.current = { active: true, moved: false, startX: event.clientX, startY: event.clientY, startIndex: index, lastIndex: index };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const move = event => {
    const state = dragRef.current; if (!state.active) return;
    const dx = event.clientX - state.startX; const dy = event.clientY - state.startY;
    if (Math.hypot(dx, dy) > 8) state.moved = true;
    const dominant = Math.abs(dy) > Math.abs(dx) ? -dy : -dx;
    const next = Math.max(0, Math.min(sections.length - 1, state.startIndex + Math.round(dominant / 90)));
    if (next !== state.lastIndex) { state.lastIndex = next; onChange(sections[next].id); }
  };
  const end = event => { dragRef.current.active = false; event.currentTarget.releasePointerCapture?.(event.pointerId); };
  const stepWheel = direction => {
    const currentIndex = Math.max(0, sections.findIndex(section => section.id === active));
    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
    onChange(sections[nextIndex].id);
  };
  const activateHand = event => {
    event.preventDefault();
    event.stopPropagation();
    const currentIndex = Math.max(0, sections.findIndex(section => section.id === active));
    stepWheel(currentIndex >= sections.length - 1 ? -1 : 1);
  };
  return <div className="wheel-window">
    <motion.div className="mechanical-wheel guided-wheel" style={{ rotate: smoothRotation }} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
      <div className="outer-bezel"><span /><span /><span /></div><div className="bolt-ring">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}</div><div className="blue-conduit"><i /><i /><i /></div><div className="inner-gear" /><div className="wheel-core"><Brand /></div>
      <div className="wheel-items">{sections.map((section, index) => <WheelItem key={section.id} section={section} index={index} active={active} wheelRotation={smoothRotation} onSelect={i => onChange(sections[i].id)} />)}</div>
    </motion.div>
    <div className="wheel-control" aria-label={lang === 'es' ? 'Controles de la rueda' : 'Wheel controls'}>
      <button type="button" className="wheel-step wheel-step-up" aria-label={lang === 'es' ? 'Mover rueda hacia arriba' : 'Move wheel up'} onClick={() => stepWheel(-1)} disabled={active === sections[0].id}><ChevronUp /></button>
      <div className="wheel-nav-label" aria-hidden="true">NAV</div>
      <button type="button" className="wheel-step wheel-step-down" aria-label={lang === 'es' ? 'Mover rueda hacia abajo' : 'Move wheel down'} onClick={() => stepWheel(1)} disabled={active === sections[sections.length - 1].id}><ChevronDown /></button>
    </div>
  </div>;
}

function Features({ active, lang }) {
  const setsEs = {
    inicio: [[MonitorSmartphone,'DISEÑO RESPONSIVE','Perfecta en celular, tablet y computadora.'],[Rocket,'RÁPIDA Y CLARA','Una experiencia fluida que facilita tomar acción.'],[Search,'LISTA PARA ENCONTRARSE','Estructura preparada para SEO y crecimiento.']],
    beneficios: [[ShieldCheck,'PRIMERA IMPRESIÓN PROFESIONAL','Los clientes forman una opinión en segundos.'],[MonitorSmartphone,'COMPATIBLE CON CELULARES','La mayoría de tus visitas llegarán desde un teléfono.'],[Rocket,'PREPARADA PARA CRECER','Lista para integrar citas, pagos o tienda cuando tu negocio lo necesite.']],
    paquetes: [[Rocket,'ENTREGA RÁPIDA','Tu website avanza con un proceso claro para publicarla sin vueltas innecesarias.'],[Palette,'DISEÑO PERSONALIZADO','Cada website se diseña para reflejar la identidad de tu negocio.'],[MonitorSmartphone,'OPTIMIZADA PARA CELULAR','Diseñada para verse profesional y funcionar perfecto desde un teléfono.']],
    portafolio: [[Palette,'IDENTIDAD PROPIA','Cada website se diseña alrededor del negocio.'],[MonitorSmartphone,'EXPERIENCIA PREMIUM','Diseño pensado para impresionar y funcionar.'],[Building2,'CADA NEGOCIO ES DIFERENTE','Creamos una presencia digital alineada a su personalidad y objetivos.']],
    proceso: [[Search,'1. CONOCEMOS','Entendemos tu negocio, cliente y objetivos.'],[Palette,'2. DISEÑAMOS','Creamos la experiencia visual y estructura.'],[Code2,'3. DESARROLLAMOS','Construimos y optimizamos la website.']],
    contacto: [[Phone,'HABLEMOS','Revisamos tu proyecto sin hacerlo complicado.'],[Mail,'COTIZACIÓN CLARA','Te recomendamos el plan adecuado.'],[MapPin,'NEGOCIOS LOCALES','Trabajamos desde Salinas, California.']],
  };
  const setsEn = {
    inicio: [[MonitorSmartphone,'RESPONSIVE DESIGN','Perfect on phones, tablets, and computers.'],[Rocket,'FAST AND CLEAR','A smooth experience that makes action easy.'],[Search,'READY TO BE FOUND','A structure prepared for SEO and growth.']],
    beneficios: [[ShieldCheck,'PROFESSIONAL FIRST IMPRESSION','Customers form an opinion in seconds.'],[MonitorSmartphone,'MOBILE COMPATIBLE','Most of your visits will come from a phone.'],[Rocket,'READY TO GROW','Ready to integrate appointments, payments, or a store when your business needs it.']],
    paquetes: [[Rocket,'FAST DELIVERY','A clear process to launch your website without unnecessary back and forth.'],[Palette,'CUSTOM DESIGN','Every website is designed to reflect your business identity.'],[MonitorSmartphone,'MOBILE OPTIMIZED','Designed to look professional and work smoothly from a phone.']],
    portafolio: [[Palette,'A UNIQUE IDENTITY','Every website is designed around the business.'],[MonitorSmartphone,'PREMIUM EXPERIENCE','Design created to impress and perform.'],[Building2,'EVERY BUSINESS IS DIFFERENT','We create a digital presence aligned with its personality and goals.']],
    proceso: [[Search,'1. DISCOVERY','We understand your business, customer, and goals.'],[Palette,'2. DESIGN','We create the visual experience and structure.'],[Code2,'3. DEVELOPMENT','We build and optimize the website.']],
    contacto: [[Phone,'LET US TALK','We review your project without making it complicated.'],[Mail,'A CLEAR QUOTE','We recommend the right plan.'],[MapPin,'LOCAL BUSINESSES','We work from Salinas, California.']],
  };
  const sets = lang === 'en' ? setsEn : setsEs;
  return <div className="features">{(sets[active] || sets.inicio).map(([Icon,title,text]) => <div className="feature" key={title}><div className="feature-icon"><Icon /></div><strong>{title}</strong><p>{text}</p></div>)}</div>;
}

function ContentPanel({ active, onNavigate, lang }) {
  const item = (lang === 'en' ? contentEn : contentEs)[active];
  return <main className={`content-panel content-${active}`}><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity:0,y:18,filter:'blur(4px)' }} animate={{ opacity:1,y:0,filter:'blur(0)' }} exit={{ opacity:0,y:-14 }} transition={{ duration:.55 }}>
    {item.kicker && <p className="kicker">{item.kicker}</p>}<h1>{item.title}</h1><p className="description">{item.description}</p>{active !== 'inicio' && <Features active={active} lang={lang} />}
    {active === 'inicio' && <div className="hero-actions"><button onClick={() => onNavigate('beneficios')}>{lang === 'es' ? 'CONOCE IMPULSO DIGITAL' : 'MEET IMPULSO DIGITAL'} <ChevronRight /></button><button className="secondary" onClick={() => onNavigate('paquetes')}>{lang === 'es' ? 'VER PLANES' : 'VIEW PLANS'}</button></div>}
  </motion.div></AnimatePresence></main>;
}

const panelMotion = { initial:{opacity:0,x:28,filter:'blur(7px)'}, animate:{opacity:1,x:0,filter:'blur(0)'}, exit:{opacity:0,x:18,filter:'blur(5px)'}, transition:{duration:.65,ease:[.22,1,.36,1]} };

function HeroShowcase({ onNavigate, lang }) {
  const projects = [
    { name:'KT STUDIOS', url:'www.ktstudiost.com', type:'BEAUTY • BOOKING', tone:'beauty', headline:'Beauty, revealed with intention.', shots:['./standalone/project-assets/kt-home.png','./standalone/project-assets/kt-services.png','./standalone/project-assets/kt-about.png'] },
    { name:'MARIA’S HOUSEKEEPING', url:'mariashousekeeping.com', type:'CLEANING • QUOTES', tone:'cleaning', headline:'Cleaner spaces. Better lives.', shots:['./standalone/project-assets/maria-home.png','./standalone/project-assets/maria-quote.png','./standalone/project-assets/maria-mobile.png'] },
    { name:'LUIS LANDSCAPING', url:'luislandscaping.com', type:'LANDSCAPING • MOBILE', tone:'landscape', headline:'Outdoor spaces built to last.', shots:['./standalone/project-assets/luis-home.png','./standalone/project-assets/luis-services.png','./standalone/project-assets/luis-gallery.png'] },
  ];
  const [current, setCurrent] = useState(0);
  const project = projects[current];
 return <motion.aside className="v3-panel hero-showcase hero-showcase-clean" {...panelMotion}>
    <div className="showcase-intro"><span>{lang === 'es' ? 'ASÍ PODRÍA VERSE TU NEGOCIO' : 'THIS IS HOW YOUR BUSINESS COULD LOOK'}</span><i>{String(current + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</i></div>
    <div className="showcase-monitor premium-monitor">
      <div className="showcase-top"><span/><span/><span/><small>{project.url}</small></div>
      <div className={`showcase-screen project-showcase-screen ${project.tone}`}>
        <img className="project-main-shot" src={project.shots[0]} alt={`${project.name} website`} />
        <div className="project-showcase-caption"><small>{project.type}</small><strong>{project.name}</strong><span>{project.headline}</span></div>
        <div className="project-shot-stack">
          {project.shots.slice(1).map((shot,index)=><img key={shot} src={shot} alt={`${project.name} captura ${index + 2}`} />)}
        </div>
      </div>
      <div className="showcase-base"/>
    </div>
    <div className="showcase-selector">{projects.map((item,index)=><button key={item.name} className={index===current?'active':''} onClick={() => setCurrent(index)} aria-label={`Mostrar ${item.name}`}><span/>{item.name}</button>)}</div>
  </motion.aside>;
}

function BenefitsPanel({ lang }) {
  const cardsEs=[[ShieldCheck,'GENERA CONFIANZA AL INSTANTE.','Una website profesional transmite seriedad desde el primer click.'],[Clock3,'TRABAJA 24/7','Explica tus servicios y recibe contactos incluso cuando estás ocupado.'],[UsersRound,'ATRAE CLIENTES','Facilita que las personas te encuentren, te entiendan y te contacten.'],[BadgeCheck,'FORTALECE TU MARCA','Tu negocio deja de depender únicamente de redes sociales.']];
  const cardsEn=[[ShieldCheck,'BUILDS TRUST','A professional image helps new customers believe in your business.'],[Clock3,'WORKS 24/7','Explains your services and receives leads even while you are busy.'],[UsersRound,'ATTRACTS CUSTOMERS','Makes it easier for people to find, understand, and contact you.'],[BadgeCheck,'STRENGTHENS YOUR BRAND','Your business no longer depends only on social media.']];
  const cards = lang === 'en' ? cardsEn : cardsEs;
  return <motion.aside className="v3-panel" {...panelMotion}><div className="v3-panel-head"><span>{lang === 'es' ? 'IMPULSO / BENEFICIOS' : 'IMPULSO / BENEFITS'}</span><i>04</i></div><div className="benefit-grid">{cards.map(([Icon,t,d],i)=><motion.div className="benefit-card" key={t} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.12+i*.08}}><Icon/><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></motion.div>)}</div></motion.aside>;
}

function PackagesPanel({ onNavigate, lang }) {
  const plansEs=[
    {name:'WEBSITE STARTER',tag:'IDEAL PARA COMENZAR',price:'$600',items:['Website profesional de una sola página','Hasta 6 secciones','Adaptada a computadoras, tablets y celulares','Formulario de contacto','Configuración básica para aparecer en Google','Integración con redes sociales']},
    {name:'WEBSITE PRO',tag:'IDEAL PARA NEGOCIOS EN CRECIMIENTO',price:'$1200',featured:true,items:['Website de hasta 6 páginas principales','Mayor organización de servicios y contenido','Animaciones e interacciones premium','Experiencia personalizada para tu negocio','Configuración mejorada para buscadores','Mayor enfoque en convertir visitas en clientes']}
  ];
  const plansEn=[
    {name:'WEBSITE STARTER',tag:'IDEAL TO GET STARTED',price:'$600',items:['Professional website','Responsive design for computers, tablets, and phones','Contact form','Basic SEO optimization','Social media integration']},
    {name:'WEBSITE PRO',tag:'IDEAL FOR GROWING BUSINESSES',price:'$1200',featured:true,items:['Everything included in Starter','More sections and content','Premium animations and interactions','Fully personalized experience','Improved SEO optimization','Greater focus on customer conversion']}
  ];
  const plans = lang === 'en' ? plansEn : plansEs;
  return <motion.aside className="v3-panel packages-v3" {...panelMotion}>
    <div className="v3-panel-head"><span>{lang === 'es' ? 'IMPULSO / PLANES' : 'IMPULSO / PLANS'}</span><i>{lang === 'es' ? '2 OPCIONES' : '2 OPTIONS'}</i></div>
    <div className="package-grid">
      {plans.map((p,i)=><div className={`package-card ${p.featured?'featured':''}`} key={p.name}>
        <div className="package-top"><span>0{i+1}</span><em>{p.tag}</em></div>
        <h2>{p.name}</h2>
        <div className="package-price"><strong>{p.price}</strong><small>{lang === 'es' ? '' : 'PROJECT PRICE'}</small></div>
        <ul>{p.items.map(x=><li key={x}><BadgeCheck/>{x}</li>)}</ul>
        <div className="package-delivery"><span>{lang === 'es' ? 'TIEMPO ESTIMADO DE ENTREGA' : 'ESTIMATED DELIVERY TIME'}</span><strong>{lang === 'es' ? '10–15 días hábiles' : '10–15 business days'}</strong></div>
        <div className="package-support"><strong>{lang === 'es' ? '30 DÍAS DE SOPORTE INCLUIDOS' : '30 DAYS OF SUPPORT INCLUDED'}</strong><p>{lang === 'es' ? 'Incluye corrección de errores, cambios menores de contenido, imágenes y pequeños ajustes posteriores a la entrega.' : 'Includes bug fixes, minor content and image changes, and small adjustments after delivery.'}</p><small>{lang === 'es' ? 'No incluye nuevas funciones, rediseños completos ni ampliaciones del proyecto.' : 'Does not include new features, complete redesigns, or project expansions.'}</small></div>
        <button onClick={() => onNavigate('contacto')}>{lang === 'es' ? 'SOLICITAR COTIZACIÓN' : 'REQUEST A QUOTE'} <ChevronRight /></button>
      </div>)}
    </div>
    <section className="custom-project-invitation" data-future-fields="business-type,products-services,competition,mission,vision,reference-websites,social-media,project-goals">
      <span>{lang === 'es' ? 'PROYECTO PERSONALIZADO' : 'CUSTOM PROJECT'}</span>
      <h3>{lang === 'es' ? '¿BUSCAS UNA WEBSITE PERSONALIZADA?' : 'LOOKING FOR A CUSTOM WEBSITE?'}</h3>
      <p>{lang === 'es' ? 'Si nuestros paquetes no se adaptan exactamente a tu proyecto, cuéntanos cómo imaginas tu presencia digital. Analizaremos tu idea y te propondremos la mejor solución para cumplir tus objetivos.' : 'If our packages do not fit your project exactly, tell us how you imagine your digital presence. We will analyze your idea and propose the best solution to meet your goals.'}</p>
      <button type="button" onClick={() => onNavigate('contacto')}>{lang === 'es' ? 'DISEÑAR MI PROYECTO' : 'DESIGN MY PROJECT'} <ChevronRight /></button>
    </section>
  </motion.aside>;
}

function PortfolioPanel({ lang }) {
 const projects=[
   {name:'KT STUDIOS',type:'BEAUTY • BOOKING',color:'gold',image:'./standalone/project-assets/kt-home.png'},
   {name:'MARIA’S HOUSEKEEPING',type:'CLEANING • QUOTES',color:'pink',image:'./standalone/project-assets/maria-home.png'},
   {name:'LUIS LANDSCAPING',type:'LANDSCAPING • MOBILE',color:'green',image:'./standalone/project-assets/luis-home.png'},
 ];
 return <motion.aside className="v3-panel" {...panelMotion}><div className="v3-panel-head"><span>{lang === 'es' ? 'IMPULSO / PORTAFOLIO' : 'IMPULSO / PORTFOLIO'}</span><i>{lang === 'es' ? '03 WEBSITES' : '03 WEBSITES'}</i></div><div className="portfolio-v3-grid portfolio-v3-grid-three">{projects.map((project,i)=><motion.div className={`portfolio-v3-card portfolio-real-card ${project.color}`} key={project.name} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.08+i*.06}}><div className="mini-browser real-mini-browser"><span/><span/><span/><img src={project.image} alt={`${project.name} preview`} /></div><h3>{project.name}</h3><p>{project.type}</p><button>{lang === 'es' ? 'VER WEBSITE' : 'VIEW WEBSITE'} <ChevronRight /></button></motion.div>)}</div></motion.aside>;
}

function ProcessPanel({ onNavigate, lang }) {
 const stepsEs=[[Search,'CONOCEMOS TU NEGOCIO','Objetivos, cliente y servicios.'],[Palette,'DISEÑAMOS TU WEBSITE','Estructura, estilo y experiencia.'],[Code2,'LA DESARROLLAMOS','Responsive, velocidad y funciones.'],[Send,'LA PUBLICAMOS','Dominio, lanzamiento y revisión final.']];
 const stepsEn=[[Search,'WE LEARN ABOUT YOUR BUSINESS','Goals, customers, and services.'],[Palette,'WE DESIGN YOUR WEBSITE','Structure, style, and experience.'],[Code2,'WE DEVELOP IT','Responsive design, speed, and functions.'],[Send,'WE LAUNCH IT','Domain, launch, and final review.']];
 const steps = lang === 'en' ? stepsEn : stepsEs;
 const extrasEs=[[Palette,'Branding'],[Image,'Logos y flyers'],[Globe2,'Google Business'],[Wrench,'Hosting y mantenimiento'],[Share2,'Redes sociales'],[BarChart3,'Analítica']];
 const extrasEn=[[Palette,'Branding'],[Image,'Logos and flyers'],[Globe2,'Google Business'],[Wrench,'Hosting and maintenance'],[Share2,'Social media'],[BarChart3,'Analytics']];
 const extras = lang === 'en' ? extrasEn : extrasEs;
 return <motion.aside className="v3-panel" {...panelMotion}><div className="v3-panel-head"><span>{lang === 'es' ? 'IMPULSO / PROCESO' : 'IMPULSO / PROCESS'}</span><i>04 STEPS</i></div><div className="process-flow">{steps.map(([Icon,t,d],i)=><React.Fragment key={t}><div className="process-step"><span>0{i+1}</span><Icon/><h3>{t}</h3><p>{d}</p></div>{i<3&&<ChevronRight className="process-arrow"/>}</React.Fragment>)}</div><div className="extras-block"><div><small>{lang === 'es' ? 'SERVICIOS ADICIONALES' : 'ADDITIONAL SERVICES'}</small><strong>{lang === 'es' ? 'También podemos ayudarte con:' : 'We can also help you with:'}</strong></div><div className="extra-chips">{extras.map(([Icon,x])=><span key={x}><Icon/>{x}</span>)}</div></div><button className="v3-primary" onClick={() => onNavigate('contacto')}>{lang === 'es' ? 'COMENZAR MI PROYECTO' : 'START MY PROJECT'} <ChevronRight /></button></motion.aside>;
}

function ContactPanel({ lang }) {
 return <motion.aside className="v3-panel contact-v3" {...panelMotion}><div className="contact-glow"/><div className="contact-orb"><Brand /></div><div className="v3-panel-head centered"><span>{lang === 'es' ? 'IMPULSO / COTIZACIÓN' : 'IMPULSO / QUOTE'}</span><strong>{lang === 'es' ? 'HABLEMOS DE TU WEBSITE' : 'LET US TALK ABOUT YOUR WEBSITE'}</strong></div><p className="contact-copy">{lang === 'es' ? 'Cuéntanos sobre tu negocio y te ayudaremos a elegir la mejor forma de comenzar.' : 'Tell us about your business and we will help you choose the best way to get started.'}</p><div className="contact-list"><a href="tel:+18312881019"><Phone/><span>(831) 288-1019</span></a><a href="mailto:daniel@impulsodigitalglobal.com"><Mail/><span>daniel@impulsodigitalglobal.com</span></a><div><MapPin/><span>Salinas, California</span></div></div><button className="contact-cta">{lang === 'es' ? 'SOLICITAR COTIZACIÓN' : 'REQUEST A QUOTE'} <ChevronRight /></button></motion.aside>;
}

function RightPanel({ active, onNavigate, lang }) {
 return <AnimatePresence mode="wait">{active==='inicio'?<HeroShowcase key="hero" onNavigate={onNavigate} lang={lang}/>:active==='beneficios'?<BenefitsPanel key="benefits" lang={lang}/>:active==='paquetes'?<PackagesPanel key="packages" onNavigate={onNavigate} lang={lang}/>:active==='portafolio'?<PortfolioPanel key="portfolio" lang={lang}/>:active==='proceso'?<ProcessPanel key="process" onNavigate={onNavigate} lang={lang}/>:<ContactPanel key="contact" lang={lang}/>}</AnimatePresence>;
}

function MobileNavigation({ active, onChange, sections, lang }) {
 const activeIndex = Math.max(0, sections.findIndex(section => section.id === active));
 const total = sections.length;
 const slotFor = index => {
   let delta = index - activeIndex;
   if (delta > total / 2) delta -= total;
   if (delta < -total / 2) delta += total;
   return delta;
 };

 return <nav className="mobile-orbit-nav" aria-label={lang === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>
   <div className="mobile-orbit-bg"><i/><i/><i/></div>
   <div className="mobile-orbit-track">
     {sections.filter(({ id }) => id !== 'proceso').map(({id,label,Icon}, index)=>{
       const slot = slotFor(index);
       return <button key={id} data-slot={slot} className={`mobile-orbit-button ${active===id?'active':''}`} onClick={()=>onChange(id)} aria-label={label}>
         <span className="mobile-orbit-button-glow"/>
         <span className="mobile-orbit-button-face"><Icon/><small>{label}</small></span>
       </button>;
     })}
   </div>
   <div className="mobile-orbit-instruction">{lang === 'es' ? 'TOCA UNA SECCIÓN' : 'TAP A SECTION'}</div>
 </nav>;
}

function Footer({ active, onChange, sections }) { return <footer className="bottom-bar"><div className="section-progress"><div className="progress-line"/>{sections.map(s=><button key={s.id} className={active===s.id?'active':''} onClick={()=>onChange(s.id)} aria-label={s.label}/>)}</div><div className="socials"/></footer>; }

function Starfield() { const ref=useRef(null); useEffect(()=>{const c=ref.current,ctx=c.getContext('2d');let f;const stars=Array.from({length:95},()=>({x:Math.random(),y:Math.random(),a:Math.random()*.45+.1,s:Math.random()*1.1+.25}));const resize=()=>{c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio};const draw=()=>{ctx.clearRect(0,0,c.width,c.height);stars.forEach(st=>{ctx.globalAlpha=st.a;ctx.fillStyle='#9ed7ff';ctx.beginPath();ctx.arc(st.x*c.width,st.y*c.height,st.s*devicePixelRatio,0,Math.PI*2);ctx.fill()});f=requestAnimationFrame(draw)};resize();draw();addEventListener('resize',resize);return()=>{cancelAnimationFrame(f);removeEventListener('resize',resize)}},[]);return <canvas className="starfield" ref={ref}/>; }

function FloatingCallButton({ lang }) { return <a className="floating-call-button" href="tel:+18312881019" aria-label={lang === 'es' ? 'Llamar a Impulso Digital' : 'Call Impulso Digital'}><Phone/><span>{lang === 'es' ? 'LLÁMANOS' : 'CALL US'}</span></a>; }

function App(){const[active,setActive]=useState('inicio');const[mobilePreview,setMobilePreview]=useState(false);const[lang,setLang]=useState('es');const[isRealMobile]=useState(()=>typeof window!=='undefined'&&(window.innerWidth<=760||((navigator.maxTouchPoints||0)>0&&window.matchMedia('(pointer: coarse)').matches&&(screen.width<=932||screen.height<=932))));const[desktopMode,setDesktopMode]=useState(false);const scrollStageRef=useRef(null);const sections=lang==='en'?sectionsEn:sectionsEs;useEffect(()=>{document.documentElement.lang=lang},[lang]);useEffect(()=>{const viewport=document.querySelector('meta[name=\"viewport\"]');if(!viewport)return;viewport.setAttribute('content',desktopMode&&!isRealMobile?'width=1440':'width=device-width, initial-scale=1.0');requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));window.scrollTo({top:0,left:0,behavior:'auto'});},[desktopMode,isRealMobile]);const changeSection=id=>{setActive(id);if(typeof window!=='undefined'&&!desktopMode&&(isRealMobile||window.matchMedia('(max-width: 760px)').matches)){requestAnimationFrame(()=>scrollStageRef.current?.scrollTo({top:0,left:0,behavior:'smooth'}));}};return <div className={`system-shell ${mobilePreview?'mobile-preview':''} ${desktopMode&&!isRealMobile?'force-desktop':''} ${isRealMobile?'real-mobile':''}`}><Starfield/><div className="grain"/><div className="ambient-light"/><Header mobilePreview={mobilePreview} onToggleMobile={()=>setMobilePreview(v=>!v)} lang={lang} onLanguage={setLang} isMobileDevice={isRealMobile} desktopMode={false} onToggleDesktop={()=>{}}/><MechanicalWheel active={active} onChange={changeSection} sections={sections} lang={lang}/><MobileNavigation active={active} onChange={changeSection} sections={sections} lang={lang}/><div className="mobile-scroll-stage" ref={scrollStageRef}><ContentPanel active={active} onNavigate={changeSection} lang={lang}/><RightPanel active={active} onNavigate={changeSection} lang={lang}/></div><FloatingCallButton lang={lang}/><Footer active={active} onChange={changeSection} sections={sections} lang={lang}/></div>}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
