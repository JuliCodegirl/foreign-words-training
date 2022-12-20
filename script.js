"use strict";

const flipCard = document.querySelector('.flip-card');

flipCard.addEventListener('click', function () {
  this.classList.toggle('active');
});

const engWords = ['hippopotamus', 'rhinoceros', 'antelope', 'vulture', 'ostrich', 'lion'];
const rusWords = ['бегемот', 'носорог', 'антилопа', 'гриф', 'страус', 'лев'];
const examples = [
  'A hippopotamus is a large mammal native to Africa.',
  'While the black rhinoceros has 84 chromosomes, all other rhinoceros species have 82 chromosomes.',
  'Antelopes are noted for their beauty, grace, and speed in running.',
  'A vulture is a bird with a rather dark appearance.',
  'An ostrich is a very large bird from Africa that has a long neck and long legs.',
  'The lion is a large cat native to Africa and India.'
];

const engWord = document.querySelector('#card-front h1');
const rusWord = document.querySelector('#card-back h1');
const example = document.querySelector('#card-back span');
let currentWord = +document.querySelector('#current-word').textContent;
const currentWordText = document.querySelector('#current-word');
const totalWord = +document.querySelector('#total-word').textContent;
const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');
const progress = document.querySelector('#words-progress');

function addCardInfo(i) {
  engWord.textContent = engWords[i];
  rusWord.textContent = rusWords[i];
  example.textContent = examples[i];
  currentWordText.textContent = currentWord;
};

function makeProgress(i) {
  return progress.value = (i * 100) / 6;
};

addCardInfo(0);
const startProgress = makeProgress(0);

function controlButtons(currentWord) {
  if (currentWord === totalWord) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }

  if (currentWord === 1) {
    backButton.disabled = true;
  } else {
    backButton.disabled = false;
  }
  // Более продвинутая версия написанного выше:
  // nextButton.disabled = currentWord === totalWord;
  // backButton.disabled = currentWord === 1;
};

function goToNextCard() {
  if (currentWord < totalWord) {
    currentWord++;
    addCardInfo(currentWord - 1);
    makeProgress(currentWord);
    controlButtons(currentWord);
  }
};

function goToPreviousCard() {
  if (currentWord >= 1) {
    currentWord--;
    
    addCardInfo(currentWord - 1);
    makeProgress(currentWord);
    controlButtons(currentWord);
  }
};

nextButton.addEventListener('click', goToNextCard);
backButton.addEventListener('click', goToPreviousCard);

const examButton = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const studyCardsMode = document.querySelector('.study-cards');
const studyModeText = document.querySelector('#study-mode');
const examModeText = document.querySelector('#exam-mode');

function addExamCards() {

  const fragment = new DocumentFragment();
  const allWords = engWords.concat(rusWords);

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  };
  shuffle(allWords);

  allWords.forEach((item) => {
    const card = document.createElement('div');
    card.textContent = item;
    card.classList.add('card');
    fragment.append(card);
  });

  examCards.append(fragment);
};

function runningTimer() {
  let clock = document.querySelector('#time');
  let minutes = clock.textContent.split(':')[0];
  let seconds = clock.textContent.split(":")[1];

  const secondsId = setInterval(() => {
    seconds++;
    clock.textContent = `${minutes}:${seconds}`;
    
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    if (seconds < 10) {
      clock.textContent = `${minutes}:0${seconds}`;
    } 
    
  }, 1000);
};

examButton.addEventListener('click', function () {
  studyCardsMode.classList.add('hidden');
  studyModeText.classList.add('hidden');
  examModeText.classList.remove('hidden');

  addExamCards();
  runningTimer();
});

let firstWord = null;
let secondWord = null;
let indexOfFirstWord = null;
let indexOfSecondWord = null;
let i = 0;

examCards.addEventListener('click', function (event) {
  const card = event.target.closest('.card');

  if (card && firstWord === null) {
    card.classList.add('correct');
    firstWord = card;

  } else if (card && firstWord !== null) {
    secondWord = card;

    if (engWords.includes(firstWord.textContent)) {
      indexOfFirstWord = engWords.indexOf(firstWord.textContent);
      indexOfSecondWord = rusWords.indexOf(secondWord.textContent);
    } else if (rusWords.includes(firstWord.textContent)) {
      indexOfFirstWord = rusWords.indexOf(firstWord.textContent);
      indexOfSecondWord = engWords.indexOf(secondWord.textContent);
    }

    if (indexOfFirstWord === indexOfSecondWord) {
      secondWord.classList.add('correct');
      secondWord.classList.add('fade-out');
      firstWord.classList.add('fade-out');
      i++;     
    } else {
      secondWord.classList.add('wrong');
      
      const cards = document.querySelectorAll('.card');
      for (let card of cards) {
        setTimeout(() => {
          card.classList.remove('correct');
          card.classList.remove('wrong');
        }, 500);
      }
    }

    firstWord = null;
    secondWord = null;
  }

  if (i === engWords.length) {
    setTimeout(() => {
      alert('Вы успешно прошли тест!');
    }, 1500);
  };
});
