$(document).ready(function () {

// ======================
// 404 REDIRECT HANDLER
// ======================
(function() {
  const validPaths = [
    "/neurolabs/",            // Root
    "/neurolabs/index.html",
    "/neurolabs/about.html"   // Add other pages here if needed
  ];

  const currentPath = window.location.pathname;

  // Only redirect if not valid AND not already on 404.html
  if (!validPaths.includes(currentPath) && !currentPath.endsWith("/404.html")) {
    window.location.href = "/neurolabs/404.html"; // redirect to 404 page
    return; // Stop further JS execution
  }
})();

  // ======================
  // NAV ACTIVE LINK
  // ======================
  $("#navLinks a").each(function () {
    if (this.href === window.location.href) {
      $(this).addClass("active");
    }
  });

  // ======================
  // MONITOR READOUT SYSTEM (homepage only)
  // ======================
  if ($("#monitorText").length) {
    const messages = [
      "Initializing NeuroLab...",
      "Loading memory protocols...",
      "Monitoring visual response metrics...",
      "Adaptive pattern calibration online...",
      "Subject tracking engaged...",
      "System ready. Proceed with caution..."
    ];

    const anomalyMessages = [
      "Signal irregularity detected...",
      "Memory pattern deviation logged...",
      "External interference suspected...",
      "Warning: anomaly within test parameters...",
      "Unexpected response variance..."
    ];

    let $monitor = $("#monitorText");
    let index = 0;

    function showMessage() {
      let messageToShow = messages[index];
      if (Math.random() < 0.03) {
        messageToShow = anomalyMessages[Math.floor(Math.random() * anomalyMessages.length)];
      }
      $monitor.text(messageToShow);
      $monitor.css("left", "100%");
      $monitor.animate({ left: "-100%" }, 8000, "linear", function () {
        index = (index + 1) % messages.length;
        showMessage();
      });
    }

    showMessage();

    setInterval(function () {
      if (Math.random() < 0.1) {
        $monitor.css("opacity", 0.5);
        setTimeout(function () {
          $monitor.css("opacity", 1);
        }, 100);
      }
    }, 200);
  }

  // ======================
  // GAME SYSTEM
  // ======================
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
    let difficultyLevel = "";

    const $gridContainer = $("#gridContainer");
    const $roundDisplay = $("#roundDisplay");
    const $difficultyBtns = $(".diffBtn");
    const $startBtn = $("#startBtn");
    const $message = $("#message");

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
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }

    // ======================
    // BOSS GLITCH
    // ======================
    function startBossGlitch() {
      const squares = $(".square");
      let glitchInterval = setInterval(function () {
        let randomSquare = squares.eq(Math.floor(Math.random() * squares.length));
        randomSquare.addClass("glitch");
        setTimeout(function () { randomSquare.removeClass("glitch"); }, 120);
      }, 80);
      setTimeout(function () { clearInterval(glitchInterval); }, 1800);
    }

    // ======================
    // WARNING FLASH
    // ======================
    function bossWarningFlash() {
      let flashes = 0;
      let warningInterval = setInterval(function () {
        $roundDisplay.text(flashes % 2 === 0 ? "⚠ WARNING ⚠" : " ");
        flashes++;
        if (flashes > 6) clearInterval(warningInterval);
      }, 250);
    }

    // ======================
    // GRID CREATION
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
    // DIFFICULTY SCALING
    // ======================
    function updateDifficultySettings() {
      if (round <= 4) { totalToHighlight = 4; highlightSpeed = 2500; }
      else if (round <= 9) { totalToHighlight = 5; highlightSpeed = 2500; }
      else if (round <= 14) { totalToHighlight = 5; highlightSpeed = 1500; }
      else if (round <= 20) { totalToHighlight = 6; highlightSpeed = 2500; }
      else { totalToHighlight = 6; highlightSpeed = 1200; }
    }

    // ======================
    // START ROUND
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

      // ======================
      // MEMORISE MESSAGE
      // ======================
      $message.stop(true, true).show().css("opacity", 0).text("Select the squares you remember.").animate({ opacity: 1 }, 400);

      // ======================
      // TRICK SQUARE AFTER BOSS LEVEL
      // ======================
      if (round >= 21) {
        let trickIndex;
        do { trickIndex = Math.floor(Math.random() * totalSquares); } 
        while (activeSquares.includes(trickIndex));
        const $trickSquare = $(".square").eq(trickIndex);
        $trickSquare.addClass("active correct");
        setTimeout(() => { $trickSquare.removeClass("active correct"); }, 300);
      }

      setTimeout(function () {
        $(".square").removeClass("active");
        roundActive = true;
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

      $("body").css("background", "black").removeClass("boss-dark boss-shake");
      $gridContainer.removeClass("boss-pulse");
      $difficultyBtns.removeClass("active-diff").prop("disabled", false);

      $gridContainer.slideUp(600, function () { $gridContainer.empty(); });
      $roundDisplay.fadeOut(400);
      $difficultyBtns.add($startBtn).each(function () {
        $(this).css({ display: "inline-block", opacity: 0 }).animate({ opacity: 1 }, 600);
      });
      $message.stop(true, true).fadeOut(400, function () { $(this).text(""); });
    }

    // ======================
    // END ROUND
    // ======================
    function endRound() {
      roundActive = false;
      let correctCount = playerSelections.filter((value) => activeSquares.includes(value)).length;

      if (correctCount === totalToHighlight) {
        playSound(soundCorrect);
        round++;

        if (round > 25) {
          playSound(soundVictory);
          fireConfetti();
          $message.stop(true, true).show().css("opacity", 0).text("🎉 You completed NeuroLab! 🎉").animate({ opacity: 1 }, 400);
          setTimeout(function () { $message.fadeOut(400, resetGameCompletely); }, 2500);
          return;
        }

        // BOSS EVENT
        if (round === 21) {
          $message.stop(true, true).show().css("opacity", 0).text("Correct! Next round star—").animate({ opacity: 1 }, 200);

          setTimeout(function () {
            playSound(soundBoss);

            const logs = [
              "SYS_ERR: VISUAL MEMORY CORE",
              "ANOMALY DETECTED",
              "PATTERN MATRIX DESYNC",
              "SYSTEM OVERRIDE ACTIVE"
            ];

            $roundDisplay.text(logs[Math.floor(Math.random() * logs.length)]);
            $("body").addClass("boss-dark boss-shake");
            $gridContainer.addClass("boss-pulse");

            startBossGlitch();
            bossWarningFlash();

            $message.stop(true, true).css("opacity", 0).text("🔥 BOSS LEVEL INCOMING 🔥").animate({ opacity: 1 }, 400);

            setTimeout(function () {
              $("body").removeClass("boss-dark boss-shake").css("background", "black");
              $gridContainer.removeClass("boss-pulse");
              startRound();
            }, 2000);
          }, 700);

          return;
        }

        // ======================
        // SPECIAL ROUND MESSAGES
        // ======================
        if (round === 5) {
          $message.text("Well done! Get ready for the next challenge...");
        } else if (round === 15) {
          $message.text("Impressive focus. Things are about to speed up...");
        } else if (round === 21) {
          $message.text("🔥 Boss Level Incoming 🔥 Stay sharp...");
        } else {
          $message.text("Correct! Next round starting...");
        }
        $message.stop(true, true).show().css("opacity", 0).animate({ opacity: 1 }, 400);

        setTimeout(startRound, 2000);

      } else {
        playSound(soundFail);
        $message.stop(true, true).show().css("opacity", 0).text(`You got ${correctCount} out of ${totalToHighlight}. Try again.`).animate({ opacity: 1 }, 400);
        setTimeout(function () { $message.fadeOut(400, resetGameCompletely); }, 2000);
      }
    }

    // ======================
    // DIFFICULTY SELECT
    // ======================
    $difficultyBtns.click(function () {
      $difficultyBtns.removeClass("active-diff");
      $(this).addClass("active-diff");

      gridSize = parseInt($(this).data("size"));
      difficultySelected = true;
      difficultyLevel = $(this).text().toLowerCase();

      createGrid(gridSize);

      $message.stop(true, true).show().css("opacity", 0).text("Difficulty set. Press Start.").animate({ opacity: 1 }, 400);
    });

    // ======================
    // START BUTTON
    // ======================
    $startBtn.click(function () {
      if (!difficultySelected) { alert("Please select a difficulty first!"); return; }
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
    // SQUARE CLICK
    // ======================
    $gridContainer.on("click", ".square", function () {
      if (!roundActive) return;
      let index = $(this).index();
      if (!playerSelections.includes(index)) {
        playerSelections.push(index);
        $(this).toggleClass(activeSquares.includes(index) ? "correct" : "incorrect");
      }
      if (playerSelections.length === totalToHighlight) endRound();
    });

  } // END GRID CONTAINER CHECK

  // ======================
  // BURGER MENU
  // ======================
  $("#burger").click(function () {
    if ($(window).width() <= 992) $("nav").toggleClass("open");
  });

});