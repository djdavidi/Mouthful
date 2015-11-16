  app.config(function($stateProvider) {
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
      	_editor.$blockScrolling = Infinity;
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


  	// window.speechSynthesis.onvoiceschanged = function () {
  	//     var voices = speechSynthesis.getVoices();
  	//     var voice = voices.filter(function (voice) {
  	//         return voice.name == 'Daniel';
  	//     })[0];
  	//     var greeting = new SpeechSynthesisUtterance();
  	//     greeting.voice = voice;
  	//     greeting.text = 'Hello David, how are you doing today?';
  	//     speechSynthesis.speak(greeting);
  	// }

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
                  		$scope.pureText+=individualResult+"....";
                      finalTranscript+=individualResult;
                  	}
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
     function SpeechCtrl(commandArray){
      // need to create a current variable thing to cycle through as well
      var predefined={
          times:"*",
          plus:"+",
          minus:"-",
          slash:"/",
          divided:"/",
          modulo:"%",
          semi:";\n",
          quote:"'",
          parentheses:"()",
          equals:"=",
          dot:".",
          array:"[]",
          variable:"var",
          comma:","
        };
      function doIt(result){
        console.log("do it")
        aceEditor.insert(result+"\n");
      }
      function replacePredefined(arr){
        var contents="";
        arr.forEach(function(elem,index){
            for(var k in predefined){
              if(elem==k){
                arr[index]= predefined[k];
              }
            }
          })
        // bad to do this again but not enough time to work it into the above two
        arr.forEach(function(elem){
          contents+=elem+" ";
        })
        return contents;
      }

      var aceCommands={
        move:function(commandArr){
          console.log("move");
          // editor move to line 54
          if(commandArr[3]=="end"){
            aceEditor.navigateLineEnd();
          }else{
          aceEditor.gotoLine(commandArr[4])
        }
        },
        find:function(commandArr){
          //editor find multiply
          aceEditor.find(commandArr[2])
        },
        replace:function(arr){
          //wont work for now until i figure out the selecting aspect
          //editor replace [foo] with [bar]
          aceEditor.find(arr[2]);
          aceEditor.replace(arr[4]);
        },
        delete:function(arr){
          aceEditor.remove(arr[3])
        }
      };
     		var commands={
     			fun:function(arr){
     				console.log("function");
     				var params=[];
            var stopPoint=0;
     				//if commands is no then you automatically add it in, otherwise you store them
     				//have to do loops in all of these, or maybe at the end run through all the strings
     				// and switch those predfineds for their value
     				// have to loop through all the stuff until stop then do the rest

            //if it is not with, then you know that it is a named function, therefore
            var nameOf="";
            if(arr[2]!=="with"){
               console.log("name")
              nameOf=arr[2]
            }
            if(arr[4]!=="no" && arr[5]!=='no'){
               console.log("params")
            //create function, ugly way of checking for no parameters fix later
            //splice out "function with parameters"
     				for(var i=4; i<arr.length; i++){
     					if(arr[i]=="stop"){
                stopPoint=i;
     						break;
     					}
              else if(arr[i]=="&" || arr[i]=="with" || arr[i]=="parameters" || arr[i]=="and"){
                continue;
              }
     					params.push(arr[i]);
              console.log("PARAMS",params)
            }
              params.join(",");
              arr.splice(0,stopPoint+1)

            }else{
              console.log("thearray",arr)
              console.log("here")
              //create function hello with no paramaters stop
              for(var i=0; i<arr.length; i++){
              if(arr[i]=="stop"){
                  console.log("i",i)
                console.log("inside",stopPoint)
                stopPoint=i;
                console.log("inside",stopPoint)
                break;
              }
            }
              console.log("stop",stopPoint);
              arr.splice(0,stopPoint+1)
              console.log("current",arr)
          }
          
            var functionContents=replacePredefined(arr)
            
            // need to leave space for the name
            //if the whatever isnt equal to with, then make that the name else name=""
     			var first="function "+nameOf;
          var second="("+params+"){"+"\n"
  				var third="}"
          //for now at least add a new line
          var result= first+second+functionContents+"\n"+third+";";
  				doIt(result);
     			},

          variable:function(arr){
            //create variable 
            console.log("varr")
            arr.splice(0,1)

            var result= replacePredefined(arr)+";";
            doIt(result);
          },

          express:function(arr){
            // create express [name] [verb] [route]
            var result= ""+arr[2]+"."+arr[3]+"("+"'"+"/"+arr[4]+"'"+",function(req,res,next){\n})"
            doIt(result)
          },
          objector:function(arr){
            //create object [name] with x =5 , y=10
            var result="var"+arr[2]+"{";
            var otherHalf= replacePredefined(arr.splice(0,3))+"\n}"

          }

     		}
        //Test- create function with parameters x and y stop
      if(commandArray[0]=="create"){
     	for(var c in commands){
     		if(c==commandArray[1]){
     			console.log("c",c)
     			commands[c](commandArray)
     }
        }
        //if it matches variable in the current scope then find that, then either replace or equal
      }
     else if(commandArray[0]=="editor"){
      for(var ac in aceCommands){
        if(ac==commandArray[1]){
          console.log("editor",ac)
          aceCommands[ac](commandArray)
        }
      }
     }
     else if(commandArray[0]=="literal"){
      commandArray.splice(0,1)
      var literally=replacePredefined(commandArray);
      doIt(literally);
     }
     else{
      console.log('please try another command')
     }


     	//function, array, object.. with params, keys, items
     }

  })