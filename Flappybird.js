$(document).ready(function () {
    const canvas = $("#gameCanvas")[0];
    const ctx = canvas.getContext("2d");
  
    const birdImg = new Image();
    birdImg.src = "https://th.bing.com/th/id/OIP.stMZLkDhoTSYBBqLngZ1OAHaEf?w=900&h=545&rs=1&pid=ImgDetMain"; // Cute bird image
    const pipeTopImg = new Image();
    pipeTopImg.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEKAcgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEG/8QAFxABAAMAAAAAAAAAAAAAAAAAAAExgf/EABYBAQEBAAAAAAAAAAAAAAAAAAABB//EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A0wDCmfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs3otmKgoioKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgP/2Q=="; // Top pipe
    const pipeBottomImg = new Image();
    pipeBottomImg.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEKAcgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEG/8QAFxABAAMAAAAAAAAAAAAAAAAAAAExgf/EABYBAQEBAAAAAAAAAAAAAAAAAAABB//EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A0wDCmfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs3otmKgoioKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgIKAgoCCgP/2Q=="; // Bottom pipe
    const groundHeight = 10;
  
    // Game Variables
    let bird, pipes, score, gameOver;
    const birdSize = 30;
    const gravity = 0.85;
    const lift = -15;
    const pipeWidth = 60;
    const pipeGap = 100;
    const pipeSpeed = 5;
  
    // Initialize Game
    function init() {
      bird = { x: 50, y: canvas.height / 2, velocity: 0 };
      pipes = [];
      score = 0;
      gameOver = false;
  
      $("#restartButton").hide();
      $("#gameMessage").text("Press any key or tap to start flapping!");
      requestAnimationFrame(update);
    }
  
    // Create Pipes
    function createPipe() {
      const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 80)) + 50;
      pipes.push({
        x: canvas.width,
        topHeight,
        bottomHeight: canvas.height - topHeight - pipeGap - groundHeight,
      });
    }
  
    // Check for Collisions
    function checkCollision() {
      if (bird.y + birdSize >= canvas.height - groundHeight || bird.y <= 0) return true;
  
      for (let pipe of pipes) {
        if (
          bird.x < pipe.x + pipeWidth &&
          bird.x + birdSize > pipe.x &&
          (bird.y < pipe.topHeight || bird.y + birdSize > canvas.height - pipe.bottomHeight - groundHeight)
        ) {
          return true;
        }
      }
      return false;
    }
  
    // End Game
    function endGame() {
      gameOver = true;
      $("#restartButton").show();
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "30px Arial";
      ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 10);
      ctx.font = "20px Arial";
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 30);
    }
  
    // Draw Score
    function drawScore() {
      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, 10, 30);
    }
  
    // Update Game
    function update() {
      if (gameOver) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Bird physics
      bird.velocity += gravity;
      bird.y += bird.velocity;
  
      // Draw Bird
      ctx.drawImage(birdImg, bird.x, bird.y, birdSize, birdSize);
  
      // Handle Pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
      }
      pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);
  
      for (let pipe of pipes) {
        pipe.x -= pipeSpeed;
  
        // Draw Pipes
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(pipeBottomImg, pipe.x, canvas.height - pipe.bottomHeight - groundHeight, pipeWidth, pipe.bottomHeight);
  
        // Update Score
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
          pipe.passed = true;
          score++;
        }
      }
  
      // Draw Ground
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
  
      // Draw Score
      drawScore();
  
      // Check Collision
      if (checkCollision()) {
        endGame();
        return;
      }
  
      requestAnimationFrame(update);
    }
  
    // Controls
    $(document).on("keydown click", function () {
      if (!gameOver) {
        bird.velocity = lift;
        $("#gameMessage").text(""); // Clear message when the game starts
      }
    });
  
    // Restart Game
    $("#restartButton").on("click", function () {
      init();
    });
  
    // Start Game
    init();
  });
  