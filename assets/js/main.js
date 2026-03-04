$(document).ready(function () {

    // Highlight active nav link
    $('#navLinks a').each(function () {
        if (this.href === window.location.href) {
            $(this).addClass('active');
        }
    });

    if ($("#gridContainer").length) {

        let activeSquares = [];
        let playerSelections = [];
        let roundActive = false;

        let round = 1;
        let highlightSpeed = 2500;
        let totalToHighlight = 4;
        let gridSize = 0;
        let gameStarted = false;
        let difficultySelected = false;

        const $gridContainer = $("#gridContainer");
        const $roundDisplay = $("#roundDisplay");
        const $difficultyBtns = $(".diffBtn");
        const $startBtn = $("#startBtn");
        const $message = $("#message");

        $gridContainer.hide();
        $roundDisplay.hide();
        $message.hide();

        // ======================
        // Create Grid
        // ======================
        function createGrid(totalSquares) {
            $gridContainer.empty();

            for (let i = 0; i < totalSquares; i++) {
                $gridContainer.append("<div class='square'></div>");
            }

            let columns = Math.sqrt(totalSquares);
            $gridContainer.css("grid-template-columns", `repeat(${columns}, 1fr)`);
        }

        // ======================
        // Difficulty Scaling
        // ======================
        function updateDifficultySettings() {
            if (round <= 4) {
                totalToHighlight = 4;
                highlightSpeed = 2500;
            } else if (round <= 9) {
                totalToHighlight = 5;
                highlightSpeed = 2500;
            } else if (round <= 14) {
                totalToHighlight = 5;
                highlightSpeed = 1500;
            } else if (round <= 20) {
                totalToHighlight = 6;
                highlightSpeed = 2500;
            } else {
                totalToHighlight = 6;
                highlightSpeed = 1200;
            }
        }

        // ======================
        // Start Round
        // ======================
        function startRound() {
            activeSquares = [];
            playerSelections = [];
            roundActive = false;

            $(".square").removeClass("active correct incorrect");

            updateDifficultySettings();
            $roundDisplay.text("Round: " + round);

            let totalSquares = $(".square").length;

            while (activeSquares.length < totalToHighlight) {
                let randomIndex = Math.floor(Math.random() * totalSquares);
                if (!activeSquares.includes(randomIndex)) {
                    activeSquares.push(randomIndex);
                    $(".square").eq(randomIndex).addClass("active");
                }
            }

            setTimeout(function () {
                $(".square").removeClass("active");
                roundActive = true;

                $message.stop(true, true)
                    .show()
                    .css("opacity", 0)
                    .text("Select the squares you remember.")
                    .animate({ opacity: 1 }, 400);

            }, highlightSpeed);
        }

        // ======================
        // FULL RESET
        // ======================
        function resetGameCompletely() {

            round = 1;
            activeSquares = [];
            playerSelections = [];
            roundActive = false;
            gameStarted = false;
            difficultySelected = false;
            gridSize = 0;

            $difficultyBtns.removeClass("active-diff");
            $difficultyBtns.prop("disabled", false);

            $gridContainer.slideUp(600, function () {
                $gridContainer.empty();
            });

            $roundDisplay.fadeOut(400);

            $difficultyBtns.add($startBtn).each(function () {
                $(this).css({
                    display: "inline-block",
                    opacity: 0
                }).animate({ opacity: 1 }, 600);
            });

            $message.stop(true, true).fadeOut(400, function () {
                $(this).text("");
            });
        }

        // ======================
        // End Round
        // ======================
        function endRound() {

            roundActive = false;

            let correctCount = playerSelections.filter(value =>
                activeSquares.includes(value)
            ).length;

            if (correctCount === totalToHighlight) {

                round++;

                if (round > 25) {

                    $message.stop(true, true)
                        .show()
                        .css("opacity", 0)
                        .text("🎉 You completed NeuroLab! 🎉")
                        .animate({ opacity: 1 }, 400);

                    setTimeout(function () {
                        $message.fadeOut(400, resetGameCompletely);
                    }, 2000);

                    return;
                }

                $message.stop(true, true)
                    .show()
                    .css("opacity", 0)
                    .text("Correct! Next round starting...")
                    .animate({ opacity: 1 }, 400);

                setTimeout(startRound, 2000);

            } else {

                $message.stop(true, true)
                    .show()
                    .css("opacity", 0)
                    .text(`You got ${correctCount} out of ${totalToHighlight}. Try again.`)
                    .animate({ opacity: 1 }, 400);

                setTimeout(function () {
                    $message.fadeOut(400, resetGameCompletely);
                }, 2000);
            }
        }

        // ======================
        // Difficulty Select
        // ======================
        $difficultyBtns.click(function () {

            $difficultyBtns.removeClass("active-diff");
            $(this).addClass("active-diff");

            gridSize = parseInt($(this).data("size"));
            difficultySelected = true;

            createGrid(gridSize);

            $message.stop(true, true)
                .show()
                .css("opacity", 0)
                .text("Difficulty set. Press Start.")
                .animate({ opacity: 1 }, 400);
        });

        // ======================
        // Start Button
        // ======================
        $startBtn.click(function () {

            if (!difficultySelected) {
                alert("Please select a difficulty first!");
                return;
            }

            if (!gameStarted) {

                gameStarted = true;

                $difficultyBtns.prop("disabled", true);

                $difficultyBtns.add($startBtn).fadeOut(600);

                $gridContainer.slideDown(800);
                $roundDisplay.fadeIn(600);

                setTimeout(startRound, 800);
            }
        });

        // ======================
        // Square Click
        // ======================
        $gridContainer.on("click", ".square", function () {

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

    // Burger Menu
    $("#burger").click(function () {
        if ($(window).width() <= 992) {
            $("nav").toggleClass("open");
        }
    });

});