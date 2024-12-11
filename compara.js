$(document).ready(function () {
    var
        results = []; // Array to store the parsed JSON        

    $("#FileUpload").on("submit", function (e) {
        e.preventDefault(); // Prevent the form from submitting
        const files = $('#files')[0].files; // Get the selected files

        if (files.length === 0) {
            alert('Please select at least one file.');
            return;
        }

        let processedFiles = 0;

        // Iterate through each file
        $.each(files, function (index, file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                try {
                    const json = JSON.parse(event.target.result); // Parse the JSON
                    results.push(json); // Add the parsed JSON to the results array

                } catch (e) {
                    alert(`Error parsing file ${file.name}: ${e.message}`);
                } finally {
                    processedFiles++;
                    if (processedFiles === files.length) {
                        console.log('All files processed:', results);
                        $("FileUpload").hide();
                        startCompare();
                    }
                }
            };

            reader.onerror = function () {
                alert(`Error reading file ${file.name}`);
                processedFiles++;
            };

            reader.readAsText(file); // Read the file as text
        });
        return false;
    });


    function startCompare() {
        // Compare the results array
        // Iterate through the results array
        var textColors = generateReadableHexColors(results.length);

        var resultViewModel = [];
        //{name:"name", positive:[{question, color}], negative:[{question, color}], notSure:[ {question, color}]}
        for (let i = 0; i < results.length; i++) {
            // Iterate through the results array again
            results[i].forEach(result => {
                result.positive.forEach(question => {
                    var index = resultViewModel.findIndex(x => x.name == result.name);
                    if (index == -1) {
                        resultViewModel.push({ name: result.name, positive: [{ question: question, color: textColors[i] }], negative: [], notSure: [] });
                    } else {
                        if (resultViewModel[index].positive.findIndex(x => x.question.Question == question.Question) == -1) {
                            resultViewModel[index].positive.push({ question: question, color: textColors[i] });
                        }
                    }
                });

                result.negative.forEach(question => {
                    var index = resultViewModel.findIndex(x => x.name == result.name);
                    if (index == -1) {
                        resultViewModel.push({ name: result.name, positive: [], negative: [{ question: question, color: textColors[i] }], notSure: [] });
                    } else {
                        if (resultViewModel[index].negative.findIndex(x => x.question.Question == question.Question) == -1) {
                            resultViewModel[index].negative.push({ question: question, color: textColors[i] });
                        }
                    }
                });

                result.notSure.forEach(question => {
                    var index = resultViewModel.findIndex(x => x.name == result.name);
                    if (index == -1) {
                        resultViewModel.push({ name: result.name, positive: [], negative: [], notSure: [{ question: question, color: textColors[i] }] });
                    } else {
                        if (resultViewModel[index].notSure.findIndex(x => x.question.Question == question.Question) == -1) {
                            resultViewModel[index].notSure.push({ question: question, color: textColors[i] });
                        }
                    }
                });
            });
        }

        var resultsHtml = '';
        // Display the results
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
            <td>${result.positive.filter(x => x.question.Area == "Impegno Civile").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            <td>${result.negative.filter(x => x.question.Area == "Impegno Civile").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Negative + "</span>").join(", ")}</td>
            <td>${result.notSure.filter(x => x.question.Area == "Impegno Civile").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            </tr>
            <tr>
            <td>Corporeità</td>
            <td>${result.positive.filter(x => x.question.Area == "Corporeità").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            <td>${result.negative.filter(x => x.question.Area == "Corporeità").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Negative + "</span>").join(", ")}</td>
            <td>${result.notSure.filter(x => x.question.Area == "Corporeità").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            </tr>
            <tr>
            <td>Creatività</td>
            <td>${result.positive.filter(x => x.question.Area == "Creatività").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            <td>${result.negative.filter(x => x.question.Area == "Creatività").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Negative + "</span>").join(", ")}</td>
            <td>${result.notSure.filter(x => x.question.Area == "Creatività").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            </tr>
            <tr>
            <td>Carattere</td>
            <td>${result.positive.filter(x => x.question.Area == "Carattere").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            <td>${result.negative.filter(x => x.question.Area == "Carattere").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Negative + "</span>").join(", ")}</td>
            <td>${result.notSure.filter(x => x.question.Area == "Carattere").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            </tr>
            <td>Dimensione Spirituale</td>
            <td>${result.positive.filter(x => x.question.Area == "Dimensione Spirituale").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            <td>${result.negative.filter(x => x.question.Area == "Dimensione Spirituale").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Negative + "</span>").join(", ")}</td>
            <td>${result.notSure.filter(x => x.question.Area == "Dimensione Spirituale").map(o => "<span style=\"color: " + o.color + "\">" + o.question.AsResult.Positive + "</span>").join(", ")}</td>
            </tr>
            </table>
            <hr>
            `;

        });
        $('#results').append(resultsHtml);

    }
});



function generateReadableHexColors(count) {
    const colors = [];

    for (let i = 0; i < count; i++) {
        let color;
        do {
            color = randomHexColor();
        } while (!isReadableColor(color));
        colors.push(color);
    }

    return colors;

    // Generate a random hex color
    function randomHexColor() {
        const randomInt = () => Math.floor(Math.random() * 256);
        return `#${((1 << 24) + (randomInt() << 16) + (randomInt() << 8) + randomInt()).toString(16).slice(1)}`;
    }

    // Check if a color is readable (contrast check with white background)
    function isReadableColor(hexColor) {
        const rgb = hexToRgb(hexColor);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

        // Consider a color readable if it contrasts well with white
        return luminance < 0.7;
    }

    // Convert hex color to RGB object
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }
}
