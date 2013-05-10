// Generated by CoffeeScript 1.6.1
(function() {
  "WebRTC handler for clientServer.\n\nDispatches (sends and receives) WebRTC data. Should be kept \nas minimal as possible, dispatching to other modules.";
  var _this = this;

  window.WebRTC = (function() {

    function WebRTC(serverFileCollection) {
      var _this = this;
      this.serverFileCollection = serverFileCollection;
      this.serveFile = function(data) {
        return WebRTC.prototype.serveFile.apply(_this, arguments);
      };
      this.setUpReceiveEventCallbacks = function() {
        return WebRTC.prototype.setUpReceiveEventCallbacks.apply(_this, arguments);
      };
      this.sendEventTo = function(socketId, eventName, data) {
        return WebRTC.prototype.sendEventTo.apply(_this, arguments);
      };
      this.sendEvent = function(eventName, data) {
        return WebRTC.prototype.sendEvent.apply(_this, arguments);
      };
      this.receiveICECandidate = function(socketID, candidate) {
        return WebRTC.prototype.receiveICECandidate.apply(_this, arguments);
      };
      this.receiveOffer = function(socketID, sdp) {
        return WebRTC.prototype.receiveOffer.apply(_this, arguments);
      };
      this.addBrowserConnection = function(socketID) {
        return WebRTC.prototype.addBrowserConnection.apply(_this, arguments);
      };
      this.getSocketId = function() {
        return WebRTC.prototype.getSocketId.apply(_this, arguments);
      };
      this.browserConnections = {};
      this.dataChannels = {};
      this.eventTransmitter = new window.EventTransmitter();
      this.setUpReceiveEventCallbacks();
      this.connection = io.connect(document.location.origin);
      this.connection.emit("joinAsClientServer");
      this.connection.on("joined", this.addBrowserConnection);
      this.connection.on("receiveOffer", this.receiveOffer);
      this.connection.on("receiveICECandidate", this.receiveICECandidate);
      this.connection.on("setSocketId", function(socketId) {
        return _this.socketId = socketId;
      });
    }

    WebRTC.prototype.getSocketId = function() {
      return this.socketId;
    };

    WebRTC.prototype.addDataChannel = function(socketID, channel) {
      var _this = this;
      console.log("adding data channel");
      channel.onopen = function() {
        var landingPage;
        console.log("data stream open " + socketID);
        landingPage = _this.serverFileCollection.getLandingPage();
        return channel.send(JSON.stringify({
          "eventName": "initialLoad",
          "data": landingPage
        }));
      };
      channel.onclose = function(event) {
        delete _this.dataChannels[socketID];
        return console.log("data stream close " + socketID);
      };
      channel.onmessage = function(message) {
        console.log("data stream message " + socketID);
        console.log(message);
        return _this.eventTransmitter.receiveEvent(message.data);
      };
      channel.onerror = function(err) {
        return console.log("data stream error " + socketID + ": " + err);
      };
      return this.dataChannels[socketID] = channel;
    };

    WebRTC.prototype.addBrowserConnection = function(socketID) {
      var peerConnection,
        _this = this;
      peerConnection = new mozRTCPeerConnection(null, {
        "optional": [
          {
            "RtpDataChannels": true
          }
        ]
      });
      this.browserConnections[socketID] = peerConnection;
      peerConnection.onicecandidate = function(event) {
        return _this.connection.emit("sendICECandidate", socketID, event.candidate);
      };
      peerConnection.ondatachannel = function(evt) {
        console.log("data channel connecting " + socketID);
        return _this.addDataChannel(socketID, evt.channel);
      };
      return console.log("client joined", socketID);
    };

    WebRTC.prototype.receiveOffer = function(socketID, sdp) {
      var pc;
      console.log("offer received from " + socketID);
      pc = this.browserConnections[socketID];
      pc.setRemoteDescription(new mozRTCSessionDescription(sdp));
      return this.sendAnswer(socketID);
    };

    WebRTC.prototype.sendAnswer = function(socketID) {
      var pc,
        _this = this;
      pc = this.browserConnections[socketID];
      return pc.createAnswer(function(session_description) {
        pc.setLocalDescription(session_description);
        return _this.connection.emit("sendAnswer", socketID, session_description);
      });
    };

    WebRTC.prototype.receiveICECandidate = function(socketID, candidate) {
      if (candidate) {
        candidate = new mozRTCIceCandidate(candidate);
        console.log(candidate);
        return this.browserConnections[socketID].addIceCandidate(candidate);
      }
    };

    WebRTC.prototype.sendEvent = function(eventName, data) {
      var dataChannel, socketID, _ref, _results;
      _ref = this.dataChannels;
      _results = [];
      for (socketID in _ref) {
        dataChannel = _ref[socketID];
        _results.push(this.eventTransmitter.sendEvent(dataChannel, eventName, data));
      }
      return _results;
    };

    WebRTC.prototype.sendEventTo = function(socketId, eventName, data) {
      this.eventTransmitter.sendEvent(this.dataChannels[socketId], eventName, data);
      console.log("sending event");
      return console.log(data);
    };

    WebRTC.prototype.setUpReceiveEventCallbacks = function() {
      return this.eventTransmitter.addEventCallback("requestFile", this.serveFile);
    };

    WebRTC.prototype.serveFile = function(data) {
      var filename;
      filename = data.filename;
      console.log("FILENAME: " + filename);
      if (!this.serverFileCollection.hasFile(filename)) {
        console.error("Error: Client requested " + filename + " which does not exist on server.");
        this.sendEventTo(data.socketId, "receiveFile", {
          filename: filename,
          fileContents: "",
          type: ""
        });
        return;
      }
      return this.sendEventTo(data.socketId, "receiveFile", {
        filename: filename,
        fileContents: this.serverFileCollection.getContents(filename),
        type: data.type
      });
    };

    return WebRTC;

  })();

}).call(this);
