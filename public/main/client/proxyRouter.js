const { spawn } = require("child_process");

const logger = require("../../logger.js");

const PROXY_ROUTER_MODE = {
  Buyer: "buyer",
  Seller: "seller",
};

const MODE_TO_PORTS = {
  [PROXY_ROUTER_MODE.Buyer]: [
    "--proxy-address=0.0.0.0:3334",
    `--web-address=0.0.0.0:8082`,
  ],
  [PROXY_ROUTER_MODE.Seller]: [
    "--proxy-address=0.0.0.0:3333",
    `--web-address=0.0.0.0:8081`,
  ],
};

const runProxyRouter = (config, mode = PROXY_ROUTER_MODE.Seller) => {
  try {
    const resourcePath =
      process.env.NODE_ENV === "production"
        ? process.resourcesPath // Prod Mode
        : `${__dirname}/../../..`; // Dev Mode

    const ls = spawn(`${resourcePath}/executables/proxy-router`, [
      `--contract-address=${config.cloneFactoryAddress}`,
      `--eth-node-address=${config.wsApiUrl}`,
      "--hashrate-diff-threshold=0.10",
      "--is-buyer=false",
      "--miner-vetting-duration=1m",
      `--pool-address=${config.defaultPool}`,
      "--pool-conn-timeout=5m",
      "--pool-max-duration=5m",
      "--pool-min-duration=2m",
      "--proxy-log-stratum=false",
      "--stratum-socket-buffer=4",
      "--validation-buffer-period=5m",
      `--wallet-address=${config.walletAddress}`,
      `--wallet-private-key=${config.privateKey}`,
      "--log-level=debug",
      ...MODE_TO_PORTS[mode],
    ]);

    ls.stdout.on("data", (data) => {
      logger.debug(`ProxyRouter-${mode} stdout: ${data}`);
    });

    ls.stderr.on("data", (data) => {
      logger.debug(`ProxyRouter-${mode} stderr: ${data}`);
    });

    ls.on("close", (code) => {
      logger.debug(`ProxyRouter-${mode} child process exited with code ${code}`);
    });
  } catch (err) {
    logger.debug(`ProxyRouter-${mode} run error: ${err}`);
    throw err;
  }
};

module.exports = { runProxyRouter, PROXY_ROUTER_MODE };
