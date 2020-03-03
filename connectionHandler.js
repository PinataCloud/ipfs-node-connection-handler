const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');

const nodesToConnectTo = require('./nodes.json');
const timeoutConstant = '60s';

async function checkPeerConnecions() {
    ipfs.swarm.peers().then(async (result) => {
        const peerList = {};

        //we're going to add all of these to a list to compare against the nodes we want to be connected to.
        result.forEach((peer) => {
            peerList[peer.peer] = true
        });

        for(const nodeId of nodesToConnectTo) {
            if(peerList[nodeId] !== true) {
                //the node isn't connected to this node, so we need to swarm connect to it
                //first check and make sure the additional connection info is right

                const peerFound = await ipfs.dht.findPeer(nodeId, { timeout: timeoutConstant });
                const addressPrefixes = [];
                peerFound.addrs.forEach((address) => {
                    //convert the address buffer to a string
                    const addressString = address.toString();

                    //Filter out both local ipv4 and local ipv6 addresses as these are useless to us
                    if(!addressString.includes('127.0.0.1') && !addressString.includes('::1')) {
                        //add the address to our array for potential connecting
                        addressPrefixes.push(addressString);
                    }
                });

                //loop through the potential address prefixes and see if we can connect to the desired node
                for (const prefix of addressPrefixes) {
                    try {
                        //we need to combine the prefix with the nodeId to get the full node's multiaddress, which is used for swarm connecting
                        const fullMultiAddress = `${prefix}/ipfs/${nodeId}`

                        //attempt to connect to this version of the node
                        await ipfs.swarm.connect(fullMultiAddress);
                    } catch(err) {
                        //there was an error connecting to this version of the multiaddress
                        //we don't need to do anything though as this is to be expected in some situations
                    }

                }
            }
        }


    }).catch((err) => {
        throw err
    });
}

checkPeerConnecions();

setInterval(function() {
    checkPeerConnecions()
}, 60000);
