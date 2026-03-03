$(document).ready(function () {

    // Active nav link highlighting
    $('#navLinks a').each(function () {
        if (this.href === window.location.href) {
            $(this).addClass('active');
        }
    });

    // Only run the game code if the grid exists
    if ($("#gridContainer").length) {

        let activeSquares = [];
        let playerSelections = [];
        let roundActive = false;

        let round = 1;
        let highlightSpeed = 2500;
        let totalToHighlight = 4;
        let gridSize = 16;
        let gameStarted = false;

        // Initially hide the grid
        $("#gridContainer").hide();

        // Create grid squares
        const createGrid = function (totalSquares) {
            for (let i = 0; i < totalSquares; i++) {
                $("#gridContainer").append("<div class='square'></div>");
            }
        };

        // Update difficulty settings based on current round
        const updateDifficultySettings = function () {
            if (round >= 1 && round <= 4) {
                totalToHighlight = 4;
                highlightSpeed = 2500;
            }
            else if (round >= 5 && round <= 9) {
                totalToHighlight = 5;
                highlightSpeed = 2500;
            }
            else if (round >= 10 && round <= 14) {
                totalToHighlight = 5;
                highlightSpeed = 1500;
            }
            else if (round >= 15 && round <= 20) {
                totalToHighlight = 6;
                highlightSpeed = 2500;
            }
            else if (round >= 21 && round <= 25) {
                totalToHighlight = 6;
                highlightSpeed = 1200;
            }
        };

        // Start a new round
        const startRound = function () {

            activeSquares = [];
            playerSelections = [];
            roundActive = false;

            $(".square").removeClass("active correct incorrect");

            updateDifficultySettings();

            $("#roundDisplay").text("Round: " + round);
            $("#message").text("Memorise the highlighted squares...");

            let allSquares = $(".square");
            let totalSquares = allSquares.length;

            while (activeSquares.length < totalToHighlight) {
                let randomIndex = Math.floor(Math.random() * totalSquares);

                if (!activeSquares.includes(randomIndex)) {
                    activeSquares.push(randomIndex);
                    allSquares.eq(randomIndex).addClass("active");
                }
            }

            setTimeout(function () {
                $(".square").removeClass("active");
                roundActive = true;
                $("#message").text("Select the squares you remember.");
            }, highlightSpeed);
        };

        // End the current round
        const endRound = function () {

            roundActive = false;

            let correctCount = playerSelections.filter(value =>
                activeSquares.includes(value)
            ).length;

            if (correctCount === totalToHighlight) {

                round++;

                if (round > 25) {
                    $("#message").text("🎉 You completed NeuroLab! 🎉");
                    return;
                }

                if (round === 5) {
                    $("#message").text("Well done! Get ready for the next challenge...");
                }
                else if (round === 15) {
                    $("#message").text("Impressive focus. Things are about to speed up...");
                }
                else if (round === 21) {
                    $("#message").text("🔥 Boss Level Incoming 🔥 Stay sharp...");
                }
                else {
                    $("#message").text("Correct! Next round starting...");
                }

                setTimeout(function () {
                    startRound();
                }, 2000);

            } else {

                $("#message").text("You got " + correctCount + " out of " + totalToHighlight + ". Try again.");

                setTimeout(function () {
                    $(".difficulty").removeClass("hidden-smooth");
                    $("#startBtn").removeClass("hidden-smooth");
                    gameStarted = false;
                }, 2000);
            }
        };

        // Initialize grid
        createGrid(gridSize);

        // Difficulty buttons
        $(".diffBtn").click(function () {

            gridSize = parseInt($(this).data("size"));

            $("#gridContainer").empty();

            let columns = Math.sqrt(gridSize);
            $("#gridContainer").css("grid-template-columns", "repeat(" + columns + ", 1fr)");

            createGrid(gridSize);

            $("#gridContainer").show();
            $("#message").text("Difficulty set. Press Start.");
        });

        // Start button
        $("#startBtn").click(function () {

            if (!gameStarted) {
                gameStarted = true;
                $(".difficulty").addClass("hidden-smooth");
                $("#startBtn").addClass("hidden-smooth");
            }

            startRound();
        });

        // Square click
        $("#gridContainer").on("click", ".square", function () {

            if (!roundActive) return;

            let index = $(this).index();

            if (!playerSelections.includes(index)) {

                playerSelections.push(index);

                if (activeSquares.includes(index)) {
                    $(this).addClass("correct");
                } else {
                    $(this).addClass("incorrect");
                }
            }

            if (playerSelections.length === totalToHighlight) {
                endRound();
            }
        });
    }

    // Burger menu toggle
    $("#burger").click(function () {
        if ($(window).width() <= 992) {
            $("nav").toggleClass("open");
        }
    });

});