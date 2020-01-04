const states = {
	INIT: 0,
	MAIN: 1, 
	QUIZ: 2, 
	END: 3, 
	HighScore: 4,
}
var selector = document.getElementById("slide-container")
var header = document.getElementById("header");
var main = document.getElementById("main");
var state = states.INIT; 

var temp;
var quizHandle; 

var userState = {
    Score: 0, 
    State: 0,
    QuizVer: 0, 
    Progress: 0, 
    RemTime: 50, 
    prevState: 0,
    HighScore: []  //changed to key value objects to have a sortable list. 
}

var timeCounter = document.createElement('p')
timeCounter.id = "score"; 

//~~~~~~~~~~~~~~~~~~ START ~~~~~~~~~~~~~~~~~~~~~~//
var startBtn = document.createElement('button'); 
startBtn.setAttribute("class","button1")
startBtn.textContent = "START"; 
startBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(userState.State == states.MAIN){
        userState.State = states.QUIZ;
    }
});
var scoreBtn = document.createElement('button'); 
scoreBtn.textContent = "HIGH SCORE"; 
scoreBtn.setAttribute("class","button2")
scoreBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(userState.State == states.MAIN){
        userState.State = states.HighScore;
    }
});
//~~~~~~~~~~~~~~~~~~ QUIZ  ~~~~~~~~~~~~~~~~~~~~~~//


var answersLi = document.createElement('ol'); 
answersLi.setAttribute("id","questionList")

var questP = document.createElement('p'); 
questP.setAttribute("id","title")


var reply = document.createElement('p'); 
reply.setAttribute("id","reply")


//~~~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~~~//
var initalText = document.createElement('input');
initalText.setAttribute("class","initals")

var scoreText = document.createElement('p');
var passage = document.createElement('p');
var submitBtn = document.createElement("button"); //input element, text

submitBtn.textContent = "submit"; 
submitBtn.setAttribute("class","main")
submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(userState.State == states.END){
        userState.State = states.HighScore;
        var name = initalText.value; 
        var score = userState.RemTime
        userState.HighScore.push([name,score])
    }
});

document.addEventListener('keypress', function(event) {
	console.log(String.fromCharCode(event.keyCode))

	if(initalText.value == 'Type Initals'){
		initalText.value = '';
	}
    if(userState.State == states.END){
        initalText.value = initalText.value + String.fromCharCode(event.keyCode);
    }
});

//~~~~~~~~~~~~~~~~~~ HIGHSCORE  ~~~~~~~~~~~~~~~~~~~~~~//
var scoresLi = document.createElement('ul'); 
scoresLi.setAttribute("id","highscoreList")
var scoresLiN = document.createElement('ul'); 
scoresLiN.setAttribute("id","highscoreListN")

scoresLi.setAttribute("id","highscoreList")
var highText = document.createElement('p'); 
highText.setAttribute("id","title")

var backBtn = document.createElement("button"); 
backBtn.textContent = "MAIN"; 
backBtn.setAttribute("class","main")
backBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(userState.State == states.HighScore){
        userState.State = states.MAIN;
    }
});

var correct = true; 
function setQuiz(version){
	userState.QuizVer = version;
}

 

function paceTimer(){

    if(correct){
    	console.log(correct)
    	var audio = new Audio('./Assets/sound/sheep.mp3');
    	if(userState.QuizVer == 0){
    		var audio = new Audio('./Assets/sound/cat.mp3');
    	}
  		
    	
        answersLi.innerHTML = ''
        questP.textContent = questions[userState.Progress].title
      	
        for(let i=0;i<questions[userState.Progress].choices.length;i++) { 
        	
        	reply.textContent = ""
            var ans = document.createElement('li');
            ans.innerHTML = (questions[userState.Progress].choices[i]);
            ans.setAttribute('val',i)
            ans.setAttribute('class','ans')
            answersLi.appendChild(ans);
            answersLi.childNodes[i].style.backgroundColor  = 'black'
        }        
        for(var i = 0; i <answersLi.childNodes.length; i++)
        (function(i) //https://stackoverflow.com/questions/15860683/onclick-event-in-a-for-loop
            { 
                answersLi.childNodes[i].onclick= function(){
                    var choice = answersLi.childNodes[i].getAttribute('val');
                    if(choice == questions[userState.Progress].answer){
                        //correct answer
                        userState.Progress++;
                        correct = true;
     
                    }else{
                        //Wrong answer
                        userState.RemTime -= 15;
                        answersLi.childNodes[i].style.backgroundColor  = 'red'
     					audio.play()
                    }
                    if(userState.Progress >= questions.length){
                        userState.State = states.END;
                        clearInterval(quizHandle)
                    }
                };
            }
        )(i);
        correct = false; 
    }
    userState.RemTime--;
    if(userState.RemTime <= 0){
        clearInterval(quizHandle)
        if(userState.RemTime < 0){
            userState.RemTime = 0;
        }
        userState.State = states.END;
    }
    timeCounter.textContent = userState.RemTime;
}

function mainloop(){
   
    switch(userState.State){
        case states.INIT: 
            temp = JSON.parse(localStorage.getItem("userState"));
           
            if(temp != null){
                userState = temp;
                userState.prevState = userState.State - 1;
            
            } else{
                userState.State = states.MAIN;
                userState.prevState = states.INIT
            }
            break; 

        case states.MAIN: 
            if(userState.prevState == states.INIT || userState.prevState == states.HighScore){
                userState.Progress = 0; 
                
                userState.RemTime = 50; 
                main.innerHTML = ''
                selector.appendChild(startBtn)
                selector.appendChild(scoreBtn)
                userState.Progress = 0;
                userState.prevState = states.MAIN;
                selector.style.display= "block";
            }
            break; 

        case states.QUIZ: 
            if(userState.prevState == states.MAIN){
            	
				if(userState.QuizVer == 0){
				questions = questions1
				}
				if(userState.QuizVer == 1){
				questions = questions2
				}
				questP.textContent = questions[userState.Progress].title
           		selector.style.display= "none";
               	main.innerHTML = ''
               	correct = true;
               	answersLi.innerHTML = ''
                main.appendChild(timeCounter)
                main.appendChild(questP)
                main.appendChild(answersLi)
                main.appendChild(reply)
                userState.prevState = states.QUIZ;
                quizHandle = setInterval(paceTimer, 1000);
            }
            break; 

        case states.END: 
            if(userState.prevState == states.QUIZ){
               	
                main.innerHTML = ''     
                userState.Progress = 0;
                userState.prevState = states.END;
                scoreText.textContent = userState.RemTime;
                timeCounter.textContent = userState.RemTime;
            	initalText.value = "Type Initals"
                main.appendChild(initalText)
                main.appendChild(submitBtn)
            }
            break;
            
        case states.HighScore:
            if(userState.prevState == states.END || userState.prevState == states.MAIN){
      
                initalText.value =''
                main.innerHTML = ''
                scoresLi.innerHTML = ''
                scoresLiN.innerHTML = ''
                userState.prevState = states.HighScore;

                main.appendChild(scoresLiN)
                main.appendChild(scoresLi)

                main.appendChild(highText)
                main.appendChild(backBtn)
                userState.HighScore =userState.HighScore.sort(function(a,b){return b[1] - a[1];}); 
                selector.style.display= "none";
                var maxlen = 0; 

                if(userState.HighScore.length >= 10){
                    maxlen = 10;
                }else{
                    maxlen = userState.HighScore.length
                }

	            var hsN = document.createElement('li');
	            hsN.setAttribute("class",'scores')
	            hsN.innerHTML = "NAME"
	            var hs = document.createElement('li');
	            hs.setAttribute("class",'scores')
	            hs.innerHTML = "SCORE"
				scoresLiN.appendChild(hsN);
	            scoresLi.appendChild(hs);

	            var hsN = document.createElement('li');
	            hsN.setAttribute("class",'scores')
	            hsN.innerHTML = "-"
	            var hs = document.createElement('li');
	            hs.setAttribute("class",'scores')
	            hs.innerHTML = "-"
				scoresLiN.appendChild(hsN);
	            scoresLi.appendChild(hs);

                for(var i = 0; i < maxlen; i++)
                {   

                	var hsN = document.createElement('li');
                    hsN.setAttribute("class",'scores')
                    if(userState.HighScore[i][0] == '' || userState.HighScore[i][0] ==  "Type Initals"){
                    	userState.HighScore[i][0] = '.'
                    }
                    hsN.innerHTML = userState.HighScore[i][0]; 

                    var hs = document.createElement('li');
                    hs.setAttribute("class",'scores')
                    hs.innerHTML = userState.HighScore[i][1]; 

					scoresLiN.appendChild(hsN);
                    scoresLi.appendChild(hs);
                }
            }
            break;
  
          
        default:
            break;
    }
    localStorage.setItem("userState", JSON.stringify(userState));
}
setInterval(mainloop, 50);
