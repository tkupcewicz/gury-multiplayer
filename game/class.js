    var h = 240;
    var w = 320;
    var canvas = document.getElementById('main_canvas');
    var bg_ = document.getElementById('background');
    var BG = bg_.getContext('2d');


    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $('.btn').show();
      h = 240;
      w = 320;
    }

    bg_.width = w;
    bg_.height = h;

    var fps = 45;
    var now;
    var then = Date.now();
    var interval = 1000 / fps;
    var delta;


    var clouds = [];

    var cloud = [];
    cloud.push(new Image());
    cloud.push(new Image());
    cloud[0].src = 'data:image/png;base64,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';
    cloud[1].src = 'data:image/png;base64,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';

    BG.draw_clouds = function() {
      if (!clouds.length) {
        for (i = 0; i <= rand(5, 20); i++) {
          var c = {
            img: rand(0, 1),
            x: rand(10, w),
            y: rand(0, h - 100),
            v: rand(0.1, 1, true) * rand(0.1, 1, true),
            a: rand(0.5, 1, 10, true)
          };
          clouds.push(c);
        }
      }
      BG.clearRect(0, 0, canvas.width, canvas.height);
      for (var i in clouds) {
        BG.save();
        BG.globalAlpha = clouds[i].a;
        clouds[i].x += clouds[i].v;
        if (clouds[i].x > w) clouds[i].x = -cloud[clouds[i].img].width;
        BG.drawImage(cloud[clouds[i].img], clouds[i].x, clouds[i].y);
        BG.restore();
      }


    };

    init = function() {
      var blockSize = 4,
        initDone = false,
        startHeight = 30,
        playerX = blockSize * parseInt(w * 0.05),
        blockCount = 0,
        gravity = 1,
        mapModifier = [20, 0, 3];


      var Game = function () {
        var C = canvas.getContext('2d');
        var M = new Map();
        this.maxPos = 0;
        this.pause = false;
        this.gameover = false;
        var self = this;
        this.server = new WebSocket("ws://127.0.0.1:" + window.location.search.substr(1));
        this.server.onerror = function (data) {
          alert('Nie mogę połączyć z serverem! Odśwież stronę.');
        };
        this.server.onopen = function (data) {
            self.sendMsg('CONNECT')
        };
        this.server.onmessage = function (msg) {
          self.parseMsg(msg);
        };

      };

      Game.prototype.sendMsg = function(code) {
          var data = '';
          switch (code) {
            case 'CONNECT': {
                data = code;
                break;
            }
            case 'JUMP1': {
                data = 'JUMP1#' + P.id;
                break;
            }
            case 'JUMP2': {
                data = 'JUMP2#' + P.id;
                break;
            }
            case 'JUMP3': {
                data = 'JUMP3#' + P.id;
                break;
            }
            case 'DIED': {
                data = 'DIED#' + P.id;
                break;
            }
            case 'P': {
              data = 'P#' + P.id + '#' + P.x + '#' + P.y;
              break;
            }
            case 'READY': {
              data = 'READY#' + P.id;
              this.ready = true;
              break;
            }
          }
          this.server.send(data);

      };

      Game.prototype.init = function (seed, player_id) {
        M = new Map(seed);
        P = new Player(true, player_id);
        this.ready = false;
        PLAYERS = {};
        PLAYERS[player_id] = P;
        this.maxPos = P.x;
        canvas.height = h;
        canvas.width = w;
        this.draw_rescues();
        BG.draw_clouds();
        $('#gameover').hide();
        initDone = true;
        this.pause = true;
      };

      Game.prototype.addPlayer = function(player_id) {
          if (PLAYERS[player_id] === undefined)
            PLAYERS[player_id] = new Player(false, player_id);
      };

      Game.prototype.draw_particles = function (player) {
        if (!player.particles) {
          player.particles = [];
          var i = 0;
          while (i < 100) {
            player.particles.push({
              x: player.x,
              y: player.y
            });
            i++;
          }
        }
        for (i in player.particles) {
          C.beginPath();
          C.rect(player.particles[i].x, player.particles[i].y, rand(1, 20), rand(1, 30));
          player.particles[i].x += rand(-10, 2) + gravity;
          player.particles[i].y += Math.PI * rand(-4, 10) + gravity;
          C.fillStyle = 'red';
          C.fill();
        }
      };
      Game.prototype.game_over = function () {

        this.gameover = true;
        this.sendMsg('DIED');
        if (!localStorage['best'] || localStorage['best'] < parseInt($('#score').text())) {
          localStorage['best'] = parseInt($('#score').text());
        }
        $('#gameover .score').text($('#score').text());
        $('#gameover .best').text(localStorage['best']);
        $('#gameover').show();


      };

      Game.prototype.draw_rescues = function () {
        var rescues = document.getElementById('rescues');
        rescues.innerHTML = '';

        for (var i = 0; i < 3; i++) {
          var r = document.createElement('span');
          if (i < P.rescues) {
            r.textContent = '* ';
          } else {
            r.textContent = '~ ';
          }
          rescues.appendChild(r);
        }
      };

      Game.prototype.parseMsg = function (msg) {
        var data = msg.data.split('#');
        var method = data[0];
        switch (method) {
          case 'CONNECTED': {
            this.init(parseInt(data[1]), parseInt(data[2]));
            break;
          }
          case 'SERVER_FULL': {
              alert('Przykro nam, serwer jest pełny! Poczekaj aż ktoś zrezygnuje i odśwież stronę.');
              break;
          }
          case 'ADD_PLAYER': {
            this.addPlayer(parseInt(data[1]));
            break;
          }
          case 'P': {
            console.log(P.id != parseInt(data[1]))
            if (P.id != parseInt(data[1])) {
              PLAYERS[parseInt(data[1])].x = parseInt(data[2]);
              PLAYERS[parseInt(data[1])].y = parseInt(data[3]);
            }
            break;
          }
          case 'ALL_READY': {
            this.startGame();
          }

        }
      };

      Game.prototype.draw = function () {
        C.save();
        C.setTransform(1, 0, 0, 1, 0, 0);
        C.clearRect(0, 0, canvas.width, canvas.height);

        C.restore();

        BG.draw_clouds();
        M.draw();
        if (!this.gameover)
          C.translate(-P.speed, 0);

        for (var i in PLAYERS) {
          PLAYERS[i].draw();
        }
      };

      Game.prototype.startGame = function() {
          var self = this;
          var t = 'Gra rozpocznie się za ';
          var g = 3;
          $('#hello').text(t + g + ' sekundy.');
          var z = setInterval(function() {
              g -= 1;
              $('#hello').text(t + g + ' sekundy.');
            }, 1000);
          setTimeout(function() {
            $('#hello').hide();
            self.pause = false;
            self.loop();
            clearInterval(z);
          }, g * 1000);


      }

      Game.prototype.keyPress = function (event) {
        // spacebar
        if (event.charCode == 32) {
          if (!G.ready) {
              this.sendMsg('READY')
          }
          else if (P.alive) {
            P.jump();
          }
        } else if (event.charCode == 13 && !this.pause && P.alive) {
          P.rescue();
          this.draw_rescues();
        }
      };

      Game.prototype.loop = function () {
        if (this.pause === false) {
          requestAnimationFrame(this.loop.bind(this));
          now = Date.now();
          delta = now - then;

          if (delta > interval) {
            then = now - (delta % interval);
            $('#score').text(P.x - playerX);
            this.draw();
          }
        }
      };

      var Player = function (local, player_id) {
        this.img = new Image();
        this.id = player_id;
        this.local = local;
        this.name = '???';
        this.img.src = 'data:image/gif;base64,R0lGODlhBwAQAKIAAAAAAP///+Abav/jCj02Nv///wAAAAAAACH5BAEAAAUALAAAAAAHABAAAAMdSErVy2618qa4wmKNxejXtzUdl5FjUaKXOQ3wMCUAOw==';
        this.height = 16;
        this.x = playerX;
        this.y = h - startHeight - this.height;
        this.vy = 0;
        this.speed = 4;
        this.onGround = true;
        this.secondJump = false;
        this.rescues = 3;
        this.alive = true;
        this.particles = undefined;
        this.snd = new Audio("jump.mp3");
        this.moves = [];
      };

      Player.prototype.getCurrentBlock = function () {
        return M.points[this.x / blockSize] - this.height;
      };

      Player.prototype.getCurrentBlockAbs = function () {
        return M.points[this.x / blockSize];
      };

      Player.prototype.move = function () {
        if (this.alive) {
          this.vy += gravity;
          if (this.local) {
            this.x += this.speed;
            this.y += this.vy;
          }

          if (this.local && this.y >= this.getCurrentBlock()) {
            if (this.y - 10 < this.getCurrentBlockAbs()) {
              this.y = this.getCurrentBlock();
              this.onGround = true;
              this.secondJump = false;
              this.vy = 0;
            } else {
              this.alive = false;
              G.draw_particles(this);
              this.snd = new Audio("dead.mp3");
              // this.snd.play();
              if (this.local) G.game_over();
            }
          }
          if (this.local) G.sendMsg('P');
        }

      };

      Player.prototype.jump = function () {
        if (this.onGround) {
          this.vy = -10;
          this.snd.pause();
          this.snd = new Audio("jump.mp3");
          // this.snd.play();
          this.onGround = false;
          G.sendMsg('JUMP1');
        } else if (!this.secondJump) {
          this.vy += -6;
          this.secondJump = true;
          G.sendMsg('JUMP2');
        }
      };

      Player.prototype.rescue = function () {
        if (this.rescues > 0) {
          this.vy = -20;
          this.rescues--;
          G.sendMsg('JUMP3')
        }
      };

      Player.prototype.draw = function () {
        this.move();
        C.drawImage(this.img, this.x, this.y);
      };

      var Map = function (seed) {
        this.mapStart = this.blockCount = this.holes = this.last = this.tmp = this.terrain = 0;
        this.mapInitDone = false;
        this.points = [];
        this.seed = seed;
        this.generate();
      };

      Map.prototype.rand = function (min, max, float) {
        float = float ? float : false;
        return rand(min, max, this.seed++, float)
      };

      Map.prototype.generate = function () {
        for (z = 0; z < 1000; z++) {
          var points = [],
            howMany = (initDone !== true) ? w / blockSize : 1;
          for (var i = 0; i < howMany; i++) {
            var terrain_type = this.rand(1, 50);
            var tt = 0;
            var b = 0;

            if (terrain_type < 10) tt = mapModifier[0];
            if (terrain_type > 10 && terrain_type < 40) tt = mapModifier[1];
            if (terrain_type > 10) tt = mapModifier[2];
            if (this.rand(1, 2) == 1 && this.last > 100 && blockCount > this.mapStart + 20 || this.last > h - 50) b = -this.rand(1, tt);
            else b = this.rand(1, tt);

            if (this.mapInitDone === false && blockCount < playerX / 3) {
              this.last = startHeight;
              this.hole = 999;
            } else {
              this.last = this.rand(this.last, this.last + b);
              this.hole = this.rand(0, 160)
            }

            if (this.hole < 8 && this.holes <= 10 && this.terrain > 7) {
              for (p = 1; p <= this.rand(5, 20); p++) {
                blockCount++;
                points.push(h);
              }
            } else {
              blockCount++;
              points.push(h - this.last);
            }

            if (points[points.length - 1] == h) {
              this.holes++;
              this.terrain = 0;
            } else {
              this.holes = 0;
              this.terrain++;
            }
          }
          this.points.push.apply(this.points, points);
          if (blockCount > playerX / 3) this.mapInitDone = true;


        }
      };


      Map.prototype.draw = function (b) {
        var count = (initDone === true) ? 1 : blockCount;
        var start = P.x / P.speed - playerX;
        var end = start + playerX + w / 2;
        C.fillStyle = '#111';
        for (i = start; i <= end + count; i++) {
          C.beginPath();
          C.fillRect(i * blockSize, this.points[i], blockSize, h - this.points[i]);
          C.closePath();
        }
      };

      var C = canvas.getContext('2d');
      var P;

      var M;
      return new Game();

    };
    var PLAYERS;
    G = init();

    function reset() {
      G.pause = true;
      clouds = [];
      G = undefined;
      G = init();
      $('#hello').show();
    }


    function randomize() {
      for (var i = 0; i < mapModifier.length; i++) mapModifier[i] = rand(0, 100);
      reset();
    }
    window.onkeypress = function(event) {
      if (event.charCode == 114 && G.gameover) {
        reset();

      } else G.keyPress(event)
    };
    //$('#game_container').width($('#game_container').height() / 3 * 4);