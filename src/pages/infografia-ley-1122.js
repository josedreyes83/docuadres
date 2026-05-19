import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

const styles = {
  page: { fontFamily: 'Arial, sans-serif', color: '#1a1a2e', background: '#f8faff' },
  hero: {
    background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 60%, #0288d1 100%)',
    color: '#fff', textAlign: 'center', padding: '60px 24px 48px',
  },
  heroTag: {
    display: 'inline-block', background: 'rgba(255,255,255,0.2)',
    borderRadius: 20, padding: '4px 16px', fontSize: 13, marginBottom: 16, letterSpacing: 1,
  },
  heroTitle: { fontSize: 42, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.1 },
  heroSub: { fontSize: 18, opacity: 0.9, maxWidth: 640, margin: '0 auto 28px' },
  heroMeta: { fontSize: 13, opacity: 0.75, marginBottom: 24 },
  heroBtn: {
    display: 'inline-block', background: '#fff', color: '#1565c0',
    borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 15,
    textDecoration: 'none', marginRight: 12,
  },
  heroBtnOutline: {
    display: 'inline-block', border: '2px solid rgba(255,255,255,0.7)', color: '#fff',
    borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 15,
    textDecoration: 'none',
  },
  section: { maxWidth: 1060, margin: '0 auto', padding: '48px 24px' },
  sectionTitle: {
    fontSize: 26, fontWeight: 800, color: '#1565c0',
    borderLeft: '5px solid #0288d1', paddingLeft: 16, marginBottom: 32,
  },

  // Stats row
  statsRow: { display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 },
  statCard: {
    background: '#fff', borderRadius: 16, padding: '24px 32px',
    boxShadow: '0 2px 16px rgba(21,101,192,0.10)', textAlign: 'center',
    minWidth: 140, flex: '1 1 140px', maxWidth: 180,
  },
  statNum: { fontSize: 36, fontWeight: 900, color: '#1565c0', lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#555', marginTop: 6 },

  // Timeline
  timeline: { position: 'relative', padding: '0 0 0 40px' },
  timelineItem: { display: 'flex', gap: 20, marginBottom: 36, position: 'relative' },
  timelineDot: {
    position: 'absolute', left: -40, top: 4,
    width: 28, height: 28, borderRadius: '50%', background: '#1565c0',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 900, fontSize: 13, flexShrink: 0,
  },
  timelineContent: { flex: 1 },
  timelineYear: { fontSize: 12, color: '#0288d1', fontWeight: 700, letterSpacing: 1, marginBottom: 4 },
  timelineTitle: { fontSize: 16, fontWeight: 800, color: '#1a237e', marginBottom: 4 },
  timelineText: { fontSize: 14, color: '#444', lineHeight: 1.6 },

  // Artículos cards
  artGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 },
  artCard: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(21,101,192,0.10)',
  },
  artCardHeader: {
    background: '#1565c0', color: '#fff', padding: '16px 20px',
    fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
  },
  artCardHeaderStar: { background: '#e65100' },
  artCardBody: { padding: '20px' },
  artCardTitle: { fontSize: 16, fontWeight: 800, color: '#1a237e', marginBottom: 8 },
  artCardText: { fontSize: 14, color: '#444', lineHeight: 1.7, marginBottom: 12 },
  artCardTag: {
    display: 'inline-block', background: '#e3f2fd', color: '#1565c0',
    borderRadius: 12, padding: '3px 12px', fontSize: 12, fontWeight: 700,
  },
  artCardTagWarn: { background: '#fff3e0', color: '#e65100' },

  // Tabla plazos
  tableWrap: { overflowX: 'auto', marginBottom: 32 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(21,101,192,0.08)' },
  th: { background: '#1565c0', color: '#fff', padding: '14px 18px', fontSize: 13, fontWeight: 700, textAlign: 'left' },
  td: { padding: '12px 18px', fontSize: 14, color: '#333', borderBottom: '1px solid #e8f0fe' },
  tdAlt: { background: '#f0f7ff' },

  // Cadena causal
  cadena: {
    background: '#fff', borderRadius: 16, padding: 32,
    boxShadow: '0 2px 16px rgba(21,101,192,0.10)', marginBottom: 40,
  },
  cadenaRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' },
  cadenaBox: {
    background: '#e3f2fd', color: '#1565c0', borderRadius: 10,
    padding: '10px 18px', fontSize: 14, fontWeight: 700, textAlign: 'center',
  },
  cadenaBoxOrange: { background: '#fff3e0', color: '#e65100' },
  cadenaBoxGreen: { background: '#e8f5e9', color: '#2e7d32' },
  cadenaArrow: { fontSize: 22, color: '#90a4ae', flexShrink: 0 },

  // Evolución
  evGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 },
  evCard: {
    background: '#fff', borderRadius: 12, padding: '20px',
    boxShadow: '0 2px 12px rgba(21,101,192,0.08)', borderTop: '4px solid #1565c0',
  },
  evYear: { fontSize: 22, fontWeight: 900, color: '#1565c0', marginBottom: 6 },
  evNorm: { fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 4 },
  evText: { fontSize: 13, color: '#666', lineHeight: 1.5 },
  evCardActive: { borderTop: '4px solid #e65100' },

  // CTA final
  cta: {
    background: 'linear-gradient(135deg, #1565c0, #0288d1)',
    borderRadius: 20, padding: '40px 32px', textAlign: 'center', color: '#fff', marginTop: 20,
  },
  ctaTitle: { fontSize: 22, fontWeight: 800, marginBottom: 12 },
  ctaText: { fontSize: 15, opacity: 0.9, marginBottom: 24 },
  ctaBtn: {
    display: 'inline-block', background: '#fff', color: '#1565c0',
    borderRadius: 8, padding: '12px 32px', fontWeight: 700, textDecoration: 'none', marginRight: 12,
  },
  ctaBtnOutline: {
    display: 'inline-block', border: '2px solid rgba(255,255,255,0.7)', color: '#fff',
    borderRadius: 8, padding: '12px 32px', fontWeight: 700, textDecoration: 'none',
  },

  breadcrumb: {
    background: '#e3f2fd', padding: '10px 24px', fontSize: 13, color: '#1565c0',
    display: 'flex', alignItems: 'center', gap: 8,
  },
};

const plazos = [
  ['Capitación', '100% — mes anticipado', '—', '—'],
  ['Evento / Global prospectivo / Grupo diagnóstico', 'Mín. 50% en 5 días desde factura', '30 días desde factura (R. Contributivo)', '60 días desde factura'],
  ['Régimen Subsidiado', 'Mín. 50%', '15 días desde que EPS recibe pago del ente territorial', '60 días desde factura'],
];

const evolucion = [
  { year: '2007', norm: 'Ley 1122', text: 'Plazos obligatorios EPS→IPS. Primer giro directo histórico.', active: false },
  { year: '2013', norm: 'Ley 1608', text: 'Fija 80% mínimo de giro para EPS en medidas especiales.', active: false },
  { year: '2016', norm: 'Decreto 780', text: 'Unifica toda la regulación del SGSSS en un solo decreto.', active: false },
  { year: '2023', norm: 'Ley 2294 Art.150', text: 'Universaliza el giro directo para EPS que incumplan patrimonio adecuado.', active: false },
  { year: '2024', norm: 'Decreto 489', text: 'Reglamenta: 80% UPC + 3 causales de activación del giro.', active: true },
];

export default function InfografiaLey1122() {
  return (
    <Layout title="Ley 1122 de 2007 — Infografía" description="Explicación visual de la Ley 1122 de 2007 y su impacto en GiroDirecto ADRES">
      <div style={styles.page}>

        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/" style={{ color: '#1565c0', textDecoration: 'none' }}>Inicio</Link>
          <span>›</span>
          <Link to="/docs/Normativa" style={{ color: '#1565c0', textDecoration: 'none' }}>Normativa</Link>
          <span>›</span>
          <span style={{ color: '#555' }}>Ley 1122 de 2007</span>
        </div>

        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroTag}>⚖️ MARCO NORMATIVO — INFOGRAFÍA</div>
          <div style={styles.heroTitle}>Ley 1122 de 2007</div>
          <div style={styles.heroSub}>
            La ley que obligó a las EPS a pagar a tiempo a los hospitales y clínicas,
            y creó el mecanismo de giro directo cuando no pueden hacerlo.
          </div>
          <div style={styles.heroMeta}>Congreso de Colombia · 9 de enero de 2007 · Diario Oficial 46506</div>
          <div>
            <a href="/docs/Normativa/ley-1122-2007" style={styles.heroBtn}>Ver texto completo →</a>
            <a href="/docs/Normativa/decreto-489-2024" style={styles.heroBtnOutline}>Decreto 489/2024</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ ...styles.section, paddingBottom: 0 }}>
          <div style={styles.statsRow}>
            {[
              { num: '46', label: 'Artículos totales de la ley' },
              { num: '13d', label: 'Artículo clave para GiroDirecto' },
              { num: '80%', label: 'Mínimo de giro a IPS (Ley 1608/2013)' },
              { num: '30', label: 'Días máx. para pagar factura sin glosa' },
              { num: '60', label: 'Días máx. para pagar factura con glosa' },
              { num: '5', label: 'Días para pago anticipado del 50%' },
            ].map(s => (
              <div key={s.label} style={styles.statCard}>
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ¿Por qué existe? */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>¿Por qué se creó esta ley?</div>
          <div style={styles.cadena}>
            <div style={styles.cadenaRow}>
              <div style={styles.cadenaBox}>EPS recibe UPC del Estado</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxOrange }}>EPS no paga a IPS a tiempo</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxOrange }}>Hospitales en crisis financiera</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxOrange }}>Riesgo para los pacientes</div>
            </div>
            <div style={{ marginTop: 20, padding: '14px 20px', background: '#e8f5e9', borderRadius: 10, borderLeft: '5px solid #2e7d32' }}>
              <strong style={{ color: '#2e7d32' }}>Solución de la Ley 1122:</strong>
              <span style={{ color: '#333', marginLeft: 8, fontSize: 14 }}>
                Establecer plazos obligatorios de pago y habilitar el giro directo del Estado cuando las EPS no cumplen.
              </span>
            </div>
          </div>

          {/* Artículos clave */}
          <div style={styles.sectionTitle}>Artículos clave para GiroDirecto</div>
          <div style={styles.artGrid}>

            <div style={styles.artCard}>
              <div style={{ ...styles.artCardHeader, ...styles.artCardHeaderStar }}>
                ⭐ ARTÍCULO 13 LITERAL D — EL MÁS IMPORTANTE
              </div>
              <div style={styles.artCardBody}>
                <div style={styles.artCardTitle}>Plazos obligatorios de pago EPS → IPS</div>
                <div style={styles.artCardText}>
                  Las EPS deben pagar a hospitales y clínicas en plazos definidos por ley.
                  <strong> Incumplir estos plazos es la raíz que activa el mecanismo de Giro Directo.</strong>
                </div>
                <span style={{ ...styles.artCardTag, ...styles.artCardTagWarn }}>Activa GiroDirecto</span>
              </div>
            </div>

            <div style={styles.artCard}>
              <div style={styles.artCardHeader}>
                📋 ARTÍCULO 12 — ANTECEDENTE HISTÓRICO
              </div>
              <div style={styles.artCardBody}>
                <div style={styles.artCardTitle}>Primer giro directo a IPS de Colombia</div>
                <div style={styles.artCardText}>
                  Autoriza por primera vez pagar directamente a los hospitales de la red pública cuando
                  las EPS (antes ARS) tienen deudas con el régimen subsidiado. Es el origen del concepto de giro directo.
                </div>
                <span style={styles.artCardTag}>Antecedente legal</span>
              </div>
            </div>

            <div style={styles.artCard}>
              <div style={styles.artCardHeader}>
                💰 ARTÍCULO 13 LITERAL A — FLUJO DE RECURSOS
              </div>
              <div style={styles.artCardBody}>
                <div style={styles.artCardTitle}>Obligación del Estado de garantizar el flujo</div>
                <div style={styles.artCardText}>
                  Los recursos del SGSSS (hoy administrados por ADRES) deben girarse trimestralmente
                  a las entidades territoriales. ADRES heredó esta responsabilidad del Fosyga.
                </div>
                <span style={styles.artCardTag}>Rol de ADRES</span>
              </div>
            </div>

          </div>

          {/* Tabla de plazos */}
          <div style={styles.sectionTitle}>Plazos del Artículo 13d — Cuánto tiene la EPS para pagar</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tipo de contrato EPS-IPS</th>
                  <th style={styles.th}>Anticipo obligatorio</th>
                  <th style={styles.th}>Plazo para el saldo</th>
                  <th style={styles.th}>Si hay glosa</th>
                </tr>
              </thead>
              <tbody>
                {plazos.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={i % 2 === 0 ? { ...styles.td, ...styles.tdAlt } : styles.td}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cómo se conecta al sistema */}
          <div style={styles.sectionTitle}>Cómo esta ley vive dentro del sistema GiroDirecto</div>
          <div style={styles.cadena}>
            <div style={styles.cadenaRow}>
              <div style={{ ...styles.cadenaBox, minWidth: 160 }}>EPS incumple plazos Art. 13d</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, minWidth: 160 }}>Acumula cartera con IPS</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxOrange, minWidth: 160 }}>Deteriora patrimonio adecuado</div>
            </div>
            <div style={{ ...styles.cadenaRow, marginTop: 8 }}>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxOrange, minWidth: 160 }}>Supersalud publica lista EPS</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxGreen, minWidth: 160 }}>ADRES activa Giro Directo</div>
              <div style={styles.cadenaArrow}>→</div>
              <div style={{ ...styles.cadenaBox, ...styles.cadenaBoxGreen, minWidth: 160 }}>Giro mín. 80% UPC a IPS</div>
            </div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {[
                { mod: 'Alistamiento', desc: 'Datos maestros EPS y condiciones' },
                { mod: 'Validación', desc: 'Verifica que IPS esté habilitada' },
                { mod: 'Pre-Liquidación', desc: 'Calcula el 80% a girar' },
                { mod: 'Postulación', desc: 'EPS reporta beneficiarios' },
                { mod: 'Liquidación', desc: 'ADRES ejecuta el giro' },
              ].map(m => (
                <div key={m.mod} style={{ background: '#f0f7ff', borderRadius: 10, padding: '12px 14px', borderLeft: '3px solid #1565c0' }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#1565c0', marginBottom: 4 }}>{m.mod}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Evolución normativa */}
          <div style={styles.sectionTitle}>Evolución normativa: de 2007 a hoy</div>
          <div style={styles.evGrid}>
            {evolucion.map(e => (
              <div key={e.year} style={{ ...styles.evCard, ...(e.active ? styles.evCardActive : {}) }}>
                <div style={{ ...styles.evYear, ...(e.active ? { color: '#e65100' } : {}) }}>{e.year}</div>
                <div style={styles.evNorm}>{e.norm}</div>
                <div style={styles.evText}>{e.text}</div>
                {e.active && <div style={{ marginTop: 8, fontSize: 11, color: '#e65100', fontWeight: 700 }}>▲ NORMA VIGENTE</div>}
              </div>
            ))}
          </div>

          {/* Timeline de historia */}
          <div style={styles.sectionTitle}>Cronología de la ley</div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px rgba(21,101,192,0.10)', marginBottom: 40 }}>
            <div style={styles.timeline}>
              {[
                { year: 'Ene 2007', title: 'Publicación de la Ley 1122', text: 'El Congreso aprueba la ley. Alvaro Uribe la promulga. Diario Oficial 46506. Reforma integral del SGSSS con foco en mejorar el flujo de recursos.' },
                { year: 'Art. 12', title: 'Primer giro directo autorizado', text: 'Se autoriza el giro directo a IPS de la red pública para pagar deudas históricas del régimen subsidiado. Nace el concepto en la legislación colombiana.' },
                { year: 'Art. 13d', title: 'Plazos de pago se vuelven ley', text: 'Las EPS quedan legalmente obligadas a pagar a IPS con anticipo del 50%, saldo en 30 días y facturas con glosa en máximo 60 días. Incumplir tiene consecuencias regulatorias.' },
                { year: '2013', title: 'Ley 1608 fortalece el mecanismo', text: 'Se establece el 80% mínimo de giro directo para EPS en medidas especiales. Se consolida el porcentaje que hoy usa GiroDirecto.' },
                { year: '2024', title: 'Decreto 489 lo universaliza', text: 'Basado en el Art. 150 de Ley 2294/2023, el Decreto 489 extiende el giro directo a todas las EPS que incumplan patrimonio adecuado, no solo a las intervenidas.' },
              ].map((item, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineDot}>{i + 1}</div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineYear}>{item.year}</div>
                    <div style={styles.timelineTitle}>{item.title}</div>
                    <div style={styles.timelineText}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={styles.cta}>
            <div style={styles.ctaTitle}>¿Quieres profundizar en la normativa?</div>
            <div style={styles.ctaText}>Lee el texto completo con análisis artículo por artículo, o revisa el Decreto 489/2024 que reglamenta el mecanismo actual.</div>
            <div>
              <a href="/docs/Normativa/ley-1122-2007" style={styles.ctaBtn}>📋 Texto completo Ley 1122</a>
              <a href="/docs/Normativa/decreto-489-2024" style={styles.ctaBtnOutline}>📜 Decreto 489 de 2024</a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
