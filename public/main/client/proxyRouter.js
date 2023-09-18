const { app } = require("electron");
const fs = require("fs");
const { spawn } = require("child_process");

const logger = require("../../logger.js");

const openLogFile = (name, retry = true) => {
  try {
    const path = `${app.getPath("logs")}/${name}.log`;

    logger.debug(`Writing logs to ${path}`);
    if (fs.existsSync(path)) {
      const stats = fs.statSync(path);
      const fileSizeInBytes = stats.size;

      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      if (fileSizeInMegabytes > 10) {
        fs.unlinkSync(path);
      }
    }
    return fs.openSync(path, "a");
  } catch {
    if (retry) {
      return openLogFile(`${name}(1)`, false);
    }
    return undefined;
  }
};

const isProxyRouterHealthy = async (api, url) => {
  try {
    const healthCheck = await api["proxy-router"].healthCheck(url);
    return healthCheck?.data?.status === "healthy";
  } catch (err) {
    logger.error(err);
    return false;
  }
};

const runProxyRouter = (config) => {
  try {
    const resourcePath =
      process.env.NODE_ENV === "production"
        ? process.resourcesPath // Prod Mode
        : `${__dirname}/../../..`; // Dev Mode

    const out = openLogFile(`proxy-out`);
    const err = openLogFile(`proxy-err`);

    const ls = spawn(
      `${resourcePath}/executables/proxy-router`,
      [
        `--contract-address=${config.cloneFactoryAddress}`,
        `--eth-node-address=${config.wsApiUrl}`,

        "--miner-vetting-duration=5m",
        "--miner-share-timeout=10m",

        "--hashrate-error-threshold=0.05",
        "--hashrate-cycle-duration=5m",
        "--hashrate-share-timeout=4m",
        "--hashrate-validation-start-timeout=10m",

        "--log-level-app=info",
        "--log-level-scheduler=info",
        "--log-level-proxy=info",
        "--log-level-connection=info",

        `--wallet-private-key=${config.privateKey}`,
        `--proxy-address=0.0.0.0:${config.proxyPort}`,
        `--web-address=0.0.0.0:${config.proxyWebPort}`,
        `--pool-address=${config.sellerDefaultPool}`,
      ],
      {
        detached: true,
        stdio: ["ignore", out, err],
      }
    );

    ls.unref();
    return;
  } catch (err) {
    logger.debug(`ProxyRouter run error: ${err}`);
    throw err;
  }
};

module.exports = { runProxyRouter, isProxyRouterHealthy };
