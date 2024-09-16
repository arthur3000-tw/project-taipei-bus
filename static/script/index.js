initialize();

function initialize() {
  content.display = "flex";
  content.style.justifyContent = "center";
  content.style.backgroundImage = "url('../static/images/bus_background.svg')";
  content.style.backgroundRepeat = "no-repeat";
  content.style.backgroundSize = "cover";

  let title = document.createElement("div");
  title.textContent = "請輸入路線取得公車動態";
  title.style.fontSize = "25px";
  title.style.textAlign = "center";
  title.style.marginTop = "100px";

  let input_div = document.createElement("div");
  input_div.style.textAlign = "center";
  input_div.style.margin = "10px";
  let input = document.createElement("input");
  input.style.fontSize = "25px";
  input.style.width = "200px";
  let button = document.createElement("div");

  button.textContent = "Go"; // You can change this text as needed

  button.style.display = "inline-block";
  button.style.padding = "5px 5px";
  button.style.fontSize = "24px";
  button.style.cursor = "pointer";
  button.style.textAlign = "center";
  button.style.textDecoration = "none";
  button.style.outline = "none";
  button.style.color = "#fff";
  button.style.backgroundColor = "#04AA6D";
  button.style.border = "none";
  button.style.borderRadius = "15px";
  button.style.boxShadow = "0 3px #999";
  button.style.margin = "10px";

  button.addEventListener("mouseover", function () {
    this.style.backgroundColor = "#3e8e41";
  });

  button.addEventListener("mouseout", function () {
    this.style.backgroundColor = "#04AA6D";
  });

  button.addEventListener("mousedown", function () {
    this.style.backgroundColor = "#3e8e41";
    this.style.boxShadow = "0 2px #666";
    this.style.transform = "translateY(4px)";
  });

  button.addEventListener("mouseup", function () {
    this.style.backgroundColor = "#04AA6D";
    this.style.boxShadow = "0 3px #999";
    this.style.transform = "translateY(0)";
  });

  button.addEventListener("click", function () {
    window.location.href = "/realtime/" + input.value;
  });

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      window.location.href = "/realtime/" + input.value;
    }
  });

  input_div.appendChild(input);
  input_div.appendChild(button);

  content.appendChild(title);
  content.appendChild(input_div);
}
