$(document).ready(function () {

        if ($("#gridContainer").length) {

        let activeSquares = [];
        let playerSelections = [];
        let roundActive = false;
        let totalToHighlight = 4;
        
        let gridSize = 16;
        createGrid(gridSize);

        $("#startBtn").click(function () {
            startRound();
        });

        $(".diffBtn").click(function () {
            gridSize = parseInt($(this).data("size"));
            $("#gridContainer").empty();

            // Adjust columns automatically
            let columns = Math.sqrt(gridSize);
            $("#gridContainer").css("grid-template-columns", "repeat(" + columns + ", 80px)");

            createGrid(gridSize);

            $("#message").text("Difficulty set. Press Start.");
        });


        function createGrid(totalSquares) {
            for (let i = 0; i < totalSquares; i++) {
                $("#gridContainer").append("<div class='square'></div>");
            }
        }

        function startRound() {
            activeSquares = [];
            playerSelections = [];
            roundActive = false;

            $(".square").removeClass("active correct incorrect");
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
            }, 2500);
        }

        // Event delegation
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

        function endRound() {
            roundActive = false;

            let correctCount = playerSelections.filter(value =>
                activeSquares.includes(value)
            ).length;

            if (correctCount === totalToHighlight) {
                $("#message").text("Perfect recall!");
            } else {
                $("#message").text("You got " + correctCount + " out of " + totalToHighlight);
            }
        }
    }

});
