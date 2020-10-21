import { ConfigurationRegistry } from '../config/configuration-registry';

export function siteUrl(path: string): string {
  return ConfigurationRegistry.getInstance().getBaseUrl() + path;
}
