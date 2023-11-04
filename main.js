function createRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min) + min);
  return randomNumber;
}

async function getCountries() {
  const countries = await fetch('https://restcountries.com/v3.1/independent?status=true');
  const data = await countries.json();
  const max = data.length;
  const countryNr = createRandomNumber(0, max);
  const country = data[countryNr];
  const flagUrl = country.flags.png;
  const name = country.name.common;
  const capital = country.capital[0];
  const timezone = country.timezones[0];
  const region = country.region;
  const coatOfArms = country.coatOfArms.png;
  const countryData = { name,
    flagUrl,
    capital: capital,
    region: region,
    timezone: timezone,
    coatOfArms: coatOfArms,
  };

  return countryData;
}


function correct({ main, countryData, flags, giveUp, helpBtn, button}) {
  const answer = document.createElement('div');
  answer.classList.add('answer');
  answer.innerText = countryData.name;
  main.insertBefore(answer, flags);
  giveUp.disabled = true;
  helpBtn.disabled = true;
  button.disabled = true;
}

async function guess({ textBox, button, countryData, flags, giveUp, helpBtn, main }) {
  let intent = '';
  textBox.addEventListener('keydown', function(event) {
    intent = event.target.value;
  });


  button.addEventListener('click', async () => {
    console.log(intent);
    if (intent === countryData.name) {
      correct({ main, countryData, flags, giveUp, helpBtn, button });
      await goodBoy();
    }
    // console.log(intent, countryData.name);
  });
  textBox.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && intent === countryData.name) {
      correct({ main, countryData, flags, giveUp, helpBtn, button });
      await goodBoy();
      console.log('Enter key pressed');
      console.log(event);
    }
  });
}

async function goodBoy() {
  const randomDogs = await fetch('https://dog.ceo/api/breeds/image/random');
  const dogUrl = await randomDogs.json();
  const dog = document.querySelector('.dog');  // New 'dog' just for this function
  const greatGuess = document.createElement('strong');
  greatGuess.innerText = 'Great guess!';
  dog.appendChild(greatGuess);
  const br = document.createElement('br');
  dog.append(br);
  const dogPic = document.createElement('img');
  dogPic.src = dogUrl.message;
  dog.appendChild(dogPic);
  // dog.innerHTML = '<strong>Great guess!</strong><br>Here is a random picure of a good boy for you!<br><img src="' + dogUrl.message + '" alt="Good boy!">';
  // console.log(dogUrl.message);
}

function help({ helpBtn, clues, clue1, clue2, clue3 }) {
  let i = 1;
  helpBtn.addEventListener('click', () => {
    i == 1 && clues.append(clue1);
    i == 2 && clues.append(clue2);
    i == 3 && clues.append(clue3);
    i++;
    if (i > 3) {
      helpBtn.disabled = true;
    }
  });
}

function givingUp({main, countryData, flags, giveUp, helpBtn, button }) {
  giveUp.addEventListener('click', () => {
    correct({ main, countryData, flags, giveUp, helpBtn, button});     // How to use correct() instead??
  });

}



function createHtml(countryData) {
  const root = document.getElementById('root');
  const main = document.createElement('div');
  main.classList.add('main');
  root.append(main);
  const flags = document.createElement('div');
  flags.classList.add('flags');
  main.append(flags);
  flags.innerHTML = '<img src="' + countryData.flagUrl + '" alt="What about this flag?">';

  const textBox = document.createElement('input');
  textBox.classList.add('textBox');
  textBox.id = 'textBox';
  main.append(textBox);

  const button = document.createElement('button');
  button.classList.add('btn');
  button.innerText = 'Send';
  main.append(button);

  const helpBtn = document.createElement('button');
  helpBtn.classList.add('btn', 'helpBtn');
  helpBtn.innerText = 'Help';
  main.append(helpBtn);

  const giveUp = document.createElement('button');
  giveUp.classList.add('btn');
  giveUp.innerText = 'Give Up';
  main.append(giveUp);

  const clues = document.createElement('ul');
  clues.classList.add('ul');
  main.append(clues);

  const clue1 = document.createElement('li');
  clue1.classList.add('clue');
  clue1.innerText = 'Timezone of the country is ' + countryData.timezone;

  const clue2 = document.createElement('li');
  clue2.classList.add('clue');
  clue2.innerText = 'Country is located in ' + countryData.region;

  const clue3 = document.createElement('li');
  clue3.classList.add('clue');
  clue3.innerText = 'The capital of the country is ' + countryData.capital;

  const dog = document.createElement('div');
  dog.classList.add('dog');
  main.append(dog);

  const next = document.createElement('button');
  next.classList.add('btn');
  next.innerText = 'Next';
  main.append(next);


  next.addEventListener('click', function() {
    if (button.disabled == true) {
      location.reload();
    }
    else {
      next.disabled = true;
    }
  });

  const output = { textBox, button, flags, giveUp, helpBtn, main, clues, clue1, clue2, clue3 };
  return output;
}


async function buildPage() {
  const countryData = await getCountries();
  const {textBox, button, flags, giveUp, helpBtn, main, clues, clue1, clue2, clue3 } =  createHtml(countryData);  // destructuring

  guess({textBox, button, countryData, flags, giveUp, helpBtn, main });
  help({ helpBtn, clues, clue1, clue2, clue3 });
  givingUp({main, countryData, flags, giveUp, helpBtn, button });
  console.log(countryData.name);
}
buildPage();





// Object.keys(obj), Object.values(obj), Object.entries(obj)
