import { getPluginConfig, registerPlugin } from '@scullyio/scully';

declare var process;
declare var require;

/**
 * Gtag configuration
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs
 */
export interface GoogleAnalyticsGtagConfig {
  anonymize_ip?: boolean;
  optimize_id?: string;

  [key: string]: any;
}

/**
 * Plugin specific configuration
 */
export interface GoogleAnalyticsPluginConfig {
  respectDNT?: boolean;
  exclude?: string[];
}

/**
 * Plugin configuration
 */
export interface GoogleAnalyticsConfig {
  trackingIds: string[];
  dryRun?: boolean;
  gtagConfig: GoogleAnalyticsGtagConfig;
  pluginConfig: GoogleAnalyticsPluginConfig;
}

const GaPlugin = 'gaPlugin';

/**
 * Based on Gatsby official Gtag plugin
 * @link https://www.gatsbyjs.org/packages/gatsby-plugin-google-gtag/
 */
function gaPluginHandler(html: string) {
  const {
    dryRun = false,
    trackingIds,
    gtagConfig = {},
    pluginConfig = {},
  } = getPluginConfig<GoogleAnalyticsConfig>(GaPlugin);
  if (!dryRun && process.env.NODE_ENV !== 'production') {
    return Promise.resolve(html);
  }

  // Lighthouse recommends pre-connecting to google analytics
  html = html.replace(
    '<head>',
    `
<head><link
  rel="preconnect dns-prefetch"
  key="preconnect-google-analytics"
  href="https://www.google-analytics.com"
/>
  `
  );

  // Prevent duplicate or excluded pageview events being emitted on initial load of page by the `config` command
  // https://developers.google.com/analytics/devguides/collection/gtagjs/#disable_pageview_tracking
  gtagConfig.send_page_view = false;

  const firstTrackingId =
    trackingIds != null && trackingIds.length ? trackingIds[0] : ``;

  const excludeGtagPaths = [];
  if (pluginConfig.exclude != null) {
    const Minimatch = require(`minimatch`).Minimatch;
    for (let i = 0; i < pluginConfig.exclude.length; i++) {
      const excludeMm = new Minimatch(pluginConfig.exclude[i]);
      excludeGtagPaths.push(excludeMm.makeRe());
    }
  }

  const renderScriptContent = () => {
    return `
${
  excludeGtagPaths.length
    ? `window.excludeGtagPaths=[${excludeGtagPaths.join(`,`)}];`
    : ``
}
${
  typeof gtagConfig.anonymizeIp != null && gtagConfig.anonymizeIp === true
    ? `function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/',window[disableStr]=!0}var gaProperty='${firstTrackingId}',disableStr='ga-disable-'+gaProperty;document.cookie.indexOf(disableStr+'=true')>-1&&(window[disableStr]=!0);`
    : ``
}
if(${
      pluginConfig.respectDNT
        ? `!(navigator.doNotTrack == "1" || window.doNotTrack == "1")`
        : `true`
    }) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer && window.dataLayer.push(arguments);}
  gtag('js', new Date());
  ${trackingIds
    .map(
      (trackingId) =>
        `gtag('config', '${trackingId}', ${JSON.stringify(gtagConfig)});`
    )
    .join(``)}
}
`;
  };

  return Promise.resolve(
    html.replace(
      '<head>',
      `
<head><script
  key={'scully-plugin-google-analytics'}
  async
  src={'https://www.googletagmanager.com/gtag/js?id=${firstTrackingId}'}
/>
<script id="scully-plugin-google-analytics">${renderScriptContent()}</script>
  `
    )
  );
}

const validator = (config: GoogleAnalyticsConfig) => {
  if (config.trackingIds == null || !config.trackingIds.length) {
    return [
      `
      GoogleAnalyticsConfig.trackingIds cannot be empty. Please use setPluginConfig to provide at least one of the trackingIds.
    `,
    ];
  }
  return false;
};

registerPlugin('render', GaPlugin, gaPluginHandler, validator);

export function getGaPlugin() {
  return GaPlugin;
}
