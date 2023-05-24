const sudo = require("@vscode/sudo-prompt");
const options = {
  name: "Proxy Router",
};

const PROXY_ROUTER_MODE = {
  Buyer: "buyer",
  Seller: "seller",
};

const getInstallNssmServiceCommand = (resourcePath) => {
    return `powershell -command "Expand-Archive -LiteralPath ${resourcePath}/nssm.zip -DestinationPath ${resourcePath}/nssm""`;
}

const getInstallServiceCommand = (serviceName, pathToExecutable, resourcePath) => {
  pathToExecutable = pathToExecutable.replaceAll(" ", "\\ ");

  const commands = [
    `${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe install ${serviceName} ${pathToExecutable}/proxy-router.exe`,
    `${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe set ${serviceName} AppStdout ${pathToExecutable}/${serviceName}.log`,
    `${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe set ${serviceName} AppStderr ${pathToExecutable}/${serviceName}-err.log`,
  ];

  return commands.join(" ; ");
};

const getEnvsFromConfig = (config, additional) => {
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
  ]
    .map((e) => `${e[0]}=${e[1]}`)
    .join(" ");
};

const getCommandToSetEnv = (serviceName, envs, resourcePath) => {
  return `${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe set ${serviceName} AppEnvironmentExtra ${envs} ; ${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe restart ${serviceName}`;
};

const runWindowsServices = async (resourcePath, config) => {
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

  const installSellerCommand = await getInstallServiceCommand(
    "proxySeller",
    `${resourcePath}/executables`,
    resourcePath
  );
  const installBuyerCommand = await getInstallServiceCommand(
    "proxyBuyer",
    `${resourcePath}/executables`,
    resourcePath
  );

  const sellerRunCommand = await getCommandToSetEnv(
    "proxySeller",
    getEnvsFromConfig(config, modes[PROXY_ROUTER_MODE.Seller]),
    resourcePath
  );
  const buyerRunCommand = await getCommandToSetEnv(
    "proxyBuyer",
    getEnvsFromConfig(config, modes[PROXY_ROUTER_MODE.Buyer]),
    resourcePath
  );

  const commands = [
    getInstallNssmServiceCommand(resourcePath),
    installSellerCommand,
    installBuyerCommand,
    sellerRunCommand,
    buyerRunCommand,
  ];
  console.log("🚀 ~ file: service.js:98 ~ runWindowsServices ~ commands:", commands.join(" ; "))

  await new Promise((resolve, reject) => {
    sudo.exec(commands.join(" ; "), options, function(error, stdout, stderr) {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

module.exports = { runWindowsServices };

