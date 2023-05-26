const linuxInstallScript = `
[Unit]
Description={serviceName}
ConditionPathExists={workingDir}
After=network.target

[Service]
Type=simple
User=dev
Group=dev

WorkingDirectory={workingDir}
ExecStart={pathToExecutable}
Restart=on-failure
RestartSec=10

StandardOutput=append:{workingDir}/{serviceName}.log
StandardError=append:{workingDir}/{serviceName}-err.log

[Install]
WantedBy=multi-user.target
`;

module.exports = { linuxInstallScript };