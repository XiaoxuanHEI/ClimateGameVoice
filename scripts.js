let userId = "";
let startTime = "";
let endTime = "";
let timeSpent = "";
let gameData = [];

let timeSum = 0;
let timeAvg = 0;
let num = 0;

let effort = 100;
let carbon = 34.2;

let flag = false;


function selectLanguage() {
  var languageSelect = document.getElementById('languageSelect');
  var selectedLanguage = languageSelect.value;
  fetch(`${selectedLanguage}.html`)
    .then(response => response.text())
    .then(htmlContent => {
      document.getElementById('container').innerHTML = htmlContent;
    })
    .catch(error => console.error('Error loading language file:', error));
}

function start() {
  // Get user's name
  userId = document.getElementById("nameInput").value;
  document.getElementById('intro').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function updateProgressBar() {
  document.getElementById('effortNum').innerText = effort;
  document.getElementById('carbonNum').innerText = carbon.toFixed(1);

  document.getElementById('effortFiller').style.width = effort + '%';
  document.getElementById('carbonFiller').style.width = carbon / 34.2 * 100 + '%';
}
function checkStatus() {
  carbon = parseFloat(carbon.toFixed(1));
  if (carbon <= 24.3 && carbon > 16.2) {
    document.getElementById('carbonFiller').style.backgroundColor = 'rgb(240, 141, 72)';
    document.getElementById('darkCloud3').style.display = 'none';
    document.getElementById('whiteCloud1').style.display = 'block';
  }
  if (carbon <= 16.2 && carbon > 8.1) {
    document.getElementById('carbonFiller').style.backgroundColor = 'rgb(253, 235, 83)';
    document.getElementById('darkCloud2').style.display = 'none';
    document.getElementById('whiteCloud2').style.display = 'block';
  }
  if (carbon <= 8.1 && carbon > 0) {
    document.getElementById('carbonFiller').style.backgroundColor = 'rgb(162, 201, 74)';
    document.getElementById('darkCloud1').style.display = 'none';
    document.getElementById('sun').style.display = 'block';
  }
  if (carbon <= 0) {
    document.getElementById('win').style.display = 'block';
  } else if (num >= 12) {
    document.getElementById('end').style.display = 'block';
  }
}

function shuffleOptions(questionId) {
  const optionsContainer = document.getElementById(questionId).querySelector('.options');
  const options = Array.from(optionsContainer.children);
  options.sort(() => Math.random() - 0.5);
  options.forEach(option => {
    optionsContainer.appendChild(option);
  });
}

function showQuestion(questionId) {
  const question = document.getElementById(questionId);
  question.style.display = 'block';
  shuffleOptions(questionId);
}

function saveInteraction() {
  const interactionData = {
    userId: userId,
    gameData: gameData,
    effort: effort,
    CO2: carbon,
    timeAvg: parseFloat((timeSum / num).toFixed(3))
  };

  // Convert interaction data to JSON string
  const interactionJson = JSON.stringify(interactionData, null, 2);

  // Create Blob object
  const blob = new Blob([interactionJson], { type: 'application/json' });

  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);

  // Set download file name
  downloadLink.download = `${userId}_climate.json`;

  // Append download link to the body and simulate click
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Remove download link
  document.body.removeChild(downloadLink);

  document.getElementById('win').style.display = 'none';
  document.getElementById('end').style.display = 'none';
  document.getElementById('lose').style.display = 'none';
}


function addData(questionId, choice) {
  endTime = new Date();
  timeSpent = (endTime - startTime) / 1000;
  timeSum = timeSum + timeSpent;
  num += 1;
  answer = {
    no: num,
    question: questionId,
    choice: choice,
    startTime: startTime.toLocaleString(),
    endTime: endTime.toLocaleString(),
    timeSpent: timeSpent,
  };
  gameData.push(answer);
}


function clickCoal() {
  startTime = new Date();
  showQuestion('coalQuiz');
}

function checkCoalAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="coalAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'coalA') {
      effort -= 0;
      carbon += 2.4;
      document.getElementById('coalQuiz').style.display = 'none';
      document.getElementById('coal').style.display = 'none';
      document.getElementById('coalA').style.display = 'block';
      // createMessage('Continue d’explorer des options plus vertes. Il y a du potentiel pour plus.')
      playAudio("coalA");
      flag = true;
    } else if (userAnswer === 'coalB') {
      if (effort >= 5) {
        effort -= 5;
        carbon += 1.8;
        document.getElementById('coalQuiz').style.display = 'none';
        document.getElementById('coal').style.display = 'none';
        document.getElementById('coalB').style.display = 'block';
        // createMessage('Tu es clairement sur la bonne voie pour réduire les émissions de CO2, continue de renforcer cet engagement.')
        playAudio("coalB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'coalC') {
      if (effort >= 8) {
        effort -= 8;
        carbon += 0.1;
        document.getElementById('coalQuiz').style.display = 'none';
        document.getElementById('coal').style.display = 'none';
        document.getElementById('coalC').style.display = 'block';
        // createMessage('Bravo! Tu prends la bonne décision pour réduire les émissions de CO2.')
        playAudio("coalC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('coal', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="coalAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}

function clickCar() {
  startTime = new Date();
  showQuestion('carQuiz');
}

function checkCarAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="carAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;
    if (userAnswer === 'carA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 1.8;
        document.getElementById('carQuiz').style.display = 'none';
        document.getElementById('car').style.display = 'none';
        document.getElementById('carA').style.display = 'block';
        // createMessage('Belle décision! Avec un peu plus d’effort, tu réduiras encore plus la consommation de CO2.');
        playAudio("carA");
        flag = true;
      } else {
        document.getElementById('carQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'carB') {
      if (effort >= 10) {
        effort -= 10;
        carbon += 0.5;
        document.getElementById('carQuiz').style.display = 'none';
        document.getElementById('car').style.display = 'none';
        document.getElementById('carB').style.display = 'block';
        // createMessage('Les actions comptent, mais visons des stratégies plus ambitieuses pour le climat.');
        playAudio("carB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'carC') {
      if (effort >= 10) {
        effort -= 10;
        carbon -= 4.6;
        document.getElementById('carQuiz').style.display = 'none';
        document.getElementById('car').style.display = 'none';
        document.getElementById('carC').style.display = 'block';
        // createMessage('Félicitations tu fais le bon choix pour un avenir plus vert!');
        playAudio("carC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('car', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="carAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}


function clickBuild() {
  startTime = new Date();
  showQuestion('buildQuiz');
}

function checkBuildAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="buildAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'buildA') {
      if (effort >= 3) {
        effort -= 3;
        carbon -= 0.6;
        document.getElementById('buildQuiz').style.display = 'none';
        document.getElementById('build').style.display = 'none';
        document.getElementById('buildA').style.display = 'block';
        // createMessage('Excellente initiative vers la réduction des émissions! Avec encore plus d’efforts, l’impact sera considérable.');
        playAudio("buildA");
        flag = true;
      } else {
        document.getElementById('buildQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'buildB') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 0;
        document.getElementById('buildQuiz').style.display = 'none';
        document.getElementById('build').style.display = 'none';
        document.getElementById('buildB').style.display = 'block';
        // createMessage('Bien, mais nous pouvons faire plus pour notre Terre. Continuons de progresser.');
        playAudio("buildB");
        flag = true;
      }
      else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'buildC') {
      if (effort >= 8) {
        effort -= 8;
        carbon -= 1.7;
        document.getElementById('buildQuiz').style.display = 'none';
        document.getElementById('build').style.display = 'none';
        document.getElementById('buildC').style.display = 'block';
        // createMessage('Continue comme ça, tes choix pour diminuer les émissions sont exceptionnels!');
        playAudio("buildC");
        flag = true;
      }
      else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('build', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="buildAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}


function clickRecy() {
  startTime = new Date();
  showQuestion('recyQuiz');
}

function checkRecyAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="recyAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'recyA') {
      if (effort >= 1) {
        effort -= 1;
        carbon -= 0;
        document.getElementById('recyQuiz').style.display = 'none';
        document.getElementById('recy').style.display = 'none';
        document.getElementById('recyA').style.display = 'block';
        // createMessage('Chaque petit pas compte, mais soyons plus audacieux dans nos choix écologiques.');
        playAudio("recyA");
        flag = true;
      } else {
        document.getElementById('recyQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'recyB') {
      if (effort >= 2) {
        effort -= 2;
        carbon -= 0.1;
        document.getElementById('recyQuiz').style.display = 'none';
        document.getElementById('recy').style.display = 'none';
        document.getElementById('recyB').style.display = 'block';
        // createMessage('Ta décision contribue déjà à un avenir plus vert. Poursuis tes efforts pour maximiser cette contribution.');
        playAudio("recyB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'recyC') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 1.4;
        document.getElementById('recyQuiz').style.display = 'none';
        document.getElementById('recy').style.display = 'none';
        document.getElementById('recyC').style.display = 'block';
        // createMessage('Impressionnant! Tes décisions en faveur de l’environnement vont porter leurs fruits!');
        playAudio("recyC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('recy', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="recyAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}



function clickElec() {
  startTime = new Date();
  showQuestion('elecQuiz');
}

function checkElecAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="elecAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'elecA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 0;
        document.getElementById('elecQuiz').style.display = 'none';
        document.getElementById('elec').style.display = 'none';
        document.getElementById('elecA').style.display = 'block';
        // createMessage('C’est un début, mais adoptons des mesures plus fortes!');
        playAudio("elecA");
        flag = true;
      } else {
        document.getElementById('elecQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'elecB') {
      if (effort >= 10) {
        effort -= 10;
        carbon -= 1.2;
        document.getElementById('elecQuiz').style.display = 'none';
        document.getElementById('elec').style.display = 'none';
        document.getElementById('elecB').style.display = 'block';
        // createMessage('C’est un grand pas pour la réduction des émissions de CO2! Maintiens ce cap et cherche à optimiser davantage tes actions.');
        playAudio("elecB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'elecC') {
      if (effort >= 15) {
        effort -= 15;
        carbon -= 5.4;
        document.getElementById('elecQuiz').style.display = 'none';
        document.getElementById('elec').style.display = 'none';
        document.getElementById('elecC').style.display = 'block';
        // createMessage('Un grand bravo pour cette belle décision envers la réduction des émissions!');
        playAudio("elecC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('elec', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="elecAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}

function clickPlane() {
  startTime = new Date();
  showQuestion('planeQuiz');
}

function checkPlaneAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="planeAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'planeA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 0.4;
        document.getElementById('planeQuiz').style.display = 'none';
        document.getElementById('plane').style.display = 'none';
        document.getElementById('planeA').style.display = 'block';
        // createMessage('Ta décision montre ton engagement envers un environnement plus sain. Continues d’innover pour plus d’efficacité.');
        playAudio("planeA");
        flag = true;
      } else {
        document.getElementById('planeQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'planeB') {
      if (effort >= 7) {
        effort -= 7;
        carbon -= 1.8;
        document.getElementById('planeQuiz').style.display = 'none';
        document.getElementById('plane').style.display = 'none';
        document.getElementById('planeB').style.display = 'block';
        // createMessage('Félicitations pour avoir fait ce choix essentiel pour l’environnement!');
        playAudio("planeB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'planeC') {
      if (effort >= 10) {
        effort -= 10;
        carbon += 1.5;
        document.getElementById('planeQuiz').style.display = 'none';
        document.getElementById('plane').style.display = 'none';
        document.getElementById('planeC').style.display = 'block';
        // createMessage('Face à l’urgence climatique, il est temps d’intensifier nos actions écologiques');
        playAudio("planeC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('plane', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="planeAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}

function clickOcean() {
  startTime = new Date();
  showQuestion('oceanQuiz');
}

function checkOceanAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="oceanAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'oceanA') {
      if (effort >= 2) {
        effort -= 2;
        carbon -= 0.2;
        document.getElementById('oceanQuiz').style.display = 'none';
        document.getElementById('ocean').style.display = 'none';
        document.getElementById('oceanA').style.display = 'block';
        // createMessage('Bons débuts, mais visons une réduction plus significative des émissions de CO2.');
        playAudio("oceanA");
        flag = true;
      } else {
        document.getElementById('oceanQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'oceanB') {
      if (effort >= 4) {
        effort -= 4;
        carbon -= 1.5;
        document.getElementById('oceanQuiz').style.display = 'none';
        document.getElementById('ocean').style.display = 'none';
        document.getElementById('oceanB').style.display = 'block';
        // createMessage('Tu es sur le bon chemin vers un avenir durable. Continues d’explorer de nouvelles façons de minimiser les émissions.');
        playAudio("oceanB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'oceanC') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 3.8;
        document.getElementById('oceanQuiz').style.display = 'none';
        document.getElementById('ocean').style.display = 'none';
        document.getElementById('oceanC').style.display = 'block';
        // createMessage('Félicitations! Ce n’est que le début d’une série de succès écologiques.')
        playAudio("oceanC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('ocean', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="oceanAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}

function clickPpl() {
  startTime = new Date();
  showQuestion('pplQuiz');
}

function checkPplAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="pplAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'pplA') {
      if (effort >= 2) {
        effort -= 2;
        carbon -= 0;
        document.getElementById('pplQuiz').style.display = 'none';
        document.getElementById('ppl').style.display = 'none';
        document.getElementById('pplA').style.display = 'block';
        // createMessage('Tu es sur le chemin, mais il y a encore du travail pour un impact plus vert.');
        playAudio("pplA");
        flag = true;
      } else {
        document.getElementById('pplQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'pplB') {
      if (effort >= 3) {
        effort -= 3;
        carbon -= 0.2;
        document.getElementById('pplQuiz').style.display = 'none';
        document.getElementById('ppl').style.display = 'none';
        document.getElementById('pplB').style.display = 'block';
        // createMessage('Tu as pris un bon départ vers la diminution des émissions de CO2. Affines maintenant tes stratégies pour un impact encore plus grand.')
        playAudio("pplB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'pplC') {
      if (effort >= 4) {
        effort -= 4;
        carbon -= 0.8;
        document.getElementById('pplQuiz').style.display = 'none';
        document.getElementById('ppl').style.display = 'none';
        document.getElementById('pplC').style.display = 'block';
        // createMessage('Chapeau! Tes décisions pour un avenir durable vont nous mener loin.')
        playAudio("pplC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('ppl', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="pplAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}

function clickUrban() {
  startTime = new Date();
  showQuestion('urbanQuiz');
}

function checkUrbanAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="urbanAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'urbanA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 0.3;
        document.getElementById('urbanQuiz').style.display = 'none';
        document.getElementById('urban').style.display = 'none';
        document.getElementById('urbanA').style.display = 'block';
        // createMessage('Ton choix a un impact positif sur l’environnement. Visons maintenant des réductions encore plus ambitieuses.')
        playAudio("urbanA");
        flag = true;
      } else {
        document.getElementById('urbanQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'urbanB') {
      if (effort >= 8) {
        effort -= 8;
        carbon -= 1.5;
        document.getElementById('urbanQuiz').style.display = 'none';
        document.getElementById('urban').style.display = 'none';
        document.getElementById('urbanB').style.display = 'block';
        // createMessage('Belle décision! Continue de briller dans tes efforts pour un monde plus propre.')
        playAudio("urbanB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'urbanC') {
      if (effort >= 8) {
        effort -= 8;
        carbon -= 0.8;
        document.getElementById('urbanQuiz').style.display = 'none';
        document.getElementById('urban').style.display = 'none';
        document.getElementById('urbanC').style.display = 'block';
        // createMessage('Reconnaître l’importance de réduire les émissions est crucial, mais n’oublie pas, il y a toujours moyen de faire mieux.');
        playAudio("urbanC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('urban', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="urbanAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}


function clickIndu() {
  startTime = new Date();
  showQuestion('induQuiz');
}

function checkInduAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="induAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'induA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 2.4;
        document.getElementById('induQuiz').style.display = 'none';
        document.getElementById('indu').style.display = 'none';
        document.getElementById('induA').style.display = 'block';
        // createMessage('Tu as pris un virage prometteur pour l’environnement. Continues de te concentrer sur ces avancées et de les amplifier.');
        playAudio("induA");
        flag = true;
      } else {
        document.getElementById('induQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'induB') {
      if (effort >= 10) {
        effort -= 10;
        carbon -= 0;
        document.getElementById('induQuiz').style.display = 'none';
        document.getElementById('indu').style.display = 'none';
        document.getElementById('induB').style.display = 'block';
        // createMessage('Encourageant, mais il est temps d’intensifier nos actions écologiques.');
        playAudio("induB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'induC') {
      if (effort >= 10) {
        effort -= 10;
        carbon -= 5.6;
        document.getElementById('induQuiz').style.display = 'none';
        document.getElementById('indu').style.display = 'none';
        document.getElementById('induC').style.display = 'block';
        // createMessage('Bravo! Ton engagement envers la réduction des émissions de CO2 est inspirant.');
        playAudio("induC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('indu', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="induAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}


function clickDefo() {
  startTime = new Date();
  showQuestion('defoQuiz');
}

function checkDefoAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="defoAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'defoA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 0.8;
        document.getElementById('defoQuiz').style.display = 'none';
        document.getElementById('defo').style.display = 'none';
        document.getElementById('defoA').style.display = 'block';
        // createMessage('Des choix intéressants, mais poussons plus loin pour le bien de la planète.');
        playAudio("defoA");
        flag = true;
      } else {
        document.getElementById('defoQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'defoB') {
      if (effort >= 8) {
        effort -= 8;
        carbon -= 2.2;
        document.getElementById('defoQuiz').style.display = 'none';
        document.getElementById('defo').style.display = 'none';
        document.getElementById('defoB').style.display = 'block';
        // createMessage('Opter pour la réduction des émissions témoigne de ta vision. Poursuis ce chemin et développes tes initiatives écologiques.');
        playAudio("defoB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'defoC') {
      if (effort >= 10) {
        effort -= 10;
        carbon -= 4.5;
        document.getElementById('defoQuiz').style.display = 'none';
        document.getElementById('defo').style.display = 'none';
        document.getElementById('defoC').style.display = 'block';
        // createMessage('Quel triomphe! Félicitations pour cette magnifique décision écologique.');
        playAudio("defoC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('defo', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="defoAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}

function clickAgri() {
  startTime = new Date();
  showQuestion('agriQuiz');
}

function checkAgriAnswer() {
  flag = false;
  const selectedAnswer = document.querySelector('input[name="agriAnswer"]:checked');

  if (selectedAnswer) {
    const userAnswer = selectedAnswer.value;

    if (userAnswer === 'agriA') {
      if (effort >= 5) {
        effort -= 5;
        carbon -= 0.7;
        document.getElementById('agriQuiz').style.display = 'none';
        document.getElementById('agri').style.display = 'none';
        document.getElementById('agriA').style.display = 'block';
        // createMessage('Tes efforts sont appréciés, mais amplifions notre impact sur la réduction du CO2.');
        playAudio("agriA");
        flag = true;
      } else {
        document.getElementById('agriQuiz').style.display = 'none';
        document.getElementById('lose').style.display = 'block';
        playAudio("lose");
      }
    } else if (userAnswer === 'agriB') {
      if (effort >= 8) {
        effort -= 8;
        carbon -= 1.5;
        document.getElementById('agriQuiz').style.display = 'none';
        document.getElementById('agri').style.display = 'none';
        document.getElementById('agriB').style.display = 'block';
        // createMessage('C’est un pas significatif pour la planète. Explores et améliores continuellement tes efforts en ce sens.');
        playAudio("agriB");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    } else if (userAnswer === 'agriC') {
      if (effort >= 10) {
        effort -= 10;
        carbon -= 3.2;
        document.getElementById('agriQuiz').style.display = 'none';
        document.getElementById('agri').style.display = 'none';
        document.getElementById('agriC').style.display = 'block';
        // createMessage('Félicitations! Ton choix est un vrai modèle à suivre.')
        playAudio("agriC");
        flag = true;
      } else {
        alert('Vous n’avez pas assez de points d’effort pour cette option. Veuillez choisir une autre réponse.');
      }
    }

    if (flag) {
      addData('agri', userAnswer);
      updateProgressBar();
      checkStatus();
    }

    document.querySelectorAll('input[name="agriAnswer"]').forEach(option => option.checked = false);
  } else {
    alert('Veuillez sélectionner une réponse avant de la soumettre.');
  }
}


function createMessage(message) {
  var modal = document.createElement('div');
  modal.classList.add('quiz-popup');
  modal.style.display = 'block';

  var messageParagraph = document.createElement('p');
  messageParagraph.textContent = message;

  var closeButton = document.createElement('button');
  closeButton.classList.add('submit-button');
  closeButton.innerHTML = 'Continue';
  closeButton.addEventListener('click', function () {
    document.body.removeChild(modal); 
  });


  modal.appendChild(messageParagraph);
  modal.appendChild(closeButton);

  document.body.appendChild(modal);
}

function playAudio(name) {
  audioSrc = "audio/"+name+".mp3";
  console.info(audioSrc)
  // 创建一个新的音频对象
  const audio = new Audio(audioSrc);

  // 播放音频
  audio.play();

  // 可选：监听音频结束事件，销毁音频对象，释放内存
  audio.addEventListener('ended', () => {
      audio.remove();  // 清理音频对象（如果需要）
  });

  // 可选：监听播放错误
  audio.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
  });
}