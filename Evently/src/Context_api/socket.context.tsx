import React, { createContext, ReactNode, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import PeerService from "../Web-rtc/peer";
const socket = io('http://localhost:8000');


interface SocketContextType {

  socket: Socket | undefined;
  localStream: MediaStream | null;
  remoteStream: MediaStream | undefined;
  host: any;
  hostpresent : any ;

  sethostName: (host: any) => void;
  handleroom: (mail: any, room_id: string) => void;
  end_call : () => void ;
  sendStreams: () => void;
  handleCallUser: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

  const navigate = useNavigate()

  const [socketid, setSocketid] = useState<string>();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [hostpresent, sethostpresent] = useState<boolean>(false)
  const [host, setHost] = useState<string>("")




  const setSocket_id = (id: any) => {
    setSocketid(id)
  }

  const sethostName = (host: any) => {
    socket.emit('hostpresent' , hostpresent)
    setHost(host)
  }

  const sethostpresent_to_ture = () =>{
    sethostpresent(true)
  }

  // ********************************************** Set Room and Start Call *************************************************************

  const handleroom = useCallback(
    (mail: any, room_id: any) => {
      const room = room_id.replace('http://localhost:5173/', '');
      console.log("Mail in handleroom", mail);

      socket.emit("room:join", mail, room);
    },
    [socket]
  );

  const handleJoinRoom = useCallback(
    (_mail: any, room: any) => {
      navigate(`/${room}`);
    },
    [navigate]
  );


  const handleUserJoined = useCallback(({ mail, socketId }: { mail: any; socketId: any }) => {
    console.log(`Email ${mail} , socketID : ${socketId} joined room`);
    setRemoteSocketId(socketId);
  }, []);

  // *********************************************************************************************************************

  const handleCallUser = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream)

    const offer = await PeerService.getOffer();
    console.log(`offer sdp: ${offer.sdp}, socketId : ${socketid}`);
    socket.emit("user_calling", { user: remoteSocketId, offer });
  };

  // ******************************************** Incomming Call **************************************************************


  const handleIncomingCall = async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
    try {
      console.log("Handle Incomming call triggered : ", from, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      console.log(`Incoming Call`, from, offer);

      const ans = await PeerService.getAnswer(offer);
      socket?.emit("call:accepted_res", { to: from, ans });
      console.log("Call Ans Send : ", ans);

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // *************************************************** After Call Accept ***************************************************************
  const sendStreams = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);

    for (const track of stream?.getTracks() || []) {
      PeerService.peer.addTrack(track, stream);
      console.log("send streams called");
    }
  }, [localStream]);


  const handleCallAccepted = useCallback(async ({ from, ans }: { from: string; ans: RTCSessionDescriptionInit }) => {
    await PeerService.setLocalDescription(ans);
    console.log("Call Accepted! from : ", from);

    socket.emit("eventcomplete");
    sendStreams();

  }, [sendStreams])


  //  *****************************************************  End Call ********************************************************
  const end_call = () => {
    window.location.href = '/'
    if (PeerService.peer.RTCPeerConnection) {
      const pc = PeerService.peer.RTCPeerConnection;
  
      if (pc.connectionState !== 'closed') {
        const senders: RTCRtpSender[] = pc.getSenders();
  
        senders.forEach((sender: RTCRtpSender) => {
          const track = sender.track;
          if (track) {
            track.stop();
          }
        });
  
        setLocalStream(null);
  
        senders.forEach((sender: RTCRtpSender) => {
          pc.removeTrack(sender);
        });
  
        console.log("Tracks removed successfully");
  
        pc.close();
        console.log("Peer connection closed");
      }
  
      navigate('/home');
    }
  };
  
  


  // ****************************************************** Negotiation Handler *********************************************************

  const handleNegoNeeded = useCallback(async() => {

      const offer = await PeerService.getOffer();
      console.log("HandleNegoNeeded Triggered");
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });

  },[])

  const handleNegoNeedIncoming = useCallback (async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      const ans = await PeerService.getAnswer(offer);
      console.log("handleNegoNeedIncoming Triggered");
      socket.emit("peer:nego:done", { to: from, ans });
      sendStreams()
    },[
    ])


  async function handleNegoNeedFinal({ ans }: { ans: RTCSessionDescriptionInit }) {
    try {
      console.log("handleNegoNeedFinal Triggered ");

      await PeerService.setLocalDescription(ans).then(()=>{
        socket.emit("eventcomplete");
      })

    } catch (error) {
      console.log("The error in Final Nego ", error);
    }
  };

  useEffect(() => {
    PeerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    // console.log("UseEffect of negotiationneed triggered ");

    return () => {
      PeerService.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      // console.log("Negotiation need removed event ");
    };
  }, [handleNegoNeeded]);


  useEffect(() => {

    PeerService.peer.addEventListener("track", async (ev: any) => {
      const [remoteStream] = await ev.streams;
      console.log("Tracks Incomming !!", remoteStream);
      setRemoteStream(remoteStream);
    });

  }, [sendStreams]);


  // ******************************** Socket Calls **************************************

  useEffect(() => {


    socket.on("getUsers", setSocket_id);
    socket.on("room:join", handleJoinRoom);
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("Finall_Call", sendStreams);
    socket.on("hostpresent", sethostpresent_to_ture);

    return () => {

      socket.off("getUsers", setSocket_id);
      socket.off("user:joined", handleUserJoined);
      socket.off("room:join", handleJoinRoom);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("Finall_Call", sendStreams);
      socket.off("hostpresent", sethostpresent_to_ture);

    };
  }, [
    socket,
    setSocket_id,
    handleJoinRoom,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
    sendStreams,
    sethostpresent_to_ture
  ]);


  const contextValue: SocketContextType = {
    socket,
    localStream,
    remoteStream,
    host,
    hostpresent,
    end_call,
    sethostName,
    sendStreams,
    handleroom,
    handleCallUser,

  };


  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
export default SocketContext;