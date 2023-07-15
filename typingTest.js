// Fetching HTML Elements
const sentenceElement = document.getElementById('sentence');
const inputElement = document.getElementById('input');
const startButton = document.getElementById('start');
const resultElement = document.getElementById('result');
const timerElement = document.getElementById('timer');

let sentence = '';
let typedText = '';
let startTime = 0;
let endTime = 0;
let timer = null; // Variable to hold the timer

// Function to fetch random sentence
async function fetchSentence() {
  let sentenceArray = [];
  while (sentenceArray.join(' ').split(' ').length < 20) {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    sentenceArray.push(data.content);
  }
  sentence = sentenceArray.join(' ');
  sentenceElement.textContent = sentence;
}


// Event when start button is clicked
startButton.addEventListener('click', () => {
  inputElement.disabled = false;
  inputElement.value = '';
  typedText = '';
  fetchSentence();
  startTime = new Date();
  // Start timer
  timer = setInterval(() => {
    const now = new Date();
    const timeTaken = Math.floor((now - startTime) / 1000);
    timerElement.textContent = `Time: ${timeTaken}s`;
  }, 1000);
});

// Event when user types in the input field
inputElement.addEventListener('input', () => {
  typedText = inputElement.value;
  checkLetter(typedText, typedText.length - 1);
  if (typedText.trim() === sentence.trim()) {
    inputElement.disabled = true;
    endTime = new Date();
    calculateResult();
    clearInterval(timer); // Clear the timer
  }
});

// Function to check each typed letter
function checkLetter(typedText, typedPosition) {
  const sentenceArray = sentence.split('');

  for (let i = 0; i <= typedPosition; i++) {
    if (typedText[i] === sentenceArray[i]) {
      sentenceArray[i] = `<span class="correct">${typedText[i]}</span>`;
    } else {
      sentenceArray[i] = `<span class="wrong">${typedText[i]}</span>`;
    }
  }
  sentenceElement.innerHTML = sentenceArray.join('');  // replace the original text with the marked up text
}

// Event when user types in the input field
inputElement.addEventListener('input', () => {
  typedText = inputElement.value;
  checkLetter(typedText, typedText.length - 1);
  if (typedText.trim() === sentence.trim()) {
    inputElement.disabled = true;
    endTime = new Date();
    calculateResult();
    clearInterval(timer); // Clear the timer
  }
});


// Function to calculate the result
function calculateResult() {
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const words = typedText.split(' ').length;
  const wordsPerMinute = Math.round((words / timeTaken) * 60);
  const mistakes = calculateMistakes();
  resultElement.textContent = `Words per minute: ${wordsPerMinute}, Mistakes: ${mistakes}`;
}

// Function to calculate mistakes
function calculateMistakes() {
  const sentenceWords = sentence.trim().split(' ');
  const typedWords = typedText.split(' ');
  let mistakes = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] !== sentenceWords[i]) {
      mistakes++;
    }
  }
  return mistakes;
}
