stars = []

const onLoad = function() {
  for (let i = 0; i < 400; i++) {
    makeRandomStar(true);
  }
}

window.addEventListener("load", onLoad);

const colors = ["#4d4a88", "#9a524a", "#419ea7", "#d8d8d8", "#a98b4b", "#96784e", "#5f0858", "#649568", "#9796a2"]
const makeRandomStar = function(randomY=false) {
  const x = Math.floor(Math.random() * canvas.clientWidth);
  const color = colors[Math.floor(colors.length * Math.random())];
  stars.push({'x': x, 'y': randomY ? Math.random() * canvas.clientHeight : 0, 'color': color, 'r': 5, 'init': new Date().valueOf() + Math.random() * 6000});
}

const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

let width, height;
const observer = new ResizeObserver(() => {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
});
observer.observe(canvas)


const renderStars = function() {
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const v = new Date().valueOf();
  stars.forEach((star, index) => {
    ctx.fillStyle = star.color;
    ctx.fillRect(star.x, star.y, star.r, star.r);
    ctx.globalAlpha = Math.sin((v - star.init) / 400);
    stars[index].y += 5 + Math.random() * 2 - 1;

    if (stars[index].y >= canvas.height + 10) stars.splice(index, 1);
  });
}

setInterval(renderStars, delay=1/60 * 1000);
setInterval(makeRandomStar, delay=10);
