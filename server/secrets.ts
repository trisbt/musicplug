import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "us-east-1"
});

async function fetchSecretValue(secretName: string) {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT"
      })
    );

    if (!response.SecretString) {
      throw new Error(`No secret found for ${secretName}`);
    }

    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error(`Failed to fetch secret for ${secretName}:`, error);
    throw error;
  }
}

export async function fetchSecrets() {
  try {
    const [spotifySecrets, postgresSecrets] = await Promise.all([
      fetchSecretValue('mp/spotify'),
      fetchSecretValue('mp/postgres')
    ]);

    return {
      spotify: spotifySecrets,
      postgres: postgresSecrets
    };
  } catch (error) {
    console.error('Failed to fetch secrets:', error);
    throw error;
  }
}
