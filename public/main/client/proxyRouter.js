const { spawn } = require("child_process");

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
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { runProxyRouter };
