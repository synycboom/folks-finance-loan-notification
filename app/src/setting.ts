const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    throw new Error(`[requireEnv]: ${name} is not set`);
  }
  return env;
};

const setting = {
  ALGO_CLIENT: requireEnv("REACT_APP_ALGO_CLIENT"),
  SERVER_URL: requireEnv("REACT_APP_SERVER_URL"),
  INDEXER_CLIENT: requireEnv("REACT_APP_INDEXER_CLIENT"),
};

export default setting;
