initialize();

async function initialize() {
  // 取得業者名稱與路線總數
  let response = await fetch("/OperatorRoutes");
  let data = await response.json();
  // 生成畫面
  if (data.status === "ok") {
    render_operators(data.data);
  } else {
    console.log(data.message);
  }
}

// 生成業者頁面
function render_operators(data) {
  // 建立全部業者 div
  let operators_div = document.createElement("div");
  operators_div.style.display = "flex";
  operators_div.style.flexWrap = "wrap";
  operators_div.style.justifyContent = "center";
  operators_div.style.padding = "20px 20px";

  // 產生每個資料畫面
  for (element of data) {
    // 建立業者 div
    let operator_div = document.createElement("div");
    operator_div.className = "content-element";
    operator_div.style.margin = "10px 10px";
    operator_div.style.padding = "10px 10px";
    operator_div.style.border = "solid 3px black";
    operator_div.style.cursor = "pointer";
    operator_div.id = element.OperatorName;
    operator_div.addEventListener("click", click_operator);

    // 建立業者名稱 div
    let operator_name_div = document.createElement("div");
    operator_name_div.textContent = "業者名稱：" + element.OperatorName;
    operator_name_div.style.fontSize = "2rem";
    operator_div.appendChild(operator_name_div);

    // 建立業者路線數量 div
    let operator_route_count_div = document.createElement("div");
    operator_route_count_div.textContent = "路線總數：" + element.Count;
    operator_route_count_div.style.fontSize = "2rem";
    operator_div.appendChild(operator_route_count_div);

    // 放入 operators_div 中
    operators_div.appendChild(operator_div);
  }
  // 放入 content 中
  content.appendChild(operators_div);
}

// 生成路線頁面
function render_operator_routes(data, title) {
  // 改變標題
  let nav_title = document.querySelector(".nav-title");
  nav_title.textContent = title;
  // 建立全部路線 div
  let routes_div = document.createElement("div");
  routes_div.style.display = "flex";
  routes_div.style.flexWrap = "wrap";
  routes_div.style.justifyContent = "center";
  routes_div.style.padding = "20px 20px";

  // 產生每個資料畫面
  for (element of data) {
    // 建立路線 div
    let route_div = document.createElement("div");
    route_div.className = "content-element";
    route_div.style.margin = "10px 10px";
    route_div.style.padding = "10px 10px";
    route_div.style.border = "solid 3px black";
    route_div.style.cursor = "pointer";
    route_div.id = element.RouteName;
    route_div.addEventListener("click", click_route);

    // 建立路線名稱 div
    let route_name_div = document.createElement("div");
    route_name_div.textContent = element.RouteName;
    route_name_div.style.fontSize = "2rem";
    route_name_div.style.textAlign = "center";
    route_div.appendChild(route_name_div);

    // 放入 routes_div 中
    routes_div.appendChild(route_div);
  }
  // 放入 content 中
  content.appendChild(routes_div);
}

// 生成路線頁面
function render_route(data, title) {
  // 改變標題
  let nav_title = document.querySelector(".nav-title");
  nav_title.textContent = title;
}

async function click_operator() {
  clear_content();
  // 取得業者路線
  let response = await fetch("/Routes/" + this.id);
  let data = await response.json();
  // 生成畫面
  if (data.status === "ok") {
    console.log(data.data);
    render_operator_routes(data.data, this.id);
  } else {
    console.log(data.message);
  }
}

async function click_route() {
  console.log(this.id);
  clear_content();
  // 取得路線內容
  // FIXME:
  let response = await fetch("/Routes/" + this.id);
  let data = await response.json();
  // 生成畫面
  if (data.status === "ok") {
    console.log(data.data);
    render_route(data.data, this.id);
  } else {
    console.log(data.message);
  }
}

function clear_content() {
  content.replaceChildren();
}
