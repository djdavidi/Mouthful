app.config(function ($stateProvider) {
	    $stateProvider.state('home', {
	        url: '/',
	        templateUrl: 'js/home/home.html',
	        controller:'HomeCtrl'
	    });
	});

app.controller("HomeCtrl",function($scope){
	$scope.thing= "hey";
	var finalTranscript = [];
    var recognizing = false;
    $scope.aceValue="begin the process"
    //it will automatically cycle every 50 seconds
   	// have a counter on the side
    // ace commands--- goto, find	
    // need a replace to wipe a line, openline to 
    // could have a keybind to hit enter then go back up
    // get position and setPosition coud be helpful
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
            alert("Sorry, your Browser does not support the Speech API");

        } else{
            // Create the recognition object and define the event handlers

            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;         // keep processing input until stopped
            recognition.interimResults = true;     // show interim results
            recognition.lang = 'en-US';           // specify the language

            recognition.onstart = function() {
            	console.log("ehy")
                recognizing = true;
               	$scope.thing='Speak slowly and clearly';
                $scope.toStop='Click to Stop'
            };

            recognition.onerror = function(event) {
                console.log("Error in the recognition mainframe");
            };

            recognition.onend = function() {
                recognizing = false;
                console.log("Ended recognition")
            };

            recognition.onresult = function(event) {
                var interimTranscript = [];
                // Assemble the transcript from the array of results
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript.push(event.results[i][0].transcript);
                    } else {
                        interimTranscript.push(event.results[i][0].transcript);
                    }
                }
                console.log("interim:  " + interimTranscript);
                console.log("typefo",Array.isArray(interimTranscript));
                console.log("typefo",Array.isArray(finalTranscript));
                console.log("final:    " + finalTranscript);

                // update the page
                if(finalTranscript.length > 0) {
                    // $('#transcript').html(finalTranscript);
                    recognition.stop();
                    // $('#start_button').html('Click to Start Again');
                    recognizing = false;
                }
            };

            $scope.start=function(){

                if (recognizing) {
                    recognition.stop();
                    console.log("click to start again")
                    recognizing = false;
                } else {
                    finalTranscript = [];
                    // Request access to the User's microphone and Start recognizing voice input
                    recognition.start();
                    // $('#instructions').html('Allow the browser to use your Microphone');
                    // $('#start_button').html('waiting');
                    // $('#transcript').html('&nbsp;');
                }
            }
            }   
   var SpeechCtrl = function(commands){











   }

})