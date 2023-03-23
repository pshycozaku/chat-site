let sendButton = document.getElementById("send-button");
let chat = document.querySelector(".chat").querySelector("div");
let fileInput = document.getElementById("file-upload");
let settingsButton = document.getElementById("settings-button");
let settingsMenu = document.getElementById("settings-menu");
let darkModeToggle = document.getElementById("dark-mode-toggle");
let backgroundColor = document.getElementById('background-color');
let backgroundImage = document.getElementById('background-image');
let resetButton = document.getElementById('reset-button');
let reactionButtons = document.querySelectorAll('.reaction');
let body = document.body;

if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add("dark-mode");

sendButton.addEventListener("click", function() {
  let input = document.querySelector(".new-message input");
  let message = input.value;
  
  
  if (message !== "") {
    
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "sent");
    
    let messageText = document.createElement("p");
    messageText.innerHTML = linkify(message);
    
    let timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    let now = new Date();
    var h = (now.getHours()<10?'0':'') + now.getHours();
    var m = (now.getMinutes()<10?'0':'') + now.getMinutes();
    timestamp.textContent = `${h}:${m}`;
    
    let reaction = document.createElement("div");
    reaction.id = "reactions-main";
    reaction.classList.add("reactions");
    reaction.innerHTML = '        <div class="reactions">\
    <button class="reaction" data-reaction="👍" style="background-color: transparent;border: 0;">👍</button>\
    <button class="reaction" data-reaction="❤️" style="background-color: transparent;border: 0;">❤️</button>\
    <button class="reaction" data-reaction="😮" style="background-color: transparent;border: 0;">😮</button>\
    </div>\
    <div class="reaction-count"></div>';

    messageDiv.appendChild(messageText);
    messageDiv.appendChild(timestamp);
    messageDiv.appendChild(reaction);
    
    
    chat.appendChild(messageDiv);
    
    input.value = "";

    chat.scrollTop=chat.scrollHeight;
    addReactionEvents();
  }
});

function reactionButtonListenerFunction(e) {{
  var button = e.target;
  // Otteniamo il tipo di reazione dal pulsante
  let reaction = button.getAttribute('data-reaction');

  // Troviamo il messaggio associato al pulsante di reazione
  let message = button.closest('.message');

  // Creiamo un nuovo elemento per la reazione
  let reactionElement = document.createElement('span');
  reactionElement.classList.add('reaction');
  reactionElement.textContent = reaction;
  reactionElement.setAttribute('onclick', 'this.remove()');
  reactionElement.setAttribute('onmouseover', 'this.textContent="❌"');
  reactionElement.setAttribute('onmouseout', `this.textContent="${reaction}"`);
  

  // Aggiungiamo l'attributo data-reaction all'elemento reazione per poterlo rimuovere in seguito
  reactionElement.setAttribute('data-reaction', reaction);

  // Aggiungiamo l'elemento reazione al messaggio
  try {
    let reactionsContainer = message.querySelector('.reactions#reactions-main');
    reactionsContainer.appendChild(reactionElement);
  }catch(e){}
}}

// Aggiungiamo un listener di eventi a ciascun pulsante di reazione
function addReactionEvents(){
  reactionButtons = document.querySelectorAll('.reaction');
  reactionButtons.forEach(button => {
    try{button.removeEventListener(reactionButtonListenerFunction)}catch(e){};
    button.addEventListener('click', reactionButtonListenerFunction);
  });
};
addReactionEvents();

fileInput.addEventListener("change", function() {
  let file = fileInput.files[0];
  let reader = new FileReader();
  
  reader.addEventListener("load", function() {
    let imageDiv = document.createElement("div");
    imageDiv.classList.add("message", "sent");
    
    let image = document.createElement("img");
    image.src = reader.result;

    
    let timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    let now = new Date();
    var h = (now.getHours()<10?'0':'') + now.getHours();
    var m = (now.getMinutes()<10?'0':'') + now.getMinutes();

    timestamp.textContent = `${h}:${m}`;

    let reaction = document.createElement("div");
    reaction.id = "reactions-main";
    reaction.classList.add("reactions");
    reaction.innerHTML = '        <div class="reactions">\
    <button class="reaction" data-reaction="👍" style="background-color: transparent;border: 0;">👍</button>\
    <button class="reaction" data-reaction="❤️" style="background-color: transparent;border: 0;">❤️</button>\
    <button class="reaction" data-reaction="😮" style="background-color: transparent;border: 0;">😮</button>\
    </div>\
    <div class="reaction-count"></div>';
    
    imageDiv.appendChild(image);
    imageDiv.appendChild(document.createElement('br'));
    imageDiv.appendChild(timestamp);
    imageDiv.appendChild(reaction);
    
    
    chat.appendChild(imageDiv)
    
    fileInput.value = "";
    
    chat.scrollTop=chat.scrollHeight;
    addReactionEvents();
  });
  
  reader.readAsDataURL(file);
});



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

resetButton.addEventListener('click', () => {
  var tc=[document.body, document.querySelector('.chat'), document.querySelector('.chat').querySelector('div'), document.querySelector('.settings-menu')];
  tc.forEach(e=>{
    e.style.backgroundColor = "";
    backgroundColor.value = "";
    e.style.backgroundImage = "";
  })
});

function linkify(str) {
  if (str == null) return false;
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return str.replace(urlRegex, function(url) {
      var hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
          hyperlink = 'http://' + hyperlink;
      }
      return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
  });
}



// Aggiungiamo un listener di eventi a ciascun pulsante di reazione
function addReactionEvents(){
  reactionButtons = document.querySelectorAll('.reaction');
  reactionButtons.forEach(button => {
    try{button.removeEventListener(reactionButtonListenerFunction)}catch(e){};
    button.addEventListener('click', reactionButtonListenerFunction);
  });
};
function reactionButtonListenerFunction(e) {{
let button = e.target;
// Otteniamo il tipo di reazione dal pulsante
let reaction = button.getAttribute('data-reaction');

// Troviamo il messaggio associato al pulsante di reazione
let message = button.closest('.message');

// Creiamo un nuovo elemento per la reazione
let reactionElement = document.createElement('span');
reactionElement.classList.add('reaction');
reactionElement.textContent = reaction;
reactionElement.setAttribute('onclick', 'this.remove()');
reactionElement.setAttribute('onmouseover', 'this.textContent="❌"');
reactionElement.setAttribute('onmouseout', `this.textContent="${reaction}"`);


// Aggiungiamo l'attributo data-reaction all'elemento reazione per poterlo rimuovere in seguito
reactionElement.setAttribute('data-reaction', reaction);

// Aggiungiamo l'elemento reazione al messaggio
try {
  let reactionsContainer = message.querySelector('.reactions#reactions-main');
  reactionsContainer.appendChild(reactionElement);
}catch(e){}
}}
addReactionEvents();