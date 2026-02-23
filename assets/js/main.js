$(document).ready(function() {
    console.log("NeuroLab Loaded");

    $(".btn").hover(function() {
        $(this).css("opacity", "0.8");
    }, function() {
        $(this).css("opacity", "1");
    });
});

$(document).ready(function() {

    
    if ($("#gridContainer").length) {
        createGrid(16);
    }
    let activeSquares = [];
let totalToHighlight = 4; // how many squares light up

$("#startBtn").click(function () {
    startRound();
});

function startRound() {
    activeSquares = [];
    $(".square").removeClass("active");

    let allSquares = $(".square");
    let totalSquares = allSquares.length;

    while (activeSquares.length < totalToHighlight) {
        let randomIndex = Math.floor(Math.random() * totalSquares);

        if (!activeSquares.includes(randomIndex)) {
            activeSquares.push(randomIndex);
            allSquares.eq(randomIndex).addClass("active");
        }
    }

    // Hide after 2.5 seconds
    setTimeout(function () {
        $(".square").removeClass("active");
    }, 2500);
}

    function createGrid(totalSquares) {
        for (let i = 0; i < totalSquares; i++) {
            $("#gridContainer").append("<div class='square'></div>");
        }
    }

});
