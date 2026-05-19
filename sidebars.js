// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  modulosSidebar: [
    { type: 'doc', id: 'modulos/index', label: '📋 Resumen de Módulos' },
    {
      type: 'category',
      label: '⚙️ Alistamiento',
      items: ['modulos/alistamiento'],
    },
    {
      type: 'category',
      label: '✅ Validación',
      items: ['modulos/validacion'],
    },
    { type: 'doc', id: 'modulos/pre-liquidacion', label: '📋 Pre-Liquidación' },
    { type: 'doc', id: 'modulos/postulacion', label: '📬 Postulación' },
    { type: 'doc', id: 'modulos/liquidacion', label: '💰 Liquidación' },
    { type: 'doc', id: 'modulos/reps', label: '🏥 REPS' },
    { type: 'doc', id: 'modulos/auth', label: '🔐 AUTH' },
    { type: 'doc', id: 'modulos/reportes', label: '📊 Reportes' },
    { type: 'doc', id: 'modulos/ofas', label: '🏛️ OFAS' },
  ],
  normativaSidebar: [
    { type: 'doc', id: 'Normativa/index', label: '⚖️ Marco Normativo' },
    { type: 'doc', id: 'Normativa/ley-1122-2007', label: '📋 Ley 1122 de 2007' },
    { type: 'doc', id: 'Normativa/decreto-489-2024', label: '📜 Decreto 489 de 2024' },
  ],
  apisSidebar: [
    { type: 'doc', id: 'apis/apis-index', label: '🔌 Catálogo de APIs' },
    { type: 'doc', id: 'apis/api-alistamiento', label: '⚙️ API Alistamiento' },
    { type: 'doc', id: 'apis/api-validacion', label: '✅ API Validación' },
    { type: 'doc', id: 'apis/api-postulacion', label: '📬 API Postulación' },
    { type: 'doc', id: 'apis/api-liquidacion', label: '💰 API Liquidación' },
    { type: 'doc', id: 'apis/api-pagos', label: '🏦 API Pagos / ERP' },
  ],
  guiasSidebar: [
    { type: 'doc', id: 'guias/nuevo-crud', label: '🔧 Nuevo CRUD paso a paso' },
  ],
  arquitecturaSidebar: [
    { type: 'doc', id: 'arquitectura/resumen', label: '📄 Resumen Ejecutivo' },
    { type: 'doc', id: 'arquitectura/flujo', label: '🔄 Flujo del Proceso' },
    { type: 'doc', id: 'arquitectura/stack', label: '🛠️ Stack Tecnológico' },
    { type: 'doc', id: 'arquitectura/integraciones', label: '🔗 Integraciones' },
    { type: 'doc', id: 'arquitectura/infraestructura', label: '🏗️ Infraestructura' },
    { type: 'doc', id: 'arquitectura/tobe', label: '🚀 Arquitectura TOBE' },
  ],
};

module.exports = sidebars;
