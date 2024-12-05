


$(document).ready(function () {
    var myElement = document.getElementById('swipe-card');
    $("#nameList").hide();
    $("#results").hide();
    let nameIndex = 0
    let QuestionIndex = 0;
    let QuestionLoaded = false;


    let questions = [];
    fetch('./domande.json').then(response => {
        questions = response.json().then(data => {
            questions = data;
            QuestionLoaded = true;
            loadContent();
        });
    });

    let names = JSON.parse(localStorage.getItem("names"));

    //[{questionId: id, Positive: [name1, name2], Negative: [name3, name4], NotSure: [name5, name6]}]
    let results = JSON.parse(localStorage.getItem("results"));
    let LatestGameIndexes = JSON.parse(localStorage.getItem("Indexes"));
    let FirstTimeLoading = true;
    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    // listen to events...
    mc.on("swipeleft swipeup swiperight", function (ev) {
        switch (ev.type) {
            case "swipeleft":
                $("#swipe-card").addClass("swipe-left");
                addResponse("Negative");
                break;
            case "swiperight":
                $("#swipe-card").addClass("swipe-right");
                addResponse("Positive");
                break;

            case "swipeup":
                $("#swipe-card").addClass("swipe-up");
                addResponse("NotSure");
                break;
            default:
                return;
        }
        setTimeout(() => {
            nameIndex++;
            loadContent();
            resetCard();
        }, 300);

    });

    function addResponse(responseType) {
        let question = questions[QuestionIndex];
        if (!results) {
            results = [];
        }
        var ResultIndex = results.findIndex(x => x.question == question);
        if (ResultIndex == -1) {
            results.push({ question: question, Positive: [], Negative: [], NotSure: [] });
            ResultIndex = results.length - 1;
        }

        switch (responseType) {
            case "Positive":
                results[ResultIndex].Positive.push(names[nameIndex]);
                break;
            case "Negative":
                results[ResultIndex].Negative.push(names[nameIndex]);
                break;
            case "NotSure":
                results[ResultIndex].NotSure.push(names[nameIndex]);
                break;
        }
        localStorage.setItem("results", JSON.stringify(results));
    }


    function loadContent() {
        if (names == null) {
            //open names insert page
            ShowNames();
        } else if (QuestionLoaded) {
            if (FirstTimeLoading) {
                if (LatestGameIndexes != null) {

                    if (confirm("Do you want to load the progress from the last time ? (no will reset the progress)")) {
                        nameIndex = LatestGameIndexes.nameIndex;
                        QuestionIndex = LatestGameIndexes.QuestionIndex;
                    } else {
                        localStorage.removeItem("results");
                        localStorage.removeItem("Indexes");
                    }
                    FirstTimeLoading = false;
                }
            };
            if (nameIndex >= names.length) {
                nameIndex = 0;
                QuestionIndex++;
            }
            if ((QuestionIndex < questions.length)) {
                // $("#question-container").removeClass();
                // $("#question-container").addClass(questions[QuestionIndex].Area.replace(/ /g, ''))
                $("#questionArea").text(questions[QuestionIndex].Area);
                $("#question").text(questions[QuestionIndex].Question);
                $("#name").text(names[nameIndex]);

                localStorage.setItem("Indexes", JSON.stringify({ nameIndex: nameIndex, QuestionIndex: QuestionIndex }));
            } else {
                alert("No more names to swipe!");
            }
        }
    }

    function resetCard() {
        $("#swipe-card").removeClass("swipe-right swipe-left swipe-up");
    }

    function ShowNames() {
        $("#nameList").show();
        if (names != null) {
            $("#TextAreaNames").val(names.join("\n"));
        }
    }

    window.saveNames = function () {
        names = $("#TextAreaNames").val().split("\n");
        if (names.length > 1) {
            localStorage.setItem("names", JSON.stringify(names));
            $("#nameList").hide();

            loadContent();
        }
        else {
            alert("Please insert names");
        }
    }

    window.showResults = function(){
        let results = JSON.parse(localStorage.getItem("results"));
        let resultsHtml = "";
        results.forEach(result => {
            resultsHtml += "<div class='result-container'>"
            resultsHtml += "<h3>"+result.question.Area+"</h3>";
            resultsHtml += "<p>"+result.question.Question+"</p>";
            resultsHtml += "<div class='result'><div class='positive'><h4>Positive</h4><ul>";
            result.Positive.forEach(name => {
                resultsHtml += "<li>"+name+"</li>";
            });
            resultsHtml += "</ul></div><div class='negative'><h4>Negative</h4><ul>";
            result.Negative.forEach(name => {
                resultsHtml += "<li>"+name+"</li>";
            });
            resultsHtml += "</ul></div><div class='not-sure'><h4>Not Sure</h4><ul>";
            result.NotSure.forEach(name => {
                resultsHtml += "<li>"+name+"</li>";
            });
            resultsHtml += "</ul></div></div></div>";
        });
        $("#results").html(resultsHtml);
        $("#results").show();
    }
    $(document).on("click", ".modal-close", (e)=>{        
        $("#"+e.target.parentElement.id).hide();
    })

    // Load the initial content
    loadContent();
});




document.querySelectorAll('textarea').forEach(el => {
    el.style.height = el.setAttribute('style', 'height: ' + (parseInt(el.scrollHeight) + 15) + 'px');
    el.classList.add('auto');
    el.addEventListener('input', e => {
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight) + 'px';
    });
});