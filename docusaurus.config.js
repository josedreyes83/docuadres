// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GiroDirecto ADRES',
  tagline: 'Sistema de Pago Directo a Prestadores de Salud',
  favicon: 'img/favicon.ico',
  url: 'https://girodirecto.adres.gov.co',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'es', locales: ['es'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'GiroDirecto',
        logo: {
          alt: 'ADRES — Administradora de los Recursos del SGSSS',
          src: 'img/logo-adres-oficial.png',
        },
        items: [
          { to: '/', label: 'Inicio', position: 'left', activeBaseRegex: '^/$' },
          {
            type: 'docSidebar',
            sidebarId: 'modulosSidebar',
            position: 'left',
            label: 'Módulos',
          },
          {
            type: 'docSidebar',
            sidebarId: 'apisSidebar',
            position: 'left',
            label: 'APIs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'arquitecturaSidebar',
            position: 'left',
            label: 'Arquitectura',
          },
          {
            type: 'docSidebar',
            sidebarId: 'normativaSidebar',
            position: 'left',
            label: 'Normativa',
          },
          {
            type: 'docSidebar',
            sidebarId: 'guiasSidebar',
            position: 'left',
            label: 'Guías Dev',
          },
          { to: '/docs/glosario', label: 'Glosario', position: 'left' },
          {
            href: 'https://www.adres.gov.co',
            label: 'ADRES.gov.co',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Módulos del Sistema',
            items: [
              { label: 'Alistamiento', to: '/docs/modulos/alistamiento' },
              { label: 'Validación', to: '/docs/modulos/validacion' },
              { label: 'Postulación', to: '/docs/modulos/postulacion' },
              { label: 'Liquidación', to: '/docs/modulos/liquidacion' },
              { label: 'REPS', to: '/docs/modulos/reps' },
              { label: 'AUTH', to: '/docs/modulos/auth' },
            ],
          },
          {
            title: 'APIs',
            items: [
              { label: 'Catálogo de APIs', to: '/docs/apis' },
              { label: 'API Alistamiento', to: '/docs/apis/api-alistamiento' },
              { label: 'API Validación', to: '/docs/apis/api-validacion' },
              { label: 'API Postulación', to: '/docs/apis/api-postulacion' },
              { label: 'API Liquidación', to: '/docs/apis/api-liquidacion' },
              { label: 'API Pagos / ERP', to: '/docs/apis/api-pagos' },
            ],
          },
          {
            title: 'Arquitectura',
            items: [
              { label: 'Resumen Ejecutivo', to: '/docs/arquitectura/resumen' },
              { label: 'Flujo del Proceso', to: '/docs/arquitectura/flujo' },
              { label: 'Stack Tecnológico', to: '/docs/arquitectura/stack' },
              { label: 'Integraciones', to: '/docs/arquitectura/integraciones' },
            ],
          },
          {
            title: 'Normativa',
            items: [
              { label: 'Marco Normativo', to: '/docs/Normativa' },
              { label: 'Ley 1122 de 2007', to: '/docs/Normativa/ley-1122-2007' },
              { label: 'Decreto 489 de 2024', to: '/docs/Normativa/decreto-489-2024' },
            ],
          },
          {
            title: 'Guías de Desarrollo',
            items: [
              { label: 'Nuevo CRUD paso a paso', to: '/docs/guias/nuevo-crud' },
            ],
          },
          {
            title: 'Recursos institucionales',
            items: [
              { label: 'ADRES', href: 'https://www.adres.gov.co' },
              { label: 'MinSalud', href: 'https://www.minsalud.gov.co' },
              { label: 'SIIFA', href: 'https://www.minsalud.gov.co/SIIFA' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} ADRES — Administradora de los Recursos del Sistema General de Seguridad Social en Salud`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
      },
    }),
};

module.exports = config;
