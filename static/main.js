window.addEventListener("load", () => {
  // initialize number of participants with local video.
  // we can have a max of six participants.
  let availableYarn = [1, 2, 3, 4, 5, 6];
  const roomName = "Superclass!";

  const joinButton = document.getElementById("join");
  joinButton.addEventListener("click", connect);

  function connect() {
    joinButton.style.visibility = "hidden";
    // fetch access token
    fetch("/token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        startVideoChat(roomName, data.token);
      });
  }

  // connect to video room
  function startVideoChat(roomName, token) {
    Twilio.Video.connect(token, {
      room: roomName,
      video: true,
      audio: false,
    }).then((room) => {
      participantConnected(room.localParticipant);
      room.participants.forEach(participantConnected);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      window.addEventListener("pagehide", tidyUp(room));
      window.addEventListener("beforeunload", tidyUp(room));
    });
  }

  // display all participants' tracks
  function participantConnected(participant) {
    findNextAvailableYarn(participant);
    participant.tracks.forEach((trackPublication) => {
      trackPublished(trackPublication, participant);
    });
    participant.on("trackPublished", trackPublished);
  }

  // attach subscribed tracks to the page
  function trackPublished(trackPublication, participant) {
    const yarn = document.getElementById(`yarn-${participant.number}`);

    function trackSubscribed(track) {
      yarn.appendChild(track.attach());
    }

    if (trackPublication.track) {
      trackSubscribed(trackPublication.track);
    }
    trackPublication.on("subscribed", trackSubscribed);
  }

  // tidy up helper functions for when a participant disconnects
  // or closes the page
  function participantDisconnected(participant) {
    participant.removeAllListeners();
    const el = document.getElementById(`yarn-${participant.number}`);
    el.innerHTML = "";
    availableYarn.push(participant.number);
  }

  function tidyUp(room) {
    return function (event) {
      if (event.persisted) {
        return;
      }
      if (room) {
        room.disconnect();
        room = null;
      }
    };
  }

  // helper to find a spot on the page to display participant video
  function findNextAvailableYarn(participant) {
    const index = Math.floor(Math.random() * availableYarn.length);
    const choice = availableYarn[index];
    availableYarn = availableYarn.filter((e) => e != choice);
    participant.number = choice;
  }
});
