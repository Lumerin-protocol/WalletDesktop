const { spawn } = require("child_process");

const logger = require("../../logger.js");

const PROXY_ROUTER_MODE = {
  Buyer: "buyer",
  Seller: "seller",
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

    const ls = spawn(`${resourcePath}/executables/proxy-router`, [
      `--contract-address=${config.cloneFactoryAddress}`,
      `--eth-node-address=${config.wsApiUrl}`,
      "--miner-vetting-duration=5m",
      "--pool-conn-timeout=15m",
      "--pool-max-duration=7m",
      "--pool-min-duration=2m",
      "--proxy-log-stratum=false",
      "--stratum-socket-buffer=4",
      "--validation-buffer-period=10m",
      "--miner-submit-err-limit=0",
      `--wallet-address=${config.walletAddress}`,
      `--wallet-private-key=${config.privateKey}`,
      "--log-level=debug",
      ...modes[mode],
    ]);

MINER_SUBMIT_ERR_LIMIT=0


    ls.stdout.on("data", (data) => {
      logger.debug(`ProxyRouter-${mode} stdout: ${data}`);
    });

    ls.stderr.on("data", (data) => {
      logger.debug(`ProxyRouter-${mode} stderr: ${data}`);
    });

    ls.on("close", (code) => {
      logger.debug(
        `ProxyRouter-${mode} child process exited with code ${code}`
      );
    });

    process.on("exit", () => {
      ls.kill();
    });
    return ls;
  } catch (err) {
    logger.debug(`ProxyRouter-${mode} run error: ${err}`);
    throw err;
  }
};

module.exports = { runProxyRouter, PROXY_ROUTER_MODE };
