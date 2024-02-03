class PeerService {
    peer: any;
    constructor() {
  
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
  
            // ss turn server 
            {
              urls:[ "stun:stun.relay.metered.ca:80" ,
              // "stun:stun.l.google.com:19302",
              // "stun:global.stun.twilio.com:3478",
              // 'stun:freestun.net:5350',
              // "stun:freeturn.net:5349"
  
            ],
            },
            // {
            //   urls: "turn:standard.relay.metered.ca:80",
            //   username: "22b236d9eac7166ce45292bc",
            //   credential: "wgKy9Vb87N2lt2f6",
            // },
            // {
            //   urls: "turn:standard.relay.metered.ca:80?transport=tcp",
            //   username: "22b236d9eac7166ce45292bc",
            //   credential: "wgKy9Vb87N2lt2f6",
            // },
            // {
            //   urls: "turn:standard.relay.metered.ca:443",
            //   username: "22b236d9eac7166ce45292bc",
            //   credential: "wgKy9Vb87N2lt2f6",
            // },
            // {
            //   urls: "turn:standard.relay.metered.ca:443?transport=tcp",
            //   username: "22b236d9eac7166ce45292bc",
            //   credential: "wgKy9Vb87N2lt2f6",
            // },
  
            // { urls: 'stun:freestun.net:5350' },
            // {urls: "stun:freeturn.net:5349"},
  
            //  { 
            //   urls: 'turns:freeturn.tel:5349', 
            //   username: 'free', 
            //   credential: 'free' 
            // } 
            // sv tun server
            // {
            //   urls: "stun:stun.relay.metered.ca:80"
            // },
            // {
            //   urls: "turn:a.relay.metered.ca:80",
            //   username: "9feb6522d3b0d94f7d4bdc53",
            //   credential: "NBrSkTE3xWZTzRlx"
            // },
            // {
            //   urls: "turn:a.relay.metered.ca:80?transport=tcp",
            //   username: "9feb6522d3b0d94f7d4bdc53",
            //   credential: "NBrSkTE3xWZTzRlx"
            // },
            // {
            //   urls: "turn:a.relay.metered.ca:443",
            //   username: "9feb6522d3b0d94f7d4bdc53",
            //   credential: "NBrSkTE3xWZTzRlx"
            // },
            // {
            //   urls: "turn:a.relay.metered.ca:443?transport=tcp",
            //   username: "9feb6522d3b0d94f7d4bdc53",
            //   credential: "NBrSkTE3xWZTzRlx"
            // }
            // {
            //   urls: "relay1.expressturn.com:3478",
            //   username: "efX3H9DD2TZXBX8KA5",
            //   credential: "ntKVrDlFSfRUrmDQ"
            // }
          ],
        });
      }
    }
  
    async getAnswer(offer: any) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        console.log("Offer created by getanser and set remote-description");
        return ans;
  
      }
    }
  
    async setLocalDescription(ans: any) {
      if (this.peer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        console.log("Remote description set");
      }
    }
  
    async getOffer() {
      if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        console.log("Offer created by getoff and set localdescription");
        
        return offer;
      }
    }
  }
  
  export default new PeerService();