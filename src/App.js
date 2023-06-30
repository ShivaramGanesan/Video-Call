import logo from './logo.svg';
import {render} from "react-dom";
import ReactDOM from 'react-dom/client';
import { createMeeting } from './Video-API';
import './App.css';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
// import { Participant } from '@videosdk.live/react-sdk/dist/types/participant';

function ParticipantView(props){
  const micRef = useRef(null);
  const {webcamStream, micStream, webcamOn, micOn, isLocal, displayName} = useParticipant(props.participantId)
  const videoStream = useMemo(() => {
    if(webcamOn && webcamStream){
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);
  useEffect(() => {
    if(micRef.current){
      if(micOn && micStream){
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((error)=>{
          console.log("error streaming mic track", error);
        })
      }
      else{
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);
  
  return (
    <div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal}/>
      {webcamOn && (
        <ReactPlayer
          playsinline
          pip = {false}
          light = {false}
          controls = {false}
          muted = {true}
          playing = {true}
          url = {videoStream}
          height={"300px"}
          width = {"300px"}
          onError = {(err) => {
            console.log(err, "participant video err");
          }}
        />
      )}
    </div>
  )

}

function MeetingView(){
  const [joined, setJoined] = useState(null);
  const {join, participants} = useMeeting({
    onMeetingJoined: () =>{
      setJoined("JOINED")
    }
  });
  const joinMeeting = () =>{
    setJoined("JOINING");
    join();
  };
  return (
    <div className="container">
      {joined == "JOINED" ? (
        <div>
          {[...participants.keys()].map((participantId) => (
            <ParticipantView participantId={participantId} key = {participantId}>
            </ParticipantView>
          ))}
        </div>
      ) : joined == "JOINING" ? (<p>Joining the meeting</p>) : (<button onClick={joinMeeting}>Join the meeting</button>)
      }
    </div>
  );
}



function createNewMeeting(){
  const token = ""
  createMeeting(token).then(function(meetingId){
    console.log("Meeting ID: "+meetingId);
    const meetingSpace = ReactDOM.createRoot(document.getElementById("meeting_space"));
    meetingSpace.render(<MeetingProvider config={{
      meetingId: meetingId,
      micEnabled:true,
      webcamEnabled: true,
      name: "Test name"
    }}
    token = {token}>
      <MeetingView></MeetingView>
    </MeetingProvider>)
  })
}

function App() {
  
  // createMeeting(token).then(function(meetingId){
  //   console.log(meetingId)
  //   console.log("meeting created")
  //   return (
      // <MeetingProvider config={{
      //   meetingId: meetingId,
      //   micEnabled:true,
      //   webcamEnabled: true,
      //   name: "Test name"
      // }}
      // token = {token}>
      //   <MeetingView></MeetingView>
      // </MeetingProvider>
  //   )
  // })
  return (<div>
    <input placeholder='Meeting ID'></input>
    <button>Join Meeting</button>
    <button onClick={createNewMeeting}>Create Meeting</button>
    <div id='meeting_space'></div>
  </div>)
  
}

export default App;
