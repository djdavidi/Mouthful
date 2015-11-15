app.config(function ($stateProvider) {
	    $stateProvider.state('home', {
	        url: '/',
	        templateUrl: 'js/home/home.html',
	        controller:'HomeCtrl'
	    });
	});

app.controller("HomeCtrl",function($scope){
	var finalTranscript = "";
    var recognizing = false;
    var aceEditor;
    var pointerSpot;
    $scope.aceValue=""
    $scope.pureText="";
    $scope.currentSpeaking="Start"
    //make this so when you find it changes this and then replace would change this,
    //but if you move or something else in between then it wont,
    $scope.currentSelectedText;
    //use this to retrieve text document from the backend
    //getDocument to store and then set it? maybe unnecessary with angular
    $scope.aceLoaded=function(_editor){
    	//can directly access the ace editor
    	// console.log("Ace anchor",_editor.document.)
    	aceEditor=_editor;
    	_editor.$blockScrolling = Infinity
    }
    //it will automatically cycle every 50 seconds
   	// have a counter on the side
    // ace commands--- goto, find	
    // need a replace to wipe a line, openline to 
    // could have a keybind to hit enter then go back up
    // get position and setPosition coud be helpful on the ace editor
    //insert newLine will be helpful, get text range
    //find then replace, replace all
    //undo changes
    // nonspecial, dot
    // parens-- exit Parens
    // have different file-tabs slash states that can be go-to'd as well


	window.speechSynthesis.onvoiceschanged = function () {
	    var voices = speechSynthesis.getVoices();
	    var voice = voices.filter(function (voice) {
	        return voice.name == 'Daniel';
	    })[0];
	    var greeting = new SpeechSynthesisUtterance();
	    greeting.voice = voice;
	    greeting.text = 'Hello David, how are you doing today?';
	    speechSynthesis.speak(greeting);
	}

        // check that your browser supports the API
        if (!('webkitSpeechRecognition' in window)) {
            alert("Sorry, no speaking for you today");
        } else{
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;         // keep processing input until stopped
            recognition.interimResults = true;     // show interim results
            recognition.lang = 'en-US';           // specify the language

            recognition.onstart = function() {
            	console.log("Onstart system online")
                recognizing = true;
            };

            recognition.onerror = function(event) {
                console.log("Error in the recognition mainframe",event);
            };

            recognition.onend = function() {
                recognizing = false;
                console.log("Ended recognition")
            };

            recognition.onresult = function(event) {
                
                if(event.results[0].isFinal){
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                		var individualResult=event.results[i][0].transcript
                		$scope.pureText+=individualResult;
                        finalTranscript+=individualResult;
                	}
                $scope.pureText+="\n";
                var x=finalTranscript.split(" ");
                console.log("finalsplice:    ",x);
                	$scope.$digest();
                }
                // update the page
                if(finalTranscript.length > 0) {
                	SpeechCtrl(x)
                    // $('#transcript').html(finalTranscript);
                    recognition.stop();
                    // $('#start_button').html('Click to Start Again');
                    recognizing = false;
                }
            };
            $scope.changeSpeak=function(){
                if (recognizing) {
                	$scope.currentSpeaking='Start'
                    recognition.stop();
                    console.log("click to start again")
                    recognizing = false;
                } else {
                    finalTranscript = "";
                    $scope.currentSpeaking='Stop'
                    recognition.start();
                }
            }
            }   
   var SpeechCtrl = function(commandArray){
   		var predefined={
	   		times:"*",
	   		plus:"+",
	   		minus:"-",
	   		divide:"/",
	   		modulo:"%",
	   		semi:";\n",
	   		quote:"'",
	   		openParens:"(",
	   		closeParens:")",
			equals:"="

   		}
   		var commands={
   			create:function(comman){


   			},
   			move:function(){
   			// _editor go to
   			},
   			function:function(arr){
   				console.log("function")
   				var params=""
   				//if commands is no then you automatically add it in, otherwise you store them
   				//have to do loops in all of these, or maybe at the end run through all the strings
   				// and switch those predfineds for their value
   				// have to loop through all the stuff until stop then do the rest
   				if(arr[2]=="parameters"){
   				//splice out "function with parameters"
   					arr.splice(0,3)
   				for(var i=0; i<arr.length; i++){
   					if(arr[i]=="stop"){
   						params= params.splice(0,i-1);
   						break;
   					}	
   					params+=arr[i]+","
   				}
   				}else{
   					//"function with no parameters"
   					arr.splice(0,4)
   				}

   				var result="function("+params+"){"+"\n"
				var third="}"
				var result= first+arr[0]+second+arr[1]+third+predefined.semi;

				doIt(result)
   			}

   		}

   	for(var c in commands){
   		if(c==commandArray[0]){
   			console.log("c",c)
   			commands.function(commandArray)
   		}
   		//if it matches variable in the current scope then find that, then either replace or equal
   	}



   	//function, array, object.. with params, keys, items


   	function doIt(result){
   		console.log("do it")
   		aceEditor.insert(result);
   	}







   }

})