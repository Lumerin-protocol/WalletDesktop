const linuxInstallScript = `
[Unit]
Description={serviceName}
After=network.target

[Service]
Type=simple
ExecStart="{pathToExecutable}"
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
`;

module.exports = { linuxInstallScript };