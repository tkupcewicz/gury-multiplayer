this.Player = function() {
    this.img = new Image();
    this.img.src = 'gury.gif';
    this.height = 16;
    this.x = playerX;
    this.y = h - startHeight - this.height;
    this.vy = 0;
    this.speed = 4;
    this.onGround = true;
    this.secondJump = false;
    this.rescues = 3;
    this.alive = true;
};

Player.prototype.getCurrentBlock = function () {
    return M.points[this.x / blockSize] - this.height;
};

Player.prototype.getCurrentBlockAbs = function () {
    return M.points[this.x / blockSize];
};

Player.prototype.move = function() {
    this.vy += gravity;
    this.x += this.speed;
    this.y += this.vy;
    if (this.y >= this.getCurrentBlock()) {
        if (this.y - 10 < this.getCurrentBlockAbs()) {
            this.y = this.getCurrentBlock();
            this.onGround = true;
            this.secondJump = false;
            this.vy = 0;
        } else {
            this.alive = false;
            G.game_over();
        }
    }
};

Player.prototype.jump = function() {
    if (this.onGround) {
        this.vy = -10;
        this.onGround = false;
    } else if (!this.secondJump) {
        this.vy += -6;
        this.secondJump = true;
    }
};

Player.prototype.rescue = function() {
    if (this.rescues > 0) {
        this.vy = -20;
        this.rescues--;
    }
};

Player.prototype.draw = function() {
    this.move();
    C.drawImage(this.img, this.x, this.y);
};
