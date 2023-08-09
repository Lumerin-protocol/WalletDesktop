const { getProxyRouterEnvs, PROXY_ROUTER_MODE } = require("../config");
const { sudo } = require("../sudoPrompt");

const getInstallNssmServiceCommand = (pathToExecutable) => {
    return `powershell -command "Expand-Archive -LiteralPath ${pathToExecutable}/nssm.zip -DestinationPath ${pathToExecutable}/nssm"`;
}

const getInstallServiceCommand = (serviceName, pathToExecutable) => {
  pathToExecutable = pathToExecutable.replaceAll(" ", "\\ ");

  const commands = [
    `${pathToExecutable}\\nssm\\nssm-2.24\\win64\\nssm.exe install ${serviceName} ${pathToExecutable}/proxy-router.exe`,
    `${pathToExecutable}\\nssm\\nssm-2.24\\win64\\nssm.exe set ${serviceName} AppStdout ${pathToExecutable}/${serviceName}.log`,
    `${pathToExecutable}\\nssm\\nssm-2.24\\win64\\nssm.exe set ${serviceName} AppStderr ${pathToExecutable}/${serviceName}-err.log`,
  ];

  return commands.join(" ; ");
};

const getEnvsFromConfig = (config, mode) => {
  return getProxyRouterEnvs(config, mode)
    .map((e) => `${e[0]}=${e[1]}`)
    .join(" ");
};

const getCommandToSetEnv = (serviceName, envs, resourcePath) => {
  return `${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe set ${serviceName} AppEnvironmentExtra ${envs} ; ${resourcePath}\\nssm\\nssm-2.24\\win64\\nssm.exe restart ${serviceName}`;
};

const runWindowsServices = async (resourcePath, config) => {
  const pathToExecutables = `${resourcePath}/executables`;
  const sellerServiceName = 'proxySeller';
  const buyerServiceName = 'proxyBuyer';

  const installSellerCommand = await getInstallServiceCommand(
    sellerServiceName,
    pathToExecutables,
    resourcePath
  );
  const installBuyerCommand = await getInstallServiceCommand(
    buyerServiceName,
    pathToExecutables,
    resourcePath
  );

  const sellerRunCommand = await getCommandToSetEnv(
    sellerServiceName,
    getEnvsFromConfig(config, PROXY_ROUTER_MODE.Seller),
    pathToExecutables
  );
  const buyerRunCommand = await getCommandToSetEnv(
    buyerServiceName,
    getEnvsFromConfig(config, PROXY_ROUTER_MODE.Buyer),
    pathToExecutables
  );

  const commands = [
    getInstallNssmServiceCommand(pathToExecutables),
    installSellerCommand,
    installBuyerCommand,
    sellerRunCommand,
    buyerRunCommand,
  ];

  await sudo(commands.join(" ; "));
};

module.exports = { runWindowsServices };

