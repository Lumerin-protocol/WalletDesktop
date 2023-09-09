const { app } = require("electron");
const fs = require("fs");
const { spawn } = require("child_process");

const logger = require("../../logger.js");

const PROXY_ROUTER_MODE = {
  Buyer: "buyer",
  Seller: "seller",
};

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

const runProxyRouter = (config, mode = PROXY_ROUTER_MODE.Seller) => {
  const modes = {
    [PROXY_ROUTER_MODE.Buyer]: [
      `--proxy-address=0.0.0.0:${config.buyerProxyPort}`,
      `--web-address=0.0.0.0:${config.buyerWebPort}`,
      `--pool-address=${config.buyerDefaultPool}`,
      "--hashrate-diff-threshold=0.10",
      "--is-buyer=true",
    ],
    [PROXY_ROUTER_MODE.Seller]: [
      `--proxy-address=0.0.0.0:${config.sellerProxyPort}`,
      `--web-address=0.0.0.0:${config.sellerWebPort}`,
      `--pool-address=${config.sellerDefaultPool}`,
      "--hashrate-diff-threshold=0.03",
      "--is-buyer=false",
    ],
  };

  try {
    const resourcePath =
      process.env.NODE_ENV === "production"
        ? process.resourcesPath // Prod Mode
        : `${__dirname}/../../..`; // Dev Mode

    const out = openLogFile(`${mode}-out`);
    const err = openLogFile(`${mode}-err`);

    console.log('CONFIG', config);

    const ls = spawn(
      `${resourcePath}/executables/proxy-router`,
      [
        `--contract-address=${config.cloneFactoryAddress}`,
        "--contract-hashrate-adjustment=1.1",
        `--eth-node-address=${config.wsApiUrl}`,
        "--miner-vetting-duration=5m",
        "--pool-conn-timeout=15m",
        "--pool-max-duration=7m",
        "--pool-min-duration=2m",
        "--stratum-socket-buffer=4",
        "--validation-buffer-period=15m",
        "--miner-submit-err-limit=0",
        `--wallet-address=${config.walletAddress}`,
        `--wallet-private-key=${config.privateKey}`,
        "--log-level=debug",
        ...modes[mode],
      ],
      {
        detached: true,
        stdio: ["ignore", out, err],
      }
    );

    ls.unref();
    return;
  } catch (err) {
    logger.debug(`ProxyRouter-${mode} run error: ${err}`);
    throw err;
  }
};

module.exports = { runProxyRouter, PROXY_ROUTER_MODE, isProxyRouterHealthy };
