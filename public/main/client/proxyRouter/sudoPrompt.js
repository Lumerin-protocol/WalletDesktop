const sudo = require("@vscode/sudo-prompt");

const options = {
  name: "Proxy Router",
};

const sudo = async (command) => {
  return await new Promise((resolve, reject) => {
    sudo.exec(command, options, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

module.exports = { sudo };
