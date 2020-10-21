export class ConfigurationRegistry {
  private static instance: ConfigurationRegistry;

  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.SCHEMA + '://' + process.env.DOMAIN_NAME;

    if (process.env.PORT !== '80') {
      this.baseUrl += (':' + process.env.PORT);
    }
  }

  public static getInstance(): ConfigurationRegistry {
    if (!this.instance) {
      this.instance = new ConfigurationRegistry();
    }

    return this.instance;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}
