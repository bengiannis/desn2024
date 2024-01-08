export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.7;
  GRAVITY = 0.4;

  JUMP_ACCELERATION = 0.05; // New acceleration constant
  currentAcceleration = 0; // Current acceleration

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 9.5 * scaleRatio;
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "/game/images/standing_still.png";
    this.image = this.standingStillImage;

    const dinoRunImage1 = new Image();
    dinoRunImage1.src = "/game/images/dino_run1.png";

    const dinoRunImage2 = new Image();
    dinoRunImage2.src = "/game/images/dino_run2.png";

    this.dinoRunImages.push(dinoRunImage1);
    this.dinoRunImages.push(dinoRunImage2);

    //keyboard
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    //touch
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  touchstart = () => {
    this.jumpPressed = true;
  };

  touchend = () => {
    this.jumpPressed = false;
  };

  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(frameTimeDelta);
  }

  // jump(frameTimeDelta) {
  //   if (this.jumpPressed) {
  //     this.jumpInProgress = true;
  //   }

  //   if (this.jumpInProgress && !this.falling) {
  //     if (
  //       this.y > this.canvas.height - this.minJumpHeight ||
  //       (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
  //     ) {
  //       this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
  //     } else {
  //       this.falling = true;
  //     }
  //   } else {
  //     if (this.y < this.yStandingPosition) {
  //       this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
  //       if (this.y + this.height > this.canvas.height) {
  //         this.y = this.yStandingPosition;
  //       }
  //     } else {
  //       this.falling = false;
  //       this.jumpInProgress = false;
  //     }
  //   }
  // }

  jump(frameTimeDelta) {
    if (this.jumpPressed && !this.jumpInProgress) {
      this.jumpInProgress = true;
      this.currentAcceleration = -this.JUMP_SPEED; // Start with upward acceleration
    }

    if (this.jumpInProgress) {
      this.y += this.currentAcceleration * frameTimeDelta * this.scaleRatio;
      this.currentAcceleration += this.JUMP_ACCELERATION; // Gravity effect

      if (this.y >= this.yStandingPosition) { // Check if player is back on the ground
        this.y = this.yStandingPosition; // Reset to standing position
        this.jumpInProgress = false;
        this.falling = false;
        this.currentAcceleration = 0; // Reset acceleration
      }
    }
  }

  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.dinoRunImages[0]) {
        this.image = this.dinoRunImages[1];
      } else {
        this.image = this.dinoRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  reset() {
    // Reset jump and movement variables
    this.jumpPressed = false;
    this.jumpInProgress = false;
    this.falling = false;
    this.currentAcceleration = 0;
  
    // Reset position
    this.x = 10 * this.scaleRatio;
    this.y = this.canvas.height - this.height - 9.5 * this.scaleRatio;
  
    // Reset animation
    this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    this.image = this.standingStillImage;
  }
}
