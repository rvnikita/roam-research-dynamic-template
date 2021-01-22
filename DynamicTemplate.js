//https://medium.com/javascript-in-plain-english/how-to-detect-a-sequence-of-keystrokes-in-javascript-83ec6ffd8e93
let buffer = [];
let lastKeyTime = Date.now();

let template = ";;hi"
let key_delay = 3000

//HERE IS QUESTIONS
let questions = 
[
"What did I learn today?",
"What went well?",
"What could have been better?",
"What made me happy today?",
"What made me sad?",
"What did I do to get closer to my dream?",
"Whom did I help today?",
"Was I productive today?",
"With whom I spoke today?",
"Who am I grateful to today?",
"Did I reinforce my habit today?",
"How many time I've spent in Social Media today?",
"Did I eat good today?",
"How do I feel today?",
"Am I proud of myself?",
"If you could only leave one memory of today, what kind of memory would it be?"
];
let questions_amount = 3


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function hyper_island_questions(count)
{
	hyper_island_questions_string = []
  //SHUFFLE THEM
  shuffle(questions);

  //PRINT
  hyper_island_questions_string += "- #[[[[personal]] [[reflection]]]] #[[[[personal]] diary]]\n";
  for(var i = 0; i < count; i++)
  {
    hyper_island_questions_string += "    - [[" + questions[i] +"]]\n" ;
  }
  
  return hyper_island_questions_string
}


//start listening input
document.addEventListener('keyup', event => {
  const key = event.key.toLowerCase();

	//deleting last key
	if(key == "backspace") {
  	buffer.splice(-1,1);
    return;
  }
  
  const currentTime = Date.now();

  //3 seconds delay for entering shortcut
  if (currentTime - lastKeyTime > key_delay) {
    buffer = [];
  }


  buffer.push(key);
  lastKeyTime = currentTime;
  
  if(buffer.join("").includes(template)) {
  	//remove entered shortcut
		event.target.value = event.target.value.substring(0, event.target.value.length - template.length);
    
    event.target.value += hyper_island_questions(questions_amount)
    
    event.target.focus();
    //elem.dispatchEvent(new Event('input', {bubbles: true, cancelable: true }));
    
    buffer = []; //clear buffer
    
  }
  
  
});