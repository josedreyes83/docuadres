import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

function GovCoStrip() {
  return (
    <div className="govco-strip">
      <div className="govco-strip__left">
        <div className="govco-strip__flag">
          <span style={{background:'#FCD116'}}/>
          <span style={{background:'#003893'}}/>
          <span style={{background:'#CE1126'}}/>
        </div>
        <span>República de Colombia</span>
      </div>
      <div className="govco-strip__right">
        <a href="https://www.adres.gov.co" target="_blank" rel="noopener noreferrer">adres.gov.co</a>
        <span style={{opacity:0.4}}>|</span>
        <a href="https://www.gov.co" target="_blank" rel="noopener noreferrer">gov.co</a>
      </div>
    </div>
  );
}

const MODULOS = [
  { icon: '⚙️', title: 'Alistamiento', hus: '109 HUs', desc: 'Datos maestros: EPS, Condiciones, Giro Límite, REPS, ERPF', riesgo: 'medio', link: '/docs/modulos/alistamiento' },
  { icon: '✅', title: 'Validación', hus: '56 HUs', desc: 'Verificación de facturas, ítems y condiciones de elegibilidad', riesgo: 'alto', link: '/docs/modulos/validacion' },
  { icon: '🏥', title: 'REPS', hus: '53 HUs', desc: 'Registro Especial de Prestadores: Prestador, Sede, Servicio, Capacidad', riesgo: 'critico', link: '/docs/modulos/reps' },
  { icon: '📬', title: 'Postulación', hus: '17 HUs', desc: 'Registro de postulaciones de giro dentro de ventanas de tiempo', riesgo: 'medio', link: '/docs/modulos/postulacion' },
  { icon: '💰', title: 'Liquidación', hus: '10 HUs', desc: 'Cálculo definitivo y orden de pago a Tesorería — 100% completo', riesgo: 'bajo', link: '/docs/modulos/liquidacion' },
  { icon: '🔐', title: 'AUTH', hus: '18 HUs', desc: 'Autenticación y roles — prerequisito de todo el sistema', riesgo: 'critico', link: '/docs/modulos/auth' },
  { icon: '📊', title: 'Reportes', hus: '19 HUs', desc: 'Infraestructura Hangfire + Azure Blob + CSV compartida por módulos', riesgo: 'alto', link: '/docs/modulos/reportes' },
  { icon: '📋', title: 'Pre-Liquidación', hus: '7 HUs', desc: 'Cálculo previo antes de la liquidación definitiva', riesgo: 'bajo', link: '/docs/modulos/pre-liquidacion' },
  { icon: '🏛️', title: 'OFAS', hus: '9 HUs', desc: 'Portal ciudadano para solicitudes de garantías — sistema independiente', riesgo: 'medio', link: '/docs/modulos/ofas' },
];

const ACTORES = [
  { icon: '🏛️', name: 'ADRES', role: 'Operador central. Configura, valida, liquida y gira los recursos.' },
  { icon: '🏢', name: 'EPS', role: 'Aseguradora. Su nivel de deuda activa el mecanismo de Giro Directo.' },
  { icon: '🏥', name: 'IPS / Prestador', role: 'Hospital, clínica o laboratorio receptor directo del giro.' },
  { icon: '💼', name: 'ERP / Tesorería', role: 'Ejecuta la transferencia bancaria real al prestador de salud.' },
];

const RIESGO_LABEL = { critico: 'Crítico', alto: 'Alto', medio: 'Medio', bajo: 'Bajo' };

export default function Home() {
  const logoAdres = useBaseUrl('/img/logo-adres-oficial.png');
  return (
    <Layout title="Inicio" description="Sistema GiroDirecto ADRES — Pago directo a prestadores de salud">

      <GovCoStrip />

      {/* HERO */}
      <div className="hero-adres">
        <div className="hero-adres__logos">
          <img src={logoAdres} alt="ADRES" />
          <div className="sep" />
          <div style={{color:'rgba(255,255,255,0.9)', fontWeight:700, fontSize:'1.05rem', lineHeight:1.3, textAlign:'left'}}>
            <div>GiroDirecto</div>
            <div style={{fontWeight:400, fontSize:'0.78rem', opacity:0.8}}>Sistema de Pago Directo</div>
          </div>
        </div>
        <div className="hero-adres__tag">Sistema de información SGSSS</div>
        <div className="hero-adres__title">Pago Directo a Prestadores de Salud</div>
        <div className="hero-adres__subtitle">
          Sistema de pago directo de <strong>ADRES</strong> a prestadores de salud (IPS),
          garantizando la continuidad de los servicios cuando las EPS no pueden pagar.
        </div>
        <div>
          <Link className="hero-adres__badge" to="/infografia-ley-1122" style={{ textDecoration: 'none', cursor: 'pointer' }}>⚖️ Ley 1122/2007 →</Link>
          <Link className="hero-adres__badge" to="/docs/Normativa/decreto-489-2024" style={{ textDecoration: 'none', cursor: 'pointer' }}>📜 Decreto 489/2024 →</Link>
          <span className="hero-adres__badge">255 Historias de Usuario</span>
          <span className="hero-adres__badge">Angular + .NET Core 6</span>
        </div>
        <div className="hero-adres__cta">
          <Link className="btn-primary-adres" to="/docs/intro">Ver documentación</Link>
          <Link className="btn-outline-adres" to="/docs/arquitectura/flujo">Flujo del proceso</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-item"><div className="stat-item__number">255</div><div className="stat-item__label">HUs totales</div></div>
        <div className="stat-item"><div className="stat-item__number">9</div><div className="stat-item__label">Módulos</div></div>
        <div className="stat-item"><div className="stat-item__number">5</div><div className="stat-item__label">Epics</div></div>
        <div className="stat-item"><div className="stat-item__number">39</div><div className="stat-item__label">Features</div></div>
        <div className="stat-item"><div className="stat-item__number">80</div><div className="stat-item__label">HUs completadas</div></div>
        <div className="stat-item"><div className="stat-item__number">1</div><div className="stat-item__label">Módulo al 100%</div></div>
      </div>

      {/* FLUJO */}
      <div className="flujo-section">
        <div className="flujo-section__title">Flujo del Proceso GiroDirecto</div>
        <div className="flujo-steps">
          {[
            { n: '01', name: 'Alistamiento', desc: 'Datos maestros EPS, REPS, Condiciones' },
            null,
            { n: '02', name: 'Pre-Liquidación', desc: 'Cálculo anticipado de montos' },
            null,
            { n: '03', name: 'Validación', desc: 'Verificación facturas e ítems' },
            null,
            { n: '04', name: 'Postulación', desc: 'Registro de giros por ventana' },
            null,
            { n: '05', name: 'Liquidación', desc: 'Pago definitivo a IPS' },
          ].map((step, i) =>
            step === null
              ? <div key={i} className="flujo-arrow">→</div>
              : <div key={i} className="flujo-step">
                  <div className="flujo-step__number">Etapa {step.n}</div>
                  <div className="flujo-step__name">{step.name}</div>
                  <div className="flujo-step__desc">{step.desc}</div>
                </div>
          )}
        </div>
      </div>

      {/* MÓDULOS */}
      <div className="modulos-section">
        <div className="modulos-section__title">Módulos del Sistema</div>
        <div className="modulos-grid">
          {MODULOS.map((m) => (
            <Link key={m.title} className="modulo-card" to={m.link}>
              <div className="modulo-card__icon">{m.icon}</div>
              <div className="modulo-card__title">{m.title}</div>
              <div className="modulo-card__hus">{m.hus}</div>
              <div className="modulo-card__desc">{m.desc}</div>
              <span className={`modulo-card__badge badge-${m.riesgo}`}>
                Riesgo {RIESGO_LABEL[m.riesgo]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ACTORES */}
      <div className="actores-section">
        <div className="actores-section__title">Actores del Sistema</div>
        <div className="actores-grid">
          {ACTORES.map((a) => (
            <div key={a.name} className="actor-card">
              <div className="actor-card__icon">{a.icon}</div>
              <div className="actor-card__name">{a.name}</div>
              <div className="actor-card__role">{a.role}</div>
            </div>
          ))}
        </div>
      </div>

    </Layout>
  );
}
