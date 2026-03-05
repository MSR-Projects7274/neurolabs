$(document).ready(function () {

  // Highlight active nav link
  $("#navLinks a").each(function () {
    if (this.href === window.location.href) {
      $(this).addClass("active");
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

    // ======================
    // SOUND EFFECTS
    // ======================

    const soundCorrect = document.getElementById("soundCorrect");
    const soundFail = document.getElementById("soundFail");
    const soundBoss = document.getElementById("soundBoss");
    const soundVictory = document.getElementById("soundVictory");

    function playSound(sound) {
      if (!sound) return;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }

    $gridContainer.hide();
    $roundDisplay.hide();
    $message.hide();

    // ======================
    // CONFETTI
    // ======================

    function fireConfetti() {

      const duration = 1200;
      const end = Date.now() + duration;

      (function frame() {

        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });

        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }

      })();
    }

    // ======================
    // BOSS GLITCH EFFECT
    // ======================

    function startBossGlitch() {

      const squares = $(".square");

      let glitchInterval = setInterval(function () {

        let randomSquare = squares.eq(Math.floor(Math.random() * squares.length));

        randomSquare.addClass("glitch");

        setTimeout(function () {
          randomSquare.removeClass("glitch");
        }, 120);

      }, 80);

      setTimeout(function () {
        clearInterval(glitchInterval);
      }, 1800);
    }

    // ======================
    // WARNING FLASH
    // ======================

    function bossWarningFlash() {

      let flashes = 0;

      let warningInterval = setInterval(function () {

        if (flashes % 2 === 0) {
          $roundDisplay.text("⚠ WARNING ⚠");
        } else {
          $roundDisplay.text(" ");
        }

        flashes++;

        if (flashes > 6) {
          clearInterval(warningInterval);
        }

      }, 250);

    }

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
      }
      else if (round <= 9) {
        totalToHighlight = 5;
        highlightSpeed = 2500;
      }
      else if (round <= 14) {
        totalToHighlight = 5;
        highlightSpeed = 1500;
      }
      else if (round <= 20) {
        totalToHighlight = 6;
        highlightSpeed = 2500;
      }
      else {
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

        $message
          .stop(true, true)
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

      $("body").css("background", "black");
      $("body").removeClass("boss-dark boss-shake");

      $gridContainer.removeClass("boss-pulse");

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

      let correctCount = playerSelections.filter((value) =>
        activeSquares.includes(value)
      ).length;

      if (correctCount === totalToHighlight) {

        playSound(soundCorrect);

        round++;

        // GAME COMPLETE
        if (round > 25) {

          playSound(soundVictory);
          fireConfetti();

          $message
            .stop(true, true)
            .show()
            .css("opacity", 0)
            .text("🎉 You completed NeuroLab! 🎉")
            .animate({ opacity: 1 }, 400);

          setTimeout(function () {
            $message.fadeOut(400, resetGameCompletely);
          }, 2500);

          return;
        }

        // ======================
        // BOSS INTERRUPT
        // ======================

        if (round === 21) {

          $message
            .stop(true, true)
            .show()
            .css("opacity", 0)
            .text("Correct! Next round star—")
            .animate({ opacity: 1 }, 200);

          setTimeout(function () {

            playSound(soundBoss);

            $("body").addClass("boss-dark boss-shake");
            $gridContainer.addClass("boss-pulse");

            startBossGlitch();
            bossWarningFlash();

            $message
              .stop(true, true)
              .css("opacity", 0)
              .text("🔥 BOSS LEVEL INCOMING 🔥")
              .animate({ opacity: 1 }, 400);

            setTimeout(function () {

              $("body").removeClass("boss-dark boss-shake");
              $("body").css("background", "black");

              $gridContainer.removeClass("boss-pulse");

              startRound();

            }, 2000);

          }, 700);

          return;
        }

        // ======================
        // NORMAL MESSAGE
        // ======================

        let nextMessage = "Correct! Next round starting...";

        if (round === 5) {
          nextMessage = "Well done! Get ready for the next challenge...";
        }
        else if (round === 15) {
          nextMessage = "Impressive focus. Things are about to speed up...";
        }

        $message
          .stop(true, true)
          .show()
          .css("opacity", 0)
          .text(nextMessage)
          .animate({ opacity: 1 }, 400);

        setTimeout(startRound, 2000);

      }

      else {

        playSound(soundFail);

        $message
          .stop(true, true)
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

      $message
        .stop(true, true)
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
        }
        else {
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