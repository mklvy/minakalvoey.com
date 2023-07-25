import { userMessagesSmall } from "./story/userMessagesSmall.js";
import { userMessagesBig } from "./story/userMessagesBig.js";
import { imagesAssesment } from "./story/imagesAssesment.js";
import { finalQuestions } from "./story/finalQuestions.js";
import { finalWords } from "./story/finalWords.js";
import { credits } from "./story/credits.js";

function hideIdleScreen () {
  document.getElementById('idleScreen').classList.add('hide');    
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function randomNumber(min, max) { 
  return Math.floor(Math.random() * (max - min) + min);
}

function hideElements(className) {
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.add('hide');
  }
}

function showElements(className) {
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove('hide');
  }
}

function setQuizImage(parent, imageId) {
  var url = '/public/img/yellow/quiz' + quizImageIds[imageId] + '.png';
  var imageElem = document.createElement('img');
  imageElem.classList.add('quizImg');
  imageElem.onload = function() { parent.scrollIntoView(); };
  imageElem.src = url;
  parent.appendChild(imageElem); 
}

function flashImage() {
  if (blockImage) {
    return;
  }

  blockImage = true;
  
  if (nImagesFlashed >= MAX_FLASH_IMAGES) {
    clearInterval(flashImagesInterval);

    setTimeout(function() {
      document.getElementById('backgroundPlayer').src = '/public/audio/end-sound.mp3';
      document.getElementById('backgroundPlayer').play();
      hideElements('chatBox');
      showElements('finalPage');
      finalWordsIndex = 0;
      document.getElementById('end').addEventListener('click', sayFinalWords, false);
    }, 1000);

  } else {
    var parent = document.getElementById('chatBox');
    var index = randomNumber(0, 4);
    var imageName = imageNames[index];
    var number = randomNumber(1, 5);
    var url = '/public/img/red/' + imageName + '-' + number + '.png';
    var imageElem = document.createElement('img');
    imageElem.classList.add('flashImg');
    imageElem.style.top = randomNumber(3, 54) + '%';
    imageElem.style.left = randomNumber(3, 63) + '%';
    imageElem.src = url;
    parent.appendChild(imageElem);
  
    setTimeout(function () {
      imageElem.remove();
      blockImage = false;
      nImagesFlashed++;
    }, 1000);
  }


}

function startGame() {
  hideElements('startPage');
  showElements('welcomePage');
  document.getElementById('backgroundPlayer').src = '/public/audio/chat-sound.mp3';
  document.getElementById('backgroundPlayer').play();
}

function openChatBox() {
  hideElements('welcomePage');
  showElements('chat');
  inactivityTime();
  addMessage();
}

function openBigMessage() {
  hideElements('chatBoxMessagesContainer');
  showElements('chatBoxBigMessageContainer');

  // wait for element to be destroyed
  setTimeout(function () {
    document.getElementById('bigMessage').addEventListener('click', handleBigMessage, false);
  }, 100)

}

function handleBigMessage() {
  var message = messages[step1CurrentIndex][innerIndex];

  if (message) {
    addBigMessage(message);
    innerIndex++;
  } else {
    document.getElementById('bigMessage').removeEventListener('click', handleBigMessage, false);
    document.getElementById('bigMessage').addEventListener('click', backToChatBox, false);
    addMessageImage();
  }
}

function addMessageImage() {
  var parent = document.getElementById('bigMessage');

  var imageName = messages[step1CurrentIndex][0].image;
  var number = randomNumber(1, 5);
  var url = '/public/img/red/' + imageName + '-' + number + '.png';
  var imageElem = document.createElement('img');
  imageElem.classList.add('flashImg');
  imageElem.classList.add('centerImage');
  imageElem.src = url;
  imageElem.addEventListener('click', backToChatBox, false);
  parent.appendChild(imageElem);
}

function backToChatBox () {
  document.getElementById('bigMessage').removeEventListener('click', backToChatBox, false);
  document.getElementById('bigMessage').innerHTML = '';
  hideElements('chatBoxBigMessageContainer');
  showElements('chatBoxMessagesContainer');
  step1CurrentIndex++;
  innerIndex = 0;
  addMessage();
}

function addSmallMessage(message) {
  var chatBoxMessageContainer = document.createElement('p');
  var parent = document.getElementById('chatBox');
  chatBoxMessageContainer.classList.add('chatBoxMessageContainer');
  chatBoxMessageContainer.classList.add('rightAligned');
  var chatBoxMessage = document.createElement('div');
  chatBoxMessage.innerHTML = message.text;
  var userName = document.createElement('div');
  userName.innerHTML = 'me';
  userName.classList.add('userName');
  var timestamp = document.createElement('div');
  timestamp.classList.add('timestamp');
  timestamp.classList.add('timestampColor');
  timestamp.classList.add('rightAligned');
  timestamp.innerHTML =  message.time; 

  chatBoxMessageContainer.appendChild(userName);
  chatBoxMessageContainer.appendChild(chatBoxMessage);
  chatBoxMessageContainer.appendChild(timestamp);
  parent.appendChild(chatBoxMessageContainer);
  chatBoxMessage.scrollIntoView();
}

function addBigMessage(message) {
  openBigMessage();
  document.getElementById('bigMessage').innerHTML = '';
  var parent = document.getElementById('bigMessage');
  var bigMessageContainer = document.createElement('div');
  bigMessageContainer.setAttribute('id', 'bigMsg');
  bigMessageContainer.classList.add('bigMessageContainer');
  var textParagraph = document.createElement('div');
  textParagraph.innerHTML = message.text;
  textParagraph.classList.add('bigMessage');
  var userName = document.createElement('div');
  userName.innerHTML = 'me';
  userName.classList.add('userName');
  var timestamp = document.createElement('div');
  timestamp.classList.add('timestampColor');
  timestamp.classList.add('rightAligned');
  timestamp.innerHTML =  message.time; 

  bigMessageContainer.appendChild(userName);
  bigMessageContainer.appendChild(textParagraph);
  bigMessageContainer.appendChild(timestamp);
  parent.appendChild(bigMessageContainer);
}

function addGuideMessage(messageText) {
  var chatBoxMessageContainer = document.createElement('p');
  var parent = document.getElementById('chatBox');
  chatBoxMessageContainer.classList.add('chatBoxMessageContainer');
  var chatBoxMessage = document.createElement('div');
  chatBoxMessage.innerHTML = messageText;
  var userName = document.createElement('div');
  userName.innerHTML = 'Guide';
  userName.classList.add('userName');

  chatBoxMessageContainer.appendChild(userName);
  chatBoxMessageContainer.appendChild(chatBoxMessage);
  parent.appendChild(chatBoxMessageContainer);
  chatBoxMessage.scrollIntoView();
}

function addOptionsToInputBox(options) {
  var inputBox = document.getElementById('textInput');
  var option1 = document.createElement('div');
  option1.innerHTML = options.option1;
  option1.classList.add('inputBoxDiv');
  option1.addEventListener('click', addMessage, false);
  var option2 = document.createElement('div');
  option2.classList.add('inputBoxDiv');
  option2.innerHTML = options.option2;
  option2.addEventListener('click', addMessage, false);
  var option3 = document.createElement('div');
  option3.classList.add('inputBoxDiv');
  option3.innerHTML = options.option3;
  option3.addEventListener('click', addMessage, false);

  inputBox.appendChild(option1);
  inputBox.appendChild(option2);
  inputBox.appendChild(option3);
}

function addGuideMessageWithImage(options, index) {
  var chatBoxMessageContainer = document.createElement('p');
  var parent = document.getElementById('chatBox');
  chatBoxMessageContainer.classList.add('chatBoxMessageContainer');

  var image = document.createElement('div');
  image.classList.add('quizImgContainer');
  setQuizImage(image, index);
  
  var option1 = document.createElement('div');
  option1.innerHTML = '1) ' + options.option1;
  var option2 = document.createElement('div');
  option2.innerHTML = '2) ' + options.option2;
  var option3 = document.createElement('div');
  option3.innerHTML = '3) ' + options.option3;
  
  var userName = document.createElement('div');
  userName.innerHTML = 'Guide';
  userName.classList.add('userName');


  chatBoxMessageContainer.appendChild(userName);
  chatBoxMessageContainer.appendChild(image);
  chatBoxMessageContainer.appendChild(option1);
  chatBoxMessageContainer.appendChild(option2);
  chatBoxMessageContainer.appendChild(option3);
  parent.appendChild(chatBoxMessageContainer);
  
  addOptionsToInputBox({
    option1: '1) ' + options.option1,
    option2: '2) ' + options.option2,
    option3: '3) ' + options.option3
  });
}

function addGuideMessageWithOptions(messageText, options) {
  var chatBoxMessageContainer = document.createElement('p');
  var parent = document.getElementById('chatBox');
  chatBoxMessageContainer.classList.add('chatBoxMessageContainer');
  var chatBoxMessage = document.createElement('div');
  chatBoxMessage.innerHTML = messageText;
  var userName = document.createElement('div');
  userName.innerHTML = 'Guide';
  userName.classList.add('userName');

  chatBoxMessageContainer.appendChild(userName);
  chatBoxMessageContainer.appendChild(chatBoxMessage);
  parent.appendChild(chatBoxMessageContainer);

  addOptionsToInputBox({
    option1: options[0],
    option2: options[1],
    option3: options[2], 
  });

  chatBoxMessage.scrollIntoView();
}

function sayFinalWords() {
  if (finalWordsIndex >= finalWords.length) {
    goToCredits();
    return;
  }

  var finalText = document.getElementById('finalText');
  finalText.innerHTML = finalWords[finalWordsIndex];
  finalWordsIndex++;
}

function goToStart() {
  window.location.href = 'index.html'
}

function showCredits () {
  var creditsContainer = document.getElementById('credits');

  if (creditsIndex >= credits.length) {
    creditsContainer.removeEventListener('click', showCredits, false);
    creditsContainer.classList.remove('pointer');

    var backButtonContainer = document.createElement('div');
    backButtonContainer.classList.add('backButton');
    var backButton = document.createElement('p');
    backButton.classList.add('chatBoxMessageContainer');
    backButton.classList.add('center');
    backButton.classList.add('pointer');
    backButton.addEventListener('click', goToStart, false);
    backButton.innerHTML = 'Back to Start';
    backButtonContainer.appendChild(backButton);
    creditsContainer.appendChild(backButtonContainer);
    return;
  }

  var creditMessageContainer = document.createElement('p');
  creditMessageContainer.classList.add('chatBoxMessageContainer');
  creditMessageContainer.classList.add('creditsPageMessage');
  creditMessageContainer.innerHTML = credits[creditsIndex];
  creditsContainer.appendChild(creditMessageContainer);
  creditsIndex++;
}

function goToCredits() {
  hideElements('finalPage');
  showElements('creditsPage');
  creditsIndex = 0;
  document.getElementById('credits').addEventListener('click', showCredits, false);
}


// User messages variables
var MAX_MESSAGES = 14;
var MIN_MESSAGES = 9;
var step1CurrentIndex = 0;
var innerIndex = 0;
var nMessages = randomNumber(MIN_MESSAGES, MAX_MESSAGES);
var imageNames = ['brothers', 'red-landscape', 'smiley-ppl', 'spider', 'villa'];
var messages = shuffle([].concat(userMessagesBig).concat(userMessagesSmall));

// can't start with a big message
while (messages[0][0].image) {
  messages = shuffle(messages);
}

messages.splice(nMessages - 1, messages.length - nMessages);

// Image assesment variables
var MAX_QUIZ = 5;
var MIN_QUIZ = 3;
var imageAssesmentStep = 1;
var nStartGuideMessages = imagesAssesment.guideMessages.length;
var nUserMessages = imagesAssesment.userMessages.length;
var nQuizMessages = randomNumber(MIN_QUIZ, MAX_QUIZ);
var imageOptions = shuffle(imagesAssesment.quizOptions);
var quizImageIds = shuffle([1, 2 , 3 , 4 , 5, 6 , 7, 8 , 9]); 

// Final quiz variables
var MAX_QUESTIONS = 7;
var MIN_QUESTIONS = 5;
var finalQuizStep = 1;
var nFinalQuizStartMessages = finalQuestions.introMessages.length;
var nQuestions = randomNumber(MIN_QUESTIONS, MAX_QUESTIONS);
var currentIndex = 0;
var blockImage = false;
var finalQuiz = shuffle(finalQuestions.questions);

var finalWordsIndex = 0;
var creditsIndex = 0;

var MAX_FLASH_IMAGES = 7;
var nImagesFlashed = 0;
var flashImagesInterval;

function addMessage() {

  document.getElementById('textInput').innerHTML = '';

  // User messages: start part
  if (step1CurrentIndex < nMessages) {

    var messageLength = messages[step1CurrentIndex].length;
    var message = messages[step1CurrentIndex][innerIndex];
  
    if (message.image) {
      document.getElementById('chatBox').innerHTML = '';
      addBigMessage(message);
      innerIndex++;
    } else {

      if (innerIndex === 0) {
        document.getElementById('chatBox').innerHTML = '';
      }

      addSmallMessage(message);
      innerIndex++;

      if (innerIndex >= messageLength) {
        innerIndex = 0;
        step1CurrentIndex++;
      }
    }
  // Image assesment: second part
  } else if (imageAssesmentStep <= 3) {
    if (imageAssesmentStep === 1) {

      if (currentIndex === 0) {
        document.getElementById('chatBox').innerHTML = '';
      }

      addGuideMessage(imagesAssesment.guideMessages[currentIndex]);
      
      currentIndex++;
      if (currentIndex >= nStartGuideMessages) {
        imageAssesmentStep++;
        currentIndex = 0;
      }
    } else if (imageAssesmentStep === 2) {
      addSmallMessage({ text: imagesAssesment.userMessages[currentIndex], time: '10:45'});
      
      currentIndex++;
      if (currentIndex >= nUserMessages) {
        imageAssesmentStep++;
        currentIndex = 0;
      }
    } else if (imageAssesmentStep === 3) {
      document.getElementById('chatBox').removeEventListener('click', addMessage, false);
      addGuideMessageWithImage(imageOptions[currentIndex], currentIndex + 1);
      
      currentIndex++;
      if (currentIndex >= nQuizMessages) {
        imageAssesmentStep++;
        currentIndex = 0;
        document.getElementById('chatBox').addEventListener('click', addMessage, false);
      }
    }
  } else {

    if (finalQuizStep === 1) {

      setTimeout(function() {
        // doom timer
        console.log('Countdown for doom!!!');
        // weird things start happening

        setInterval(function () {
          flashImagesInterval = flashImage();
        }, 3000);
      }, 60000)

      addGuideMessage(finalQuestions.introMessages[currentIndex]);
      
      currentIndex++;
      if (currentIndex >= nFinalQuizStartMessages) {
        finalQuizStep++;
        currentIndex = 0;
      }
    } else if (finalQuizStep === 2) {
      document.getElementById('chatBox').removeEventListener('click', addMessage, false);
      var question = finalQuiz[currentIndex];
      addGuideMessageWithOptions(question.question, question.answers);
      
      currentIndex++;
      if (currentIndex >= nQuestions) {
        finalQuizStep++;
        currentIndex = 0;
      }
    }
  }
}

function inactivityTime() {
  var time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onclick = resetTimer;
  function showIdleScreen() {
    document.getElementById('idleScreen').classList.remove('hide');
  }
  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(showIdleScreen, 60000)
  }
};

document.getElementById('startButton').addEventListener('click', startGame, false);
document.getElementById('welcome').addEventListener('click', openChatBox, false);
document.getElementById('chatBox').addEventListener('click', addMessage, false);
document.getElementById('hideIdleScreen').addEventListener('click', hideIdleScreen, false);