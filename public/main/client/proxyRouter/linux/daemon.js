const { getProxyRouterEnvs, PROXY_ROUTER_MODE } = require("../config");
const { linuxInstallScript } = require("./installScript");
const { sudo } = require("../sudoPrompt");

const getInstallLinuxServiceCommand = async (daemonName, pathToExecutable) => {
  const config = linuxInstallScript
    .replaceAll("{serviceName}", daemonName)
    .replaceAll("{pathToExecutable}", `${pathToExecutable}/proxy-router`)

  const path = `/etc/systemd/system/${daemonName}.service`;
  return `touch ${path} && echo '${config}' > ${path}`;
};

const getCommandToRunDaemon = async (serviceName, envs) => {
  const setEnvsCommand = envs
    .map((e) => `sudo systemctl set-environment ${e[0]}=${e[1]}`)
    .join(";");
  return `sudo systemctl daemon-reload; ${setEnvsCommand}; sudo service ${serviceName} restart`;
};

const runLinuxDaemons = async (resourcePath, config) => {
  const sellerServiceName = "proxyRouterSeller";
  const buyerServiceName = "proxyRouterBuyer";
  const installSellerCommand = await getInstallLinuxServiceCommand(
    sellerServiceName,
    `${resourcePath}/executables`
  );
  const installBuyerCommand = await getInstallLinuxServiceCommand(
    buyerServiceName,
    `${resourcePath}/executables`
  );

  const sellerRunCommand = await getCommandToRunDaemon(
    sellerServiceName,
    getProxyRouterEnvs(config, PROXY_ROUTER_MODE.Seller)
  );
  const buyerRunCommand = await getCommandToRunDaemon(
    buyerServiceName,
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
  runLinuxDaemons,
};
