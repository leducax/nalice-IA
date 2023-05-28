document.addEventListener('DOMContentLoaded', function() {
    var submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', function() {
      var userInput = document.getElementById('user-input').value;
      askQuestion(userInput);
    });
  
    document.getElementById('user-input').addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        e.preventDefault(); // Empêcher le rechargement de la page
        var userInput = document.getElementById('user-input').value;
        askQuestion(userInput);
      }
    });
  
    function askQuestion(question) {
      if (question.trim() !== '') {
        var chatWindow = document.getElementById('chat-window');
        var output = document.getElementById('output');
  
        var userMessage = document.createElement('p');
        userMessage.className = 'user-message';
        userMessage.innerText = 'Vous : ' + question;
        output.appendChild(userMessage);
  
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/ask', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var botMessage = document.createElement('p');
            botMessage.className = 'bot-message';
            botMessage.innerText = 'N\'Alice : ' + response.answer;
            output.appendChild(botMessage);
            chatWindow.scrollTop = chatWindow.scrollHeight;
          }
        };
        xhr.send('question=' + encodeURIComponent(question));
  
        document.getElementById('user-input').value = '';
      }
    }
  });
  