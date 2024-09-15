const comets = []

const makeComet = function() {
  if (Math.random() > 0.3) return;

  for (let i = 0; i < Math.round(Math.random() * 3); i++) {
    let x, y;
    if (Math.random() < 0.5) {
      x = getWidth() * Math.random() / 2 + getWidth() / 2;
      y = 0;
    } else {
      x = getWidth();
      y = Math.random() * getHeight() - getHeight() / 2;
    }
    comets.push({'x': x, 'y': y})
  }
}

function strokeStar(x, y, r, n, inset) { // https://stackoverflow.com/a/45140101
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0,0-r);
  for (let i = 0; i < n; i++) {
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - (r*inset));
    ctx.rotate(Math.PI / n);
    ctx.lineTo(0, 0 - r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const renderComets = function() {
  ctx.globalAlpha = 1;
  comets.forEach((element) => {
    ctx.save();
    ctx.strokeStyle = ctx.createLinearGradient(element.x, element.y, element.x+50, element.y-50);
    ctx.strokeStyle.addColorStop(0, "white");
    ctx.strokeStyle.addColorStop(0.2, "red");
    ctx.strokeStyle.addColorStop(0.4, "orange");
    ctx.strokeStyle.addColorStop(0.6, "yellow");
    ctx.strokeStyle.addColorStop(1, "black");
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(element.x + 50, element.y-50);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = ctx.fillStyle = "white";
    strokeStar(element.x, element.y, 5, 5, 2);
  });
}

const updateComets = function () {
  comets.forEach((element, index) => {
    element.x -= 10;
    element.y += 10;
    if (element.x < -100 || element.y > getHeight() + 100) {
      comets.splice(index, 1);
    }
  })
}

// setInterval(makeComet, 100);
