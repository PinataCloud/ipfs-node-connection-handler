const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
})

const nodesToConnectTo = require('./nodes.json');

async function checkPeerConnections() {
    ipfs.swarm.peers().then(async (result) => {
        const peerList = {};
        //we're going to add all of these to a list to compare against the nodes we want to be connected to.
        result.forEach((peer) => {
            peerList[peer.peer._idB58String] = true
        });

        for(const node of nodesToConnectTo) {
            if(peerList[node.peerId] !== true) {
                //the node isn't connected to this node, so we need to swarm connect to it

                try {

                    //attempt to connect to the node
                    const success = await ipfs.swarm.connect(node.nodeMultiAddress);
                    console.log(success);
                } catch(err) {
                    //we don't need to do anything though as this is to be expected in some situations
                }

            }
        }


    }).catch((err) => {
        console.log(err)
    });
}

checkPeerConnections();


setInterval(function() {
checkPeerConnections();
}, 600000);
