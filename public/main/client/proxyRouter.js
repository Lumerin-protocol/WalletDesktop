const { spawn } = require("child_process");

const logger = require('../../logger.js');

const runProxyRouter = (config) => {
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
      "--proxy-address=0.0.0.0:3333",
      "--proxy-log-stratum=false",
      "--stratum-socket-buffer=4",
      "--validation-buffer-period=5m",
      `--wallet-address=${config.walletAddress}`,
      `--wallet-private-key=${config.privateKey}`,
      `--web-address=0.0.0.0:8081`,
      "--log-level=debug",
    ]);

    ls.stdout.on("data", (data) => {
      logger.debug(`ProxyRouter stdout: ${data}`);
    });

    ls.stderr.on("data", (data) => {
      logger.debug(`ProxyRouter stderr: ${data}`);
    });

    ls.on("close", (code) => {
      logger.debug(`ProxyRouter child process exited with code ${code}`);
    });
  } catch (err) {
    logger.debug(`ProxyRouter run error: ${err}`);
    throw err;
  }
};

module.exports = { runProxyRouter };
