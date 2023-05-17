const macosInstallScript = `
<?xml version=‘1.0’ encoding=‘UTF-8’?>
<!DOCTYPE plist PUBLIC \“-//Apple Computer//DTD PLIST 1.0//EN\” \”http://www.apple.com/DTDs/PropertyList-1.0.dtd\” >
<plist version=‘1.0’>
<dict>
<key>Label</key><string>{serviceName}</string>
<key>ProgramArguments</key>
<array>
<string>/bin/zsh</string>
<string>-c</string>
<string>CLONE_FACTORY_ADDRESS=$CLONE_FACTORY_ADDRESS ETH_NODE_ADDRESS=$ETH_NODE_ADDRESS HASHRATE_DIFF_THRESHOLD=$HASHRATE_DIFF_THRESHOLD MINER_VETTING_DURATION=$MINER_VETTING_DURATION POOL_CONN_TIMEOUT=$POOL_CONN_TIMEOUT POOL_MAX_DURATION=$POOL_MAX_DURATION POOL_MIN_DURATION=$POOL_MIN_DURATION STRATUM_SOCKET_BUFFER_SIZE=$STRATUM_SOCKET_BUFFER_SIZE VALIDATION_BUFFER_PERIOD=$VALIDATION_BUFFER_PERIOD WALLET_ADDRESS=$WALLET_ADDRESS WALLET_PRIVATE_KEY=$WALLET_PRIVATE_KEY  LOG_LEVEL=$LOG_LEVEL PROXY_ADDRESS=$PROXY_ADDRESS WEB_ADDRESS=$WEB_ADDRESS POOL_ADDRESS=$POOL_ADDRESS IS_BUYER=$IS_BUYER {pathToExecutable}</string>
</array>
<key>WorkingDirectory</key><string>{workingDir}</string>
<key>StandardOutPath</key><string>{logFilePath}</string>
<key>KeepAlive</key><true/>
<key>Disabled</key><false/>
</dict>
</plist>
`;

module.exports = { macosInstallScript };