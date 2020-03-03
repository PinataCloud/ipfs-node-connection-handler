# ipfs-node-connection-handler
Script that can be utilized to keep your IPFS nodes connected to other desired nodes.

* The tool is built to handle situations where the node's public IDs always stay the same. However, IP addresses are not required to stay the same for this tool to work (such as kubernetes setups where IP addresses frequently change).

* In order to work correctly, this tool must be run on **ALL** nodes that need to stay connected. In other words, this tool will **NOT WORK** for keeping a node connected to a major public IPFS node

---

### Instructions

1) Clone this repo onto each machine running an IPFS node that you're wishing to connect to other nodes by typing the following: `wget https://github.com/PinataCloud/ipfs-node-connection-handler/archive/master.tar.gz`

2) unzip the folder with `tar xvzf master.tar.gz`

3) Make sure you have node installed on the machine and run `npm install` in the root directory

##### (if you don't have node installed do the following)

    - type curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    - type sudo apt install nodejs

4) Modify the nodes.json file so that it contains the array of ipfs node IDs that you need to keep the machine's IPFS node connected to

5) Start running the `connectionHandler.js` script using whatever background process you prefer. Instructions for using PM2 can be found below

#### PM2 Instructions

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is an easy tool you can use to keep node processes running in the background of a server. 

To use PM2 to keep this process running in the background, take the following steps:
1) type `sudo npm install pm2@latest -g`

2) `cd` into the root directory of this tool and type `pm2 start connectionHandler.js --name Connection-Handler`

3) type `pm2 startup upstart` to make sure that this runs on system reboot (you may need to tweak this depending on your server's operating system type.

4) run the sudo command that was output by this command

5) type `pm2 save` to save the process list
