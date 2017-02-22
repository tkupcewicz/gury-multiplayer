Map = function(seed) {
    this.mapStart = this.blockCount = this.holes = this.last = this.tmp = this.terrain = 0;
    this.mapInitDone = false;
    this.points = [];
    this.seed = 123;
    this.generate();
};

Map.prototype.rand = function(min, max, float) {
  float = float ? float : false;
  return rand(min, max, this.seed, float)
};

Map.prototype.generate = function() {
    for (z = 0; z < 1000; z++) {
        var points = [],
            howMany = (initDone !== true) ? w / blockSize : 1;
        for (var i = 0; i < howMany; i++) {
            var terrain_type = this.rand(1, 50);
            var tt = b = 0;

            if (terrain_type < 10) tt = mapModifier[0];
            if (terrain_type > 10 && terrain_type < 40) tt = mapModifier[1];
            if (terrain_type > 10) tt = mapModifier[2];
            if (this.rand(1, 2) == 1 && this.last > 100 && blockCount > this.mapStart + 20) b = -rand(1, tt);
            else b = +rand(1, tt);



            if (this.mapInitDone === false && blockCount < playerX / 3) {
                this.last = startHeight;
                this.hole = 999;
            } else {
                this.last = rand(this.last, this.last + b);
                this.hole = rand(0, 160)
            }
            if (this.hole < 8 && this.holes <= 10 && this.terrain > 5) {
                for (p = 1; p <= rand(5, 20); p++) {
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


Map.prototype.draw = function(b) {
    //this.points.splice(0, 1);
    //this.points.push.apply(this.points, a.data);
    var count = (initDone === true) ? 1 : blockCount;
    var start = P.x / P.speed - playerX;
    var end = start + playerX + w / 2;
    for (i = start; i <= end + count; i++) {
        C.beginPath();
        C.fillRect(i * blockSize, this.points[i], blockSize, h - this.points[i]);
        C.closePath();
    }
};








	function pointsToArray(points){
		var arr = [];
		points.pop();
		for(i=0;i<=points.length;i++){
			arr.push(points[i+1]);
			i++;
		}
		return arr;
	}
	function arrayToPoints(arr) {
		var poi = [];
		for (i=0;i<arr.length;i++){
			poi.push(i*GAME.blockSize);
			poi.push(arr[i]);
		}
		poi.push(i*GAME.blockSize,h);
		return poi;
	}
	function saveMap(){
		var map = []
		for(i=0;i<=mapPoints.length;i++){
			map.push(h-mapPoints[i]);
		}
		map.pop();map.pop();
		var w = window.open();
		w.document.writeln(map);
	}
