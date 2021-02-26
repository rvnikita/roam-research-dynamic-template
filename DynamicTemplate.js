//https://medium.com/javascript-in-plain-english/how-to-detect-a-sequence-of-keystrokes-in-javascript-83ec6ffd8e93
//https://www.putyourleftfoot.in/introduction-to-the-roam-alpha-api

let buffer = [];
let lastKeyTime = Date.now();

let morning_template = ";;hm"
let evening_template = ";;he"
let key_delay = 3000

//HERE IS QUESTIONS
let evening_questions = 
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
"What I am worried about?",
"If you could only leave one memory of today, what kind of memory would it be?"
];

let morning_questions = 
[
"What’s going to be the highlight of my day?",
"What habit will I reinforce today?",
"What is top 3 task for today?",
];

let questions_amount = 3

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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


function get_random_questions(count, questions)
{
  hyper_island_questions_array = []
  //SHUFFLE THEM
  shuffle(questions);

  //PRINT
  for(var i = 0; i < count; i++)
  {
    hyper_island_questions_array[i] = "[[" + questions[i] +"]]" ;
  }
  
  return hyper_island_questions_array
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
  
  if(buffer.join("").includes(evening_template) || buffer.join("").includes(morning_template)) 
  {	  
	if(buffer.join("").includes(evening_template))
	{
		questions = evening_questions
	}
	else if (buffer.join("").includes(morning_template))
	{
		questions = morning_questions
	}
  	//remove entered shortcut
    event.target.focus();
    
    insert_blocks(event)
}
                          
async function insert_blocks(event)
{
    block_html_id = event.target.id.toString()
    block_id = block_html_id.substring(block_html_id.length - 9) //getting block uid
    
    console.log(block_id);
    
    window.roamAlphaAPI.updateBlock({"block": {"uid": block_id, "string": "#[[[[personal]] [[reflection]]]] #[[[[personal]] diary]]"}})
    //event.target.value = event.target.value.substring(0, event.target.value.length - template.length);
    
    for (question of get_random_questions(questions_amount, questions))
    {
      //create question
      await window.roamAlphaAPI.createBlock({"location": 
		{"parent-uid": block_id, 
		 "order": 0}, 
	 "block": 
		{"string": question}})
      
      await sleep(25);
	
      //find new block id, that's crazy window.roamAlphaAPI.createBlock does not return it directly.
      question_block_id = window.roamAlphaAPI.q(`
    [:find ?block_uid
     :in $ ?parent_uid ?block_string
     :where
     [?parent :block/uid ?parent_uid]
     [?block :block/parents ?parent]
     [?block :block/string ?block_string]
     [?block :block/uid ?block_uid]
    ]`, block_id , question);
      
	  if(question_block_id)
	  {
	      //create blank block for answer
	      window.roamAlphaAPI.createBlock({"location": 
			{"parent-uid": question_block_id[0][0], 
			 "order": 0}, 
		 "block": 
			{"string": ""}})
	   }  
    }
    buffer = []; //clear buffer
  }
});
