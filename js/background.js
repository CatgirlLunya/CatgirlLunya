const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

let width, height;
const observer = new ResizeObserver(() => {
  width = getWidth();
  height = getHeight();
});
observer.observe(canvas);

const renderAll = function() {
  canvas.width = getWidth();
  canvas.height = getHeight();

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderStars();
  renderComets();
  // renderEnemies();
}

const update = function () {
  updateComets();
  // updateEnemies();
}

setInterval(update, 1000/60);
setInterval(renderAll, 1000/60);

const getWidth = function() {
  return Math.max(document.body.offsetWidth, window.innerWidth);
}

const getHeight = function() {
  return Math.max(document.body.offsetHeight, window.innerHeight);
}
