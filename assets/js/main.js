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
        const $gameControlsWrapper = $("#gameControlsWrapper");
        const $message = $("#message");

        $gridContainer.hide();
        $roundDisplay.hide();

        // Create grid
        const createGrid = function (totalSquares) {
            $gridContainer.empty();
            for (let i = 0; i < totalSquares; i++) {
                $gridContainer.append("<div class='square'></div>");
            }
            let columns = Math.sqrt(totalSquares);
            $gridContainer.css("grid-template-columns", "repeat(" + columns + ", 1fr)");
        };

        // Difficulty scaling
        const updateDifficultySettings = function () {
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
        };

        const startRound = function () {

            activeSquares = [];
            playerSelections = [];
            roundActive = false;

            $(".square").removeClass("active correct incorrect");

            updateDifficultySettings();
            $roundDisplay.text("Round: " + round);

            let allSquares = $(".square");
            let totalSquares = allSquares.length;

            while (activeSquares.length < totalToHighlight) {
                let randomIndex = Math.floor(Math.random() * totalSquares);
                if (!activeSquares.includes(randomIndex)) {
                    activeSquares.push(randomIndex);
                    allSquares.eq(randomIndex).addClass("active");
                }
            }

            // Fade in the “Select the squares” message smoothly
            setTimeout(function () {
                $(".square").removeClass("active");
                roundActive = true;
                $message.css("opacity", 0).text("Select the squares you remember.").animate({ opacity: 1 }, 400);
            }, highlightSpeed);
        };

        const endRound = function () {

            roundActive = false;

            let correctCount = playerSelections.filter(value =>
                activeSquares.includes(value)
            ).length;

            if (correctCount === totalToHighlight) {

                round++;

                if (round > 25) {
                    $message.text("🎉 You completed NeuroLab! 🎉");
                    return;
                }

                $message.text("Correct! Next round starting...");
                setTimeout(startRound, 2000);

            } else {

                $message.text(
                    "You got " + correctCount + " out of " + totalToHighlight + ". Try again."
                );

                setTimeout(function () {

                    // Restore buttons smoothly
                    $difficultyBtns.add($startBtn).each(function () {
                        let $el = $(this);
                        $el.css({
                            display: "inline-block",
                            opacity: 0,
                            height: "",
                            margin: "",
                            paddingTop: "",
                            paddingBottom: ""
                        }).animate({ opacity: 1 }, 600);
                    });

                    gameStarted = false;

                }, 2000);
            }
        };

        // Difficulty select
        $difficultyBtns.click(function () {

            // Remove previous active highlight
            $difficultyBtns.removeClass("active-diff");

            // Highlight the selected button
            $(this).addClass("active-diff");

            // Store grid size
            gridSize = parseInt($(this).data("size"));
            difficultySelected = true;

            createGrid(gridSize);

            $gridContainer.hide();
            $roundDisplay.hide();

            // Show difficulty message immediately
            $message.css({ opacity: 1 }).text("Difficulty set. Press Start.");
        });

        // Start button
        $startBtn.click(function () {

            if (!difficultySelected) {
                alert("Please select a difficulty first!");
                return;
            }

            if (!gameStarted) {

                gameStarted = true;

                // Disable further difficulty selection
                $difficultyBtns.prop("disabled", true);

                // Lock wrapper height
                let currentHeight = $gameControlsWrapper.outerHeight();
                $gameControlsWrapper.height(currentHeight);

                // Fade out the difficulty message smoothly
                $message.animate({ opacity: 0 }, 400);

                // Collapse buttons smoothly
                $difficultyBtns.add($startBtn).each(function () {

                    let $el = $(this);

                    $el.animate({
                        opacity: 0,
                        height: 0,
                        margin: 0,
                        paddingTop: 0,
                        paddingBottom: 0
                    }, 800, function () {
                        $el.css("display", "none");
                    });

                });

                // Show grid and round before measuring
                $gridContainer.show();
                $roundDisplay.show();

                // Measure full height of wrapper
                let newHeight = $gameControlsWrapper.get(0).scrollHeight;

                // Animate wrapper expansion
                $gameControlsWrapper.animate(
                    { height: newHeight },
                    1400,
                    function () {

                        // Start round first while height is locked
                        startRound();

                        // Release height after highlight animation finishes
                        setTimeout(function () {
                            $gameControlsWrapper.css("height", "auto");
                        }, highlightSpeed + 100);

                    }
                );
            }
        });

        // Square click
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

        // Initialize grid hidden
        createGrid(16);
        $gridContainer.hide();
        $roundDisplay.hide();
    }

    // Burger menu toggle
    $("#burger").click(function () {
        if ($(window).width() <= 992) {
            $("nav").toggleClass("open");
        }
    });

});