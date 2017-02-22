	var s = Math.round(10 + (1000 - 10) * Math.random());
	function seed_random(seed) {
		var x;
		if (seed) {
			x = Math.sin(seed) * 10000;
		} else {
      x = Math.sin(s++) * 10000;
    }
		return x - Math.floor(x);
	}

	function rand(min, max, seed, float) {
		if (float) {
			return min + (max - min) * seed_random(seed);
		}
		else {
			return Math.round(min + (max - min)  * seed_random(seed));
		}
	}

    		function animText(id){
			// obracanie
			var txt = document.getElementById(id);
			var rot = parseInt(txt.getAttribute("rotation"));
			var p = 0;
			if (!rot && rot != 0) { rot = 0; txt.rotate(0,-1); p = 1; }
			var last = parseInt(txt.getAttribute("lastrotation"));
			if(rot+p < last) p = -1;
			if(rot+p > last) p = 1;
			if(rot == 10) p = -1;
			if(rot == -10) p = 1;
			txt.rotate(rot+p,rot);
			txt.style.textShadow = rot+p*2 + 'px '+ rot*2 + 'px 5px';

    		if (deg == 360 || deg == 0 ) eq = !eq;
    		deg = deg + eq;
    		txt.style.webkitTextStrokeColor = 'hsl(' + deg + ',100%,90%)';
    		txt.style.color = 'hsl(' + deg + ',70%,70%)';
            document.body.style.background = 'linear-gradient(hsl(' + deg + ',100%,90%) hsl(' + deg + ',100%,90%))';


		}
function simulateKeyPress(character) {
	jQuery.event.trigger({ type : 'keypress', charCode : character });
}