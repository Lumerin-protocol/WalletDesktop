const { linuxInstallScript } = require("./installScript");
const sudo = require("@vscode/sudo-prompt");
const options = {
  name: "Proxy Router",
};

const PROXY_ROUTER_MODE = {
  Buyer: "buyer",
  Seller: "seller",
};

const getInstallLinuxServiceCommand = async (daemonName, pathToExecutable) => {
  pathToExecutable = pathToExecutable.replaceAll(" ", "\x20");
  const config = linuxInstallScript
    .replaceAll("{serviceName}", daemonName)
    .replaceAll("{pathToExecutable}", `${pathToExecutable}/proxy-router`)
    .replaceAll("{workingDir}", pathToExecutable);

  const path = `/etc/systemd/system/${daemonName}.service`;
  return `touch ${path} && echo '${config}' > ${path}`;
};

const getCommandWithEnv = (config, additional) => {
  return [
    ["CLONE_FACTORY_ADDRESS", `"${config.cloneFactoryAddress}"`],
    ["ETH_NODE_ADDRESS", `"${config.wsApiUrl}"`],
    ["MINER_VETTING_DURATION", "1m"],
    ["POOL_CONN_TIMEOUT", "15m"],
    ["POOL_MAX_DURATION", "7m"],
    ["POOL_MIN_DURATION", "2m"],
    ["STRATUM_SOCKET_BUFFER_SIZE", 4],
    ["VALIDATION_BUFFER_PERIOD", "10m"],
    ["WALLET_ADDRESS", `"${config.walletAddress}"`],
    ["WALLET_PRIVATE_KEY", `"${config.privateKey}"`],
    ["LOG_LEVEL", "debug"],
    ["MINER_SUBMIT_ERR_LIMIT", 0],
    ...additional,
  ];
};

const getCommandToRunDaemon = async (serviceName, envs) => {
  const setEnvsCommand = envs
    .map((e) => `sudo systemctl set-environment ${e[0]}=${e[1]}`)
    .join(";");
  return `sudo systemctl daemon-reload; ${setEnvsCommand}; sudo service ${serviceName} restart`;
};

const runLinuxDaemons = async (resourcePath, config) => {
  const modes = {
    [PROXY_ROUTER_MODE.Buyer]: [
      ["PROXY_ADDRESS", `0.0.0.0:${config.buyerProxyPort}`],
      ["WEB_ADDRESS", `0.0.0.0:${config.buyerWebPort}`],
      ["IS_BUYER", true],
      ["POOL_ADDRESS", `"${config.buyerDefaultPool}"`],
      ["HASHRATE_DIFF_THRESHOLD", 0.1],
    ],
    [PROXY_ROUTER_MODE.Seller]: [
      ["PROXY_ADDRESS", `0.0.0.0:${config.sellerProxyPort}`],
      ["WEB_ADDRESS", `0.0.0.0:${config.sellerWebPort}`],
      ["IS_BUYER", false],
      ["POOL_ADDRESS", `"${config.sellerDefaultPool}"`],
      ["HASHRATE_DIFF_THRESHOLD", 0.03],
    ],
  };

  const installSellerCommand = await getInstallLinuxServiceCommand(
    "proxyRouterSeller",
    `${resourcePath}/executables`
  );
  const installBuyerCommand = await getInstallLinuxServiceCommand(
    "proxyRouterBuyer",
    `${resourcePath}/executables`
  );

  const sellerRunCommand = await getCommandToRunDaemon(
    "proxyRouterSeller",
    getCommandWithEnv(config, modes[PROXY_ROUTER_MODE.Seller])
  );
  const buyerRunCommand = await getCommandToRunDaemon(
    "proxyRouterBuyer",
    getCommandWithEnv(config, modes[PROXY_ROUTER_MODE.Buyer])
  );

  const commands = [
    installSellerCommand,
    installBuyerCommand,
    sellerRunCommand,
    buyerRunCommand,
  ];

  await new Promise((resolve, reject) => {
    sudo.exec(commands.join(";"), options, function(error, stdout, stderr) {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

module.exports = {
  getInstallLinuxServiceCommand,
  getCommandToRunDaemon,
  getCommandWithEnv,
  runLinuxDaemons,
};
