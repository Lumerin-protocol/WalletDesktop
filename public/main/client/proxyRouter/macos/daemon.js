const { macosInstallScript } = require("./installScript");
const { getProxyRouterEnvs, PROXY_ROUTER_MODE } = require("../config");
const { sudo } = require("../sudoPrompt");

const getInstallMacosDaemonCommand = async (daemonName, pathToExecutable) => {
  pathToExecutable = pathToExecutable.replaceAll(' ', '\\ ')
  const config = macosInstallScript
    .replace("{serviceName}", daemonName)
    .replace("{pathToExecutable}", `${pathToExecutable}/proxy-router`)
    .replace("{workingDir}", pathToExecutable)
    .replace("{logFilePath}", `${pathToExecutable}/${daemonName}.log`);

  const path = `/Library/LaunchDaemons/${daemonName}.plist`;
  return `touch ${path} && echo '${config}' > ${path}`;
};

const getMacosDaemonPath = (daemonName) => {
  const path = `/Library/LaunchDaemons/${daemonName}.plist`;
  return path;
};

const getCommandToRunDaemon = async (pathToDaemon, envs) => {
  const setEnvsCommand = envs
    .map((e) => `sudo launchctl setenv ${e[0]} ${e[1]}`)
    .join(";");
  return `sudo launchctl unload ${pathToDaemon}; ${setEnvsCommand}; sudo launchctl load ${pathToDaemon}`;
};

const runMacosDaemons = async (resourcePath, config) => {
  const sellerServiceName = "com.proxy.router.seller";
  const buyerServiceName = "com.proxy.router.buyer";

  const installSellerCommand = await getInstallMacosDaemonCommand(
    sellerServiceName,
    `${resourcePath}/executables`
  );
  const installBuyerCommand = await getInstallMacosDaemonCommand(
    buyerServiceName,
    `${resourcePath}/executables`
  );

  const sellerRunCommand = await getCommandToRunDaemon(
    getMacosDaemonPath(sellerServiceName),
    getProxyRouterEnvs(config, PROXY_ROUTER_MODE.Seller)
  );
  const buyerRunCommand = await getCommandToRunDaemon(
    getMacosDaemonPath(buyerServiceName),
    getProxyRouterEnvs(config, PROXY_ROUTER_MODE.Buyer)
  );

  const commands = [
    installSellerCommand,
    installBuyerCommand,
    sellerRunCommand,
    buyerRunCommand,
  ];

  await sudo(commands.join(";"));
};

module.exports = {
  runMacosDaemons,
};
