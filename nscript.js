
let fileInput = document.getElementById("file-upload");
let settingsButton = document.getElementById("settings-button");
let settingsMenu = document.getElementById("settings-menu");
let darkModeToggle = document.getElementById("dark-mode-toggle");
let backgroundColor = document.getElementById('background-color');
let backgroundImage = document.getElementById('background-image');
let resetButton1 = document.getElementById('reset-button');
let reactionButtons = document.querySelectorAll('.reaction');
let body = document.body;

let lastPeerId = null;
let peer = null; // own peer object
let conn = null;
let recvIdInput = document.getElementById("receiver-id");
let myIdDiv = document.getElementById("my-id");
let message = document.querySelector(".chat").querySelector("div");
let sendMessageBox = document.getElementById("sendMessageBox");
let sendButton = document.getElementById("sendButton");
let clearMsgsButton = document.getElementById("clearMsgsButton");
let allmessage = document.getElementById("allmessage")
let connectButton = document.getElementById("connect-button");
let cueString = "<span class=\"cueMsg\">Cue: </span>";



(function () {

                            

                            /**
                             * Create the Peer object for our end of the connection.
                             *
                             * Sets up callbacks that handle any events related to our
                             * peer object.
                             */
                            function initialize() {
                                // Create own peer object with connection to shared PeerJS server
                                peer = new Peer(null, {
                                    debug: 2
                                });

                                peer.on('open', function (id) {
                                    myIdDiv.innerHTML = `ID: ${id}<button id="copybutton" onclick="copyText()" style="background-color: transparent;border: 0;"><svg xmlns="http://www.w3.org/2000/svg" height="21" viewBox="0 96 960 960" width="17" fill="currentColor"><path d="M180 975q-24 0-42-18t-18-42V312h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42V235q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440V235H300v560Zm0 0V235v560Z"/></svg></button>`;
                                    // Workaround for peer.reconnect deleting previous id
                                    if (peer.id === null) {
                                        console.log('Received null id from peer open');
                                        peer.id = lastPeerId;
                                    } else {
                                        lastPeerId = peer.id;
                                    }

                                    console.log('ID: ' + peer.id);

                                });

                                peer.on('connection', function (c) {
                                    // Allow only a single connection
                                    if (conn && conn.open) {
                                        c.on('open', function() {
                                            c.send("Already connected to another client");
                                            setTimeout(function() { c.close(); }, 100);
                                            
                                        });
                                        return;
                                    }

                                    conn = c;
                                    console.log("Connected to: " + conn.peer);
                                  
                                    ready();
                                });
                                peer.on('disconnected', function () {
                                    
                                    console.log('Connection lost. Please reconnect');

                                });
                                peer.on('disconnected', function () {
                                    
                                    console.log('Connection lost. Please reconnect');

                                    // Workaround for peer.reconnect deleting previous id
                                    peer.id = lastPeerId;
                                    peer._lastServerId = lastPeerId;
                                    peer.reconnect();
                                });
                                peer.on('close', function() {
                                    conn = null;
                                    
                                    
                                    console.log('Connection destroyed');
                                });
                                peer.on('error', function (err) {
                                    console.log(err);
                                    alert('' + err);
                                });
                            };

                            /**
                             * Create the connection between the two Peers.
                             *
                             * Sets up callbacks that handle any events related to the
                             * connection and data received on it.
                             */
                            function join() {
                                // Close old connection
                                if (conn) {
                                    conn.close();
                                }

                                // Create connection to destination peer specified in the input field
                                conn = peer.connect(recvIdInput.value, {
                                    reliable: true
                                });

                                conn.on('open', function () {
                                    console.log("Connected to: " + conn.peer);

                                    // Check URL params for comamnds that should be sent immediately
                                    let command = getUrlParam("command");
                                    if (command)
                                        conn.send(command);
                                });
                                // Handle incoming data (messages only since this is the signal sender)
                                conn.on('data', function (data) {
                                    addMessage("<p id=\"received\" class=\"received\"> " + data);
                                });
                                conn.on('close', function () {
                                    
                                });
                            };

                            /**
                             * Triggered once a connection has been achieved.
                             * Defines callbacks to handle incoming data and connection events.
                             */
                            function ready() {
                                conn.on('data', function (data) {
                                    console.log("Data recieved");
                                    let cueString = "<span class=\"cueMsg\">Cue: </span>";
                                    switch (data) {
                                        case 'Go':
                                            go();
                                            addMessage(cueString + data);
                                            break;
                                        case 'Fade':
                                            fade();
                                            addMessage(cueString + data);
                                            break;
                                        case 'Off':
                                            off();
                                            addMessage(cueString + data);
                                            break;
                                        case 'Reset':
                                            reset();
                                            addMessage(cueString + data);
                                            break;
                                        default:
                                            addMessage("<p id=\"received\" class=\"received\"> " + data + "</p>");
                                            break;
                                    };
                                });
                                conn.on('close', function () {
                                    
                                    conn = null;
                                });
                            }

                            function go() {
                                standbyBox.className = "display-box hidden";
                                goBox.className = "display-box go";
                                fadeBox.className = "display-box hidden";
                                offBox.className = "display-box hidden";
                                return;
                            };

                            function fade() {
                                standbyBox.className = "display-box hidden";
                                goBox.className = "display-box hidden";
                                fadeBox.className = "display-box fade";
                                offBox.className = "display-box hidden";
                                return;
                            };

                            function off() {
                                standbyBox.className = "display-box hidden";
                                goBox.className = "display-box hidden";
                                fadeBox.className = "display-box hidden";
                                offBox.className = "display-box off";
                                return;
                            }

                            function reset() {
                                standbyBox.className = "display-box standby";
                                goBox.className = "display-box hidden";
                                fadeBox.className = "display-box hidden";
                                offBox.className = "display-box hidden";
                                return;
                            };

                            /**
                             * Get first "GET style" parameter from href.
                             * This enables delivering an initial command upon page load.
                             *
                             * Would have been easier to use location.hash.
                             */
                            function getUrlParam(name) {
                                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                                let regexS = "[\\?&]" + name + "=([^&#]*)";
                                let regex = new RegExp(regexS);
                                let results = regex.exec(window.location.href);
                                if (results == null)
                                    return null;
                                else
                                    return results[1];
                            };

                            /**
                             * Send a signal via the peer connection and add it to the log.
                             * This will only occur if the connection is still alive.
                             */
                            function signal(sigName) {
                                if (conn && conn.open) {
                                    conn.send(sigName);
                                    console.log(sigName + " signal sent");
                                    addMessage(cueString + sigName);
                                } else {
                                    console.log('Connection is closed');
                                }
                            }

                            

                            

                            function clearMessages() {
                                allmessage.innerHTML = "";
                            };

                            // Listen for enter in message box
                            sendMessageBox.addEventListener('keypress', function (e) {
                                let event = e || window.event;
                                let char = event.which || event.keyCode;
                                if (char == '13')
                                    sendButton.click();
                            });
                            sendButton.addEventListener('click', function () {
                                if (conn && conn.open) {
                                    let msg = sendMessageBox.value;
                                    if (msg.trim() === "") {
                                        return; 
                                    }
                                    sendMessageBox.value = "";
                                    conn.send(msg);
                                    console.log("Sent: " + msg);
                                    addMessage("<p id=\"sent\" class=\"sent\">" + msg + "</p>"   );
                                } else {
                                    console.log('Connection is closed');   
                                    addMessage("<p id=\"warning\" class=\"warning\"> Non sei connesso </p>"   );
                                }
                            });
                            

                            function addMessage(msg) {
                                let now = new Date();
                                let h = now.getHours();
                                let m = addZero(now.getMinutes());
                                let s = addZero(now.getSeconds());

                                if (h > 12)
                                    h -= 12;
                                else if (h === 0)
                                    h = 12;

                                function addZero(t) {
                                    if (t < 10)
                                        t = "0" + t;
                                    return t;
                                };
                                message.innerHTML = `${message.innerHTML}<p class="timestamp">${h}:${m}:${s}</p>${msg}`;
                            };

                            clearMsgsButton.setAttribute('onclick', `(${clearMessages})();`);

                            
                            // Start peer connection on click
                            connectButton.addEventListener('click', ()=>{
                                if(recvIdInput.value.length<1) return;
                                join();
                            });

                            // Since all our callbacks are setup, start the process of obtaining an ID
                            initialize();
                        })();







darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
backgroundColor.addEventListener('change', () => {
  document.body.style.backgroundColor = backgroundColor.value;
  document.querySelector('.chat').style.backgroundColor = backgroundColor.value;
  document.querySelector('.chat').querySelector('div').style.backgroundColor = backgroundColor.value;
  document.querySelector('.settings-menu').style.backgroundColor = backgroundColor.value;
});
backgroundImage.addEventListener('change', (event) => {
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    document.body.style.backgroundImage = `url('${e.target.result}')`;
  }
  reader.readAsDataURL(file);
});
resetButton1.addEventListener('click', () => {
  let tc=[document.body, document.querySelector('.chat'), document.querySelector('.chat').querySelector('div'), document.querySelector('.settings-menu')];
  tc.forEach(e=>{
    e.style.backgroundColor = "";
    backgroundColor.value = "";
    e.style.backgroundImage = "";
  })
});



function linkify(str) {
  if (str == null) return false;
  let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return str.replace(urlRegex, function(url) {
      let hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
          hyperlink = 'http://' + hyperlink;
      }
      return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
  });
}
if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add("dark-mode");


function copyText() {
    var range = document.createRange();
    range.selectNode(myIdDiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  
    var textToCopy = myIdDiv.textContent.substring(4);
    navigator.clipboard.writeText(textToCopy);

    console.log("copiato")
  
    window.getSelection().removeAllRanges();
}
