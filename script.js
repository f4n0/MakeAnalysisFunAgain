$(document).ready(function () {

    var SwipeElement = document.getElementById('SwipeCard');
    let nameIndex = 0
    let QuestionIndex = 0;
    let QuestionLoaded = false;

    let questions = [];
    let names = JSON.parse(localStorage.getItem("names"));

    let results = JSON.parse(localStorage.getItem("results"));
    let LatestGameIndexes = JSON.parse(localStorage.getItem("Indexes"));
    let FirstTimeLoading = true;


    fetch('./domande.json').then(response => {
        questions = response.json().then(data => {
            questions = data;
            QuestionLoaded = true;
            loadContent();
        });
    });

    var mc = new Hammer(SwipeElement);
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    mc.on("swipeleft swipeup swiperight", function (ev) {
        switch (ev.type) {
            case "swipeleft":
                $("#SwipeCard").addClass("swipe-left");
                addResponse("Negative");
                break;
            case "swiperight":
                $("#SwipeCard").addClass("swipe-right");
                addResponse("Positive");
                break;

            case "swipeup":
                $("#SwipeCard").addClass("swipe-up");
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
                if (LatestGameIndexes != null && (LatestGameIndexes.nameIndex != 0 || LatestGameIndexes.QuestionIndex != 0)) {
                    if (confirm("Vuoi caricare i progressi dell'ultima volta? (no, i progressi verranno reimpostati)")) {
                        nameIndex = LatestGameIndexes.nameIndex;
                        QuestionIndex = LatestGameIndexes.QuestionIndex;
                        UpdateProgess();
                    } else {
                        localStorage.removeItem("results");
                        localStorage.removeItem("Indexes");
                        location.reload();

                    }
                    FirstTimeLoading = false;
                }else{
                    FirstTimeLoading = false
                    ShowNames();
                }
            };
            if (nameIndex >= names.length) {
                nameIndex = 0;
                QuestionIndex++;
                UpdateProgess();
            }
            if ((QuestionIndex < questions.length)) {
                // $("#question-container").removeClass();
                // $("#question-container").addClass(questions[QuestionIndex].Area.replace(/ /g, ''))
                $("#questionArea").text(questions[QuestionIndex].Area);
                $("#question").text(questions[QuestionIndex].Question);
                $("#name").text(names[nameIndex]);
                $("#name").focus();
                localStorage.setItem("Indexes", JSON.stringify({ nameIndex: nameIndex, QuestionIndex: QuestionIndex }));
            } else {
                alert("No more names to swipe!");
            }
        }
    }

    function UpdateProgess() {
        $("#ProgressBar").css("width", `${(QuestionIndex / questions.length) * 100}%`);
    }



    function resetCard() {
        $("#SwipeCard").removeClass("swipe-right swipe-left swipe-up");
    }


    function ShowNames() {
        $('#NamesModal').modal('show');
        if (names != null) {
            $("#TextAreaNames").trigger("input").val(names.join("\n"));
        }
    }

    // Window Methods
    window.saveNames = function () {
        names = $("#TextAreaNames").val().split("\n");
        if (names.length > 1) {
            localStorage.setItem("names", JSON.stringify(names));
            $('#NamesModal').modal('hide');

            loadContent();
        }
        else {
            alert("Please insert names");
        }
    }

    window.DownloadResults = function () {
        let results = JSON.parse(localStorage.getItem("results"));
        let resultsHtml = "";
        var resultViewModel = [];
        //{name:"name", positive:[question], negative:[question], notSure:[ question]}
        results.forEach(result => {
            result.Positive.forEach(name => {
                var index = resultViewModel.findIndex(x => x.name == name);
                if (index == -1) {
                    resultViewModel.push({ name: name, positive: [result.question], negative: [], notSure: [] });
                } else {
                    resultViewModel[index].positive.push(result.question);
                }
            });
            result.Negative.forEach(name => {
                var index = resultViewModel.findIndex(x => x.name == name);
                if (index == -1) {
                    resultViewModel.push({ name: name, positive: [], negative: [result.question], notSure: [] });
                } else {
                    resultViewModel[index].negative.push(result.question);
                }
            });
            result.NotSure.forEach(name => {
                var index = resultViewModel.findIndex(x => x.name == name);
                if (index == -1) {
                    resultViewModel.push({ name: name, positive: [], negative: [], notSure: [result.question] });
                } else {
                    resultViewModel[index].notSure.push(result.question);
                }
            });
        });

        let json = JSON.stringify(resultViewModel, null, 2);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(json);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'results.json';
        hiddenElement.click();

    }

    window.showResults = function () {
        let results = JSON.parse(localStorage.getItem("results"));
        let resultsHtml = "";
        var resultViewModel = [];
        //{name:"name", positive:[question], negative:[question], notSure:[ question]}
        results.forEach(result => {
            result.Positive.forEach(name => {
                var index = resultViewModel.findIndex(x => x.name == name);
                if (index == -1) {
                    resultViewModel.push({ name: name, positive: [result.question], negative: [], notSure: [] });
                } else {
                    resultViewModel[index].positive.push(result.question);
                }
            });
            result.Negative.forEach(name => {
                var index = resultViewModel.findIndex(x => x.name == name);
                if (index == -1) {
                    resultViewModel.push({ name: name, positive: [], negative: [result.question], notSure: [] });
                } else {
                    resultViewModel[index].negative.push(result.question);
                }
            });
            result.NotSure.forEach(name => {
                var index = resultViewModel.findIndex(x => x.name == name);
                if (index == -1) {
                    resultViewModel.push({ name: name, positive: [], negative: [], notSure: [result.question] });
                } else {
                    resultViewModel[index].notSure.push(result.question);
                }
            });
        });

        resultViewModel.forEach(result => {
            resultsHtml += `<div class="result-item">
            <h3>${result.name}</h3>
            <table class="table-responsive table-bordered">
            <tr>
                <th>Area</th>
                <th>Punti di Forza</th>
                <th>Punti da incrementare</th>
                <th>Non sono sicuro</th>
            </tr>
            <tr>
            <td>Impegno Civile</td>
            <td>${result.positive.filter(x => x.Area == "Impegno Civile").map(o => o.AsResult.Positive).join(", ")}</td>
            <td>${result.negative.filter(x => x.Area == "Impegno Civile").map(o => o.AsResult.Negative).join(", ")}</td>
            <td>${result.notSure.filter(x => x.Area == "Impegno Civile").map(o => o.AsResult.Positive).join(", ")}</td>
            </tr>
            <tr>
            <td>Corporeità</td>
            <td>${result.positive.filter(x => x.Area == "Corporeità").map(o => o.AsResult.Positive).join(", ")}</td>
            <td>${result.negative.filter(x => x.Area == "Corporeità").map(o => o.AsResult.Negative).join(", ")}</td>
            <td>${result.notSure.filter(x => x.Area == "Corporeità").map(o => o.AsResult.Positive).join(", ")}</td>
            </tr>
            <tr>
            <td>Creatività</td>
            <td>${result.positive.filter(x => x.Area == "Creatività").map(o => o.AsResult.Positive).join(", ")}</td>
            <td>${result.negative.filter(x => x.Area == "Creatività").map(o => o.AsResult.Negative).join(", ")}</td>
            <td>${result.notSure.filter(x => x.Area == "Creatività").map(o => o.AsResult.Positive).join(", ")}</td>
            </tr>
            <tr>
            <td>Carattere</td>
            <td>${result.positive.filter(x => x.Area == "Carattere").map(o => o.AsResult.Positive).join(", ")}</td>
            <td>${result.negative.filter(x => x.Area == "Carattere").map(o => o.AsResult.Negative).join(", ")}</td>
            <td>${result.notSure.filter(x => x.Area == "Carattere").map(o => o.AsResult.Positive).join(", ")}</td>
            </tr>
            <td>Dimensione Spirituale</td>
            <td>${result.positive.filter(x => x.Area == "Dimensione Spirituale").map(o => o.AsResult.Positive).join(", ")}</td>
            <td>${result.negative.filter(x => x.Area == "Dimensione Spirituale").map(o => o.AsResult.Negative).join(", ")}</td>
            <td>${result.notSure.filter(x => x.Area == "Dimensione Spirituale").map(o => o.AsResult.Positive).join(", ")}</td>
            </tr>
            </table>
            <hr>
            `;
        });


        $("#results").html(resultsHtml);
        $('#ResultModal').modal('show');
    }

    

    $("#SkipQuestion").click(() => {
        QuestionIndex++;
        nameIndex = 0;
        UpdateProgess();
        loadContent();
    });
    // Load the initial content
    loadContent();

});