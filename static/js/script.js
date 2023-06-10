document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submit-btn');
  const userInput = document.getElementById('user-input');

  submitBtn.addEventListener('click', function() {
    const question = userInput.value;
    askQuestion(question);
  });

  userInput.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      const question = userInput.value;
      askQuestion(question);
    }
  });

  function askQuestion(question) {
    if (question.trim() !== '') {
      const chatWindow = document.getElementById('chat-window');
      const output = document.getElementById('output');

      const userMessage = createUserMessage(question);
      output.appendChild(userMessage);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/ask', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const botMessage = createBotMessage(response.answer);
          output.appendChild(botMessage);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      };
      xhr.send(`question=${encodeURIComponent(question)}`);

      userInput.value = '';
    }
  }

  function createUserMessage(question) {
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
  
    const avatar = document.createElement('div');
    avatar.className = 'avatar user-avatar';
    const logo = document.createElement('img');
    logo.src = './static/fav/7d80f2f1ad8a78f014778ec6d8232897.jpg'; // Remplace avec le chemin vers le logo de l'utilisateur
    logo.alt = 'Logo Utilisateur';
    avatar.appendChild(logo);
    userMessage.appendChild(avatar);
  
    const messageText = document.createElement('p');
    messageText.innerText = `Vous : ${question}`;
    userMessage.appendChild(messageText);
  
    return userMessage;
  }
  
  function createBotMessage(answer) {
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
  
    const avatar = document.createElement('div');
    avatar.className = 'avatar ai-avatar';
    const logo = document.createElement('img');
    logo.src = './static/fav/ico.ico'; // Remplace avec le chemin vers le logo de l'IA
    logo.alt = 'Logo IA';
    avatar.appendChild(logo);
    botMessage.appendChild(avatar);
  
    const messageText = document.createElement('p');
    messageText.innerText = `N'Alice : ${answer}`;
    botMessage.appendChild(messageText);
  
    return botMessage;
  }
  
});

document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('drop-zone');
  const fileList = document.getElementById('file-list');

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleFileDrop);

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  }

  function processFiles(files) {
    files.forEach(file => {
      // Traiter le fichier ici (par exemple, envoyer le fichier au serveur pour analyse et codage)
      console.log('Nom du fichier :', file.name);
      console.log('Type du fichier :', file.type);
      console.log('Taille du fichier :', file.size);
      // Ajouter ici la logique pour analyser et coder le fichier

      // Ajouter le nom du fichier à la liste des fichiers
      const listItem = document.createElement('li');
      listItem.innerText = file.name;
      fileList.appendChild(listItem);
    });
  }
});

document.getElementById('open-server-btn').addEventListener('click', function() {
  const fileContainer = document.querySelector('#file-list');
  const files = fileContainer.querySelectorAll('li');

  if (files.length === 0) {
    alert('Aucun projet à ouvrir.');
    return;
  }

  // Récupérer le nom du premier fichier dans le file container
  const projectName = files[0].innerText;

  // Construire l'URL du projet à ouvrir en localhost
  const serverUrl = 'http://localhost:2311/' + projectName; // Remplacez le port (2311) avec le port utilisé par votre serveur local

  // Ouvrir le projet en localhost dans une nouvelle fenêtre
  window.open(serverUrl, '_blank');
});


// Fonction pour télécharger le projet
// Fonction pour gérer l'événement de téléchargement du projet
function downloadProject() {
  const fileContainer = document.querySelector('#file-list');
  const files = fileContainer.querySelectorAll('li');

  if (files.length === 0) {
    alert('Aucun fichier à télécharger.');
    return;
  }

  // Créer une archive ZIP
  const zip = new JSZip();

  // Parcourir les fichiers dans le file container
  files.forEach((file, index) => {
    const fileName = file.innerText;
    const fileContent = 'Contenu du fichier ' + (index + 1); // Remplacez par le véritable contenu du fichier

    // Ajouter le fichier à l'archive ZIP
    zip.file(fileName, fileContent);
  });

  // Générer l'archive ZIP
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    // Créer un lien de téléchargement
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = 'projet.zip'; // Nom du fichier ZIP à télécharger
    downloadLink.click();
  });
}

// Écouteur d'événement pour le bouton de téléchargement
const downloadButton = document.querySelector('#download-btn');
downloadButton.addEventListener('click', downloadProject);

// Fonction pour supprimer le projet
function deleteProject() {
  const fileList = document.querySelector('#file-list');
  fileList.innerHTML = '';
}

// Fonction pour effacer la conversation
function clearConversation() {
  const chatWindow = document.querySelector('#output');
  chatWindow.innerHTML = '';
}

// Écouteur d'événement pour le bouton de suppression
const deleteButton = document.querySelector('#delete-btn');
deleteButton.addEventListener('click', deleteProject);

// Écouteur d'événement pour le bouton de réinitialisation
const clearButton = document.querySelector('#clear-btn');
clearButton.addEventListener('click', clearConversation);

// Fonction pour gérer l'événement de sélection de fichier
function handleFileUpload(event) {
  const files = event.target.files;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = file.webkitRelativePath; // Utilisez le chemin relatif du fichier comme nom
  
    // Créez un élément li pour afficher le nom du fichier
    const listItem = document.createElement('li');
    listItem.innerText = fileName;
  
    // Ajoutez l'élément li à la liste des fichiers
    const fileList = document.querySelector('#file-list');
    fileList.appendChild(listItem);
  }
}


// Écouteur d'événement pour le bouton d'importation
const uploadButton = document.querySelector('#upload-btn');
const uploadInput = document.querySelector('#upload-input');

uploadButton.addEventListener('click', () => {
  uploadInput.click();
});

uploadInput.addEventListener('change', handleFileUpload);
