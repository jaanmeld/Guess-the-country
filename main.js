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
  const countryData = {
    name: name,
    flagUrl,
    capital: capital,
    region: region,
    timezone: timezone,
    coatOfArms: coatOfArms,
  };

  return countryData;
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


  function guess() {
    let intent = '';
    textBox.addEventListener('keydown', function(event) {
      intent = event.target.value;
    });

    function correct() {
      const answer = document.createElement('div');
      answer.classList.add('answer');
      answer.innerText = countryData.name;
      main.insertBefore(answer, flags);
      giveUp.disabled = true;
      helpBtn.disabled = true;
      button.disabled = true;
    }

    button.addEventListener('click', () => {
      if (intent === countryData.name) {
        correct();
        goodBoy();
      }
      textBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          console.log('Enter key pressed');
          console.log(event);
        }
      });
      // console.log(intent, countryData.name);
    });

  }
  guess();

  function help() {
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
  help();


  function givingUp() {
    giveUp.addEventListener('click', () => {          // How to use correct() instead??
      const answer = document.createElement('div');
      answer.classList.add('answer');
      answer.innerText = countryData.name;
      main.insertBefore(answer, flags);
      giveUp.disabled = true;
      helpBtn.disabled = true;
      button.disabled = true;
    });

  }
  givingUp();

  next.addEventListener('click', function() {
    if (button.disabled == true) {
      location.reload();
    }
    else {
      next.disabled = true;
    }
  });

  async function goodBoy() {
    const randomDogs = await fetch('https://dog.ceo/api/breeds/image/random');
    const dogUrl = await randomDogs.json();

    dog.innerHTML = '<strong>Great guess!</strong><br>Here is a random picure of a good boy for you!<br><img src="' + dogUrl.message + '" alt="Good boy!">';
    console.log(dogUrl.message);
  }
}


async function buildPage() {
  const countryData = await getCountries();
 createHtml(countryData);
}

buildPage();
