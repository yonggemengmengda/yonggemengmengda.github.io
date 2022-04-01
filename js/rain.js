(function () {
  "use strict";
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var rain = [];
  var drops = [];
  var gravity = 0.3;
  var wind = -0.04;
  var rain_chance = 1;
  window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  var canvas = document.getElementById("rain-bg");
  var ctx = canvas.getContext("2d");
  var Vector = /*#__PURE__*/ (function () {
    function Vector() {
      var x =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : 0;
      var y =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : 0;

      _classCallCheck(this, Vector);

      this.x = x;
      this.y = y;
    }

    _createClass(Vector, [
      {
        key: "add",
        value: function add(v) {
          if (v.x != null && v.y != null) {
            this.x += v.x;
            this.y += v.y;
          } else {
            this.x += v;
            this.y += v;
          }

          return this;
        },
      },
      {
        key: "copy",
        value: function copy() {
          return new Vector(this.x, this.y);
        },
      },
    ]);

    return Vector;
  })(); //--------------------------------------------

  var Rain = /*#__PURE__*/ (function () {
    function Rain() {
      _classCallCheck(this, Rain);

      this.pos = new Vector(Math.random() * canvas.width, -50);
      this.prev = this.pos;
      this.vel = new Vector();
    }

    _createClass(Rain, [
      {
        key: "update",
        value: function update() {
          const x = Math.random() > 0.8 ? -1 * wind : wind;
          this.prev = this.pos.copy();
          this.vel.y += gravity;
          //this.vel.x += wind;
          this.vel.x += x;
          this.pos.add(this.vel);
        },
      },
      {
        key: "draw",
        value: function draw(ctx) {
          ctx.beginPath();
          ctx.moveTo(this.pos.x, this.pos.y);
          ctx.lineTo(this.prev.x, this.prev.y);
          ctx.stroke();
        },
      },
    ]);

    return Rain;
  })(); //--------------------------------------------

  var Drop = /*#__PURE__*/ (function () {
    function Drop(x, y) {
      _classCallCheck(this, Drop);

      var dist = Math.random() * 12;
      var angle = Math.PI + Math.random() * Math.PI;
      this.pos = new Vector(x, y);
      this.vel = new Vector(Math.cos(angle) * dist, Math.sin(angle) * dist);
    }

    _createClass(Drop, [
      {
        key: "update",
        value: function update() {
          this.vel.y += gravity;
          this.vel.x *= 0.95;
          this.vel.y *= 0.95;
          this.pos.add(this.vel);
        },
      },
      {
        key: "draw",
        value: function draw(ctx) {
          ctx.beginPath();
          ctx.arc(this.pos.x, this.pos.y, 1, 0, Math.PI * 2);
          ctx.fill();
        },
      },
    ]);

    return Drop;
  })(); //--------------------------------------------

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var i = rain.length;

    while (i--) {
      ctx.lineWidth = Math.max(Math.random() * 4, 1);
      var raindrop = rain[i];
      raindrop.update();
      const grd = ctx.createLinearGradient(
        0,
        0,
        raindrop.pos.x + 50,
        raindrop.pos.y
      );
      grd.addColorStop(0.79, "#fff");
      grd.addColorStop(0.81, "#8B00FF");
      grd.addColorStop(0.83, "#0000FF");
      grd.addColorStop(0.85, "#00FFFF");
      grd.addColorStop(0.87, "#00FF00");
      grd.addColorStop(0.89, "#FFFF00");
      grd.addColorStop(0.93, "#FF7F00");
      grd.addColorStop(0.95, "#FF0000");
      grd.addColorStop(1, "#fff");
      ctx.strokeStyle = grd; //"rgba(255,255,255,.8)"; //grd; ;
      ctx.fillStyle = grd; //"rgba(255,255,255,.8)";
      if (raindrop.pos.y >= canvas.height) {
        var n = Math.round(4 + Math.random() * 4);

        while (n--) {
          drops.push(new Drop(raindrop.pos.x, canvas.height));
        }

        rain.splice(i, 1);
      }

      raindrop.draw(ctx);
    }

    i = drops.length;

    while (i--) {
      ctx.lineWidth = Math.max(Math.random() * 4, 1);
      var drop = drops[i];
      drop.update();
      const grd = ctx.createLinearGradient(
        0,
        0,
        drop.pos.x + 300,
        drop.pos.y
      );
      grd.addColorStop(0.79, "#fff");
      grd.addColorStop(0.81, "#8B00FF");
      grd.addColorStop(0.83, "#0000FF");
      grd.addColorStop(0.85, "#00FFFF");
      grd.addColorStop(0.87, "#00FF00");
      grd.addColorStop(0.89, "#FFFF00");
      grd.addColorStop(0.93, "#FF7F00");
      grd.addColorStop(0.95, "#FF0000");
      grd.addColorStop(1, "#fff");
      ctx.strokeStyle = grd; //"rgba(255,255,255,.8)"; //grd; ;
      ctx.fillStyle = grd; //"rgba(255,255,255,.8)";
      drop.draw(ctx);
      if (drop.pos.y > canvas.height) drops.splice(i, 1);
    }

    if (Math.random() < rain_chance) {
      rain.push(new Rain());
    }

    window.inertval = requestAnimFrame(update);
  }
  function throttle(method, mustRunDelay) {
    var tim,
      args = arguments,
      start;
    return function loop() {
      var self = this;
      var now = Date.now();
      if (!start) {
        start = now;
      }
      if (tim) {
        clearTimeout(tim);
      }
      if (now - start >= mustRunDelay) {
        method.apply(self, args);
        start = now;
      } else {
        tim = setTimeout(function () {
          loop.apply(self, args);
        }, 50);
      }
    }
  }
  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.removeEventListener('resize', reRender)
    window.addEventListener('resize', throttle(reRender, 1000), false)
    update();
  }
  function reRender() {
    if (wather != 'rain') return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rainStop();
    update();
  }
  window.rainInit = init;
  window.rainStop = function () {
    window.cancelAnimationFrame(inertval);
    clearInterval(inertval);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
})()
