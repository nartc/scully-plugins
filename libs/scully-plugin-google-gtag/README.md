# scully-plugin-google-gtag

This is a `postRenderer` plugin that will append necessary `script` tags to initialize `gtag.js` to the Scully's pre-rendered pages' `<head>` tag.

### Installation

To install this plugin, run:

```shell
npm install -D @nartc/scully-plugin-google-gtag
```

### Usage

```typescript
import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import {
  getGaPlugin,
  GoogleAnalyticsConfig,
} from '@nartc/scully-plugin-google-gtag';

const GaPlugin = getGaPlugin();
setPluginConfig(GaPlugin, <GoogleAnalyticsConfig>{
  dryRun: true, // set dryRun to true to enable Gtag in develop mode
  trackingIds: ['YOUR_TRACKING_ID'],
});

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'scully-project',
  outDir: './dist/static',
  defaultPostRenderers: [GaPlugin],
  routes: {
    '/blog/:slug': {
      type: RouteTypes.contentFolder,
      slug: {
        folder: './blog',
      },
      postRenderers: [GaPlugin],
    },
  },
};
```

### Configuration

`scully-plugin-google-tag` exposes `GoogleAnalyticsConfig` interface to help you providing the configuration for the plugin and for `gtag`

##### GoogleAnalyticsConfig

| name           | type                          | required | description                                                                                       |
| -------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `dryRun`       | `boolean`                     | -        | Set this flag to `true` if you want to test `gtag` in development environment. Default to `false` |
| `trackingIds`  | `string[]`                    | yes      | List of all tracking IDs that you want `gtag` to track                                            |
| `gtagConfig`   | `GoogleAnalyticsGtagConfig`   | -        | Gtag specific configuration                                                                       |
| `pluginConfig` | `GoogleAnalyticsPluginConfig` | -        | Plugin specific configuration                                                                     |

##### GoogleAnalyticsGtagConfig

| name            | type      | required | description                                                      |
| --------------- | --------- | -------- | ---------------------------------------------------------------- |
| `anonymize_ip`  | `boolean` | -        | To set `anonymize_ip` for `gtag`                                 |
| `optimize_id`   | `string`  | -        | To set `optimize_id` for `gtag`                                  |
| `[key: string]` | `any`     | -        | Any other configuration parameters that `gtag('config')` accepts |

##### GoogleAnalyticsPluginConfig

| name         | type       | required | description                                    |
| ------------ | ---------- | -------- | ---------------------------------------------- |
| `respectDNT` | `boolean`  | -        | Respect DO_NOT_TRACK                           |
| `exclude`    | `string[]` | -        | List of excluded paths that `gtag` will ignore |

### Questions or Issues

Feel free to open an issue

### Contribution

Contribution of any kinds is greatly appreciated
