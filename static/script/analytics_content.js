// initialize();

// let last_page_operator_name;

// async function initialize() {
//   // 取得業者名稱與路線總數
//   let response = await fetch("/OperatorRoutes");
//   let data = await response.json();
//   // 生成畫面
//   if (data.status === "ok") {
//     render_operators(data.data);
//   } else {
//     console.log(data.message);
//   }
// }

// // 生成每個業者頁面
// function render_operators(data) {
//   // 建立全部業者 div
//   let operators_div = document.createElement("div");
//   operators_div.style.display = "flex";
//   operators_div.style.flexWrap = "wrap";
//   operators_div.style.justifyContent = "center";
//   operators_div.style.padding = "20px 20px";

//   // 產生每個資料畫面
//   for (element of data) {
//     // 建立業者 div
//     let operator_div = document.createElement("div");
//     operator_div.className = "content-element";
//     operator_div.style.margin = "10px 10px";
//     operator_div.style.padding = "10px 10px";
//     operator_div.style.border = "solid 3px black";
//     operator_div.style.cursor = "pointer";
//     operator_div.id = element.OperatorName;
//     operator_div.addEventListener("click", click_operator);

//     // 建立業者名稱 div
//     let operator_name_div = document.createElement("div");
//     operator_name_div.textContent = "業者名稱：" + element.OperatorName;
//     operator_name_div.style.fontSize = "2rem";
//     operator_div.appendChild(operator_name_div);

//     // 建立業者路線數量 div
//     let operator_route_count_div = document.createElement("div");
//     operator_route_count_div.textContent = "路線總數：" + element.Count;
//     operator_route_count_div.style.fontSize = "2rem";
//     operator_div.appendChild(operator_route_count_div);

//     // 放入 operators_div 中
//     operators_div.appendChild(operator_div);
//   }
//   // 放入 content 中
//   content.appendChild(operators_div);
// }

// // 生成每個路線頁面
// function render_operator_routes(data, title) {
//   // 改變標題
//   let nav_title = document.querySelector(".nav-title");
//   let new_nav_title = nav_title.cloneNode(true);
//   nav_title.parentNode.replaceChild(new_nav_title, nav_title);
//   new_nav_title.textContent = title;
//   new_nav_title.setAttribute("href", "/analytics");
//   last_page_operator_name = title;
//   // 建立全部路線 div
//   let routes_div = document.createElement("div");
//   routes_div.style.display = "flex";
//   routes_div.style.flexWrap = "wrap";
//   routes_div.style.justifyContent = "center";
//   routes_div.style.padding = "20px 20px";

//   // 產生每個資料畫面
//   for (element of data) {
//     // 建立路線 div
//     let route_div = document.createElement("div");
//     route_div.className = "content-element";
//     route_div.style.margin = "10px 10px";
//     route_div.style.padding = "10px 10px";
//     route_div.style.border = "solid 3px black";
//     route_div.style.cursor = "pointer";
//     route_div.id = element.RouteName;
//     route_div.addEventListener("click", click_route);

//     // 建立路線名稱 div
//     let route_name_div = document.createElement("div");
//     route_name_div.textContent = element.RouteName;
//     route_name_div.style.fontSize = "2rem";
//     route_name_div.style.textAlign = "center";
//     route_div.appendChild(route_name_div);

//     // 放入 routes_div 中
//     routes_div.appendChild(route_div);
//   }
//   // 放入 content 中
//   content.appendChild(routes_div);
// }

// 生成路線頁面
function render_route_plates(
  route_last_week,
  route_last_month,
  plate_last_week,
  plate_last_month,
  // title
) {
  // // 改變標題
  // let nav_title = document.querySelector(".nav-title");
  // let new_nav_title = nav_title.cloneNode(true);
  // nav_title.parentNode.replaceChild(new_nav_title, nav_title);
  // new_nav_title.textContent = title;
  // // Disable title href
  // new_nav_title.setAttribute("href", "javascript: void(0)");
  // new_nav_title.addEventListener("click", () =>
  //   click_title_route(last_page_operator_name)
  // );

  // console.log(
  //   route_last_week,
  //   route_last_month,
  //   plate_last_week,
  //   plate_last_month
  // );

  let last_week_div = render_data_div(
    route_last_week,
    plate_last_week,
    "近七天數據"
  );
  let last_month_div = render_data_div(
    route_last_month,
    plate_last_month,
    "近三十天數據"
  );

  content.appendChild(last_week_div);
  content.appendChild(last_month_div);
}

// 生成數據頁面
function render_data_div(route_last_data, plate_last_data, title) {
  // 建立近七天資訊 div
  let data_div = document.createElement("div");
  data_div.style.display = "flex";
  data_div.style.flexDirection = "column";
  data_div.style.padding = "20px 20px";
  data_div.style.border = "3px solid black";
  data_div.style.margin = "20px 20px";

  // 建立資料 title 名稱
  let last_data_title = document.createElement("div");
  last_data_title.style.fontSize = "3rem";
  last_data_title.textContent = title;

  // 建立全部 subroutes 路線 div
  let subroutes_div = document.createElement("div");
  subroutes_div.style.display = "flex";
  subroutes_div.style.flexDirection = "column";
  // subroutes_div.style.alignItems = "center";
  subroutes_div.style.padding = "20px 20px";

  for (route of route_last_data) {
    // 建立 subroute 區塊
    let subroute_div = document.createElement("div");
    subroute_div.style.padding = "20px 20px";
    // 建立 subroute 標題區塊
    let subroute_title_div = document.createElement("div");
    subroute_title_div.style.whiteSpace = "pre-wrap";
    subroute_title_div.style.fontSize = "2.5rem";
    let direction = route.Direction == "去程" ? "往" + route.DestinationStopName : route.Direction == "返程" ? "往" + route.DepartureStopName : ""
    subroute_title_div.textContent =
      route.OperatorName +
      " ---- " +
      route.SubRouteName +
      " ---- " +
      direction + "(" + route.Direction + ")" +
      " ---- " +
      "平均旅程：" +
      Math.floor(route.AVG_TripTime / 3600) +
      " 小時 " +
      Math.floor((route.AVG_TripTime % 3600) / 60) +
      " 分 " +
      Math.floor((route.AVG_TripTime % 3600) % 60) +
      " 秒";

    // 建立 plates 區塊
    let plates_div = document.createElement("div");
    plates_div.style.display = "flex";
    plates_div.style.flexWrap = "wrap";
    subroutes_div.style.padding = "20px 20px";

    for (plate of plate_last_data) {
      if (
        plate.OperatorName === route.OperatorName &&
        plate.SubRouteName === route.SubRouteName &&
        plate.Direction === route.Direction
      ) {
        // 建立車牌 div
        let plate_div = document.createElement("div");
        plate_div.style.whiteSpace = "pre-wrap";
        plate_div.style.fontSize = "2rem";
        plate_div.style.border = "solid 2px black";
        plate_div.style.padding = "10px 10px";
        plate_div.style.margin = "10px 10px";
        plate_div.style.display = "flex"
        plate_div.style.flexDirection = "column"
        plate_div.style.alignItems = "center"

        context = value_to_string(plate.CompareResult);

        plate_div.textContent = plate.PlateNumb + " (" + context + ")";

        let progress_bar_div = createProgressBar(plate.CompareResult);

        plate_div.appendChild(progress_bar_div);
        plates_div.appendChild(plate_div);
      }
    }

    subroute_div.appendChild(subroute_title_div);
    subroute_div.appendChild(document.createElement("hr"));
    subroute_div.appendChild(plates_div);

    subroutes_div.appendChild(subroute_div);
  }

  data_div.appendChild(last_data_title);
  data_div.appendChild(subroutes_div);
  return data_div;
}

// // 點選業者
// async function click_operator() {
//   clear_content();
//   // 取得業者路線
//   let response = await fetch("/Routes/" + this.id);
//   let data = await response.json();
//   // 生成畫面
//   if (data.status === "ok") {
//     render_operator_routes(data.data, this.id);
//   } else {
//     console.log(data.message);
//   }
// }

// // 點選路線
// async function click_route() {
//   clear_content();
//   // 取得路線與車牌內容
//   let responses = await Promise.all([
//     fetch("/LastWeek/RouteTrip/" + this.id),
//     fetch("/LastMonth/RouteTrip/" + this.id),
//     fetch("/LastWeek/PlateTrip/" + this.id),
//     fetch("/LastMonth/PlateTrip/" + this.id),
//   ]);
//   let data = await Promise.all(responses.map((response) => response.json()));
//   // 建立資料變數
//   let route_last_week;
//   let route_last_month;
//   let plate_last_week;
//   let plate_last_month;
//   // 確認狀態
//   for (eachData of data) {
//     if (eachData.status === "error") {
//       console.log(eachData.message);
//     } else {
//       switch (eachData.message) {
//         case "Route Last Week":
//           route_last_week = eachData.data;
//           break;
//         case "Route Last Month":
//           route_last_month = eachData.data;
//           break;
//         case "Plate Last Week":
//           plate_last_week = eachData.data;
//           break;
//         case "Plate Last Month":
//           plate_last_month = eachData.data;
//           break;
//       }
//     }
//   }
//   // 生成頁面
//   render_route_plates(
//     route_last_week,
//     route_last_month,
//     plate_last_week,
//     plate_last_month,
//     this.id
//   );
// }

// // 點選 title 路線
// async function click_title_route(operator_name) {
//   clear_content();
//   // 取得業者路線
//   let response = await fetch("/Routes/" + operator_name);
//   let data = await response.json();
//   // 生成畫面
//   if (data.status === "ok") {
//     render_operator_routes(data.data, operator_name);
//   } else {
//     console.log(data.message);
//   }
// }

// function clear_content() {
//   content.replaceChildren();
// }

// 產生狀態 bar
function createProgressBar(value) {
  // 確保值在 -1 到 1 之間
  value = Math.max(-1, Math.min(1, value));
  // 原本 -1 最快、 1 最慢，改為 1 最快、 -1 最慢
  value = value * -1;
  // 創建容器
  const container = document.createElement("div");
  container.style.width = "100px";
  container.style.height = "15px";
  // container.style.backgroundColor = "#f0f0f0";
  container.style.position = "relative";
  container.style.overflow = "hidden";
  container.style.margin = "10px 10px"
  container.style.border = "solid 1px black"

  // 創建進度條
  const bar = document.createElement("div");
  bar.style.height = "100%";
  bar.style.position = "absolute";
  bar.style.transition = "all 0.5s";

  // 設置顏色和寬度
  if (value < 0) {
    bar.style.right = "50%";
    bar.style.left = "auto";
    bar.style.width = `${Math.abs(value) * 50}%`;
    bar.style.backgroundColor = "red";
  } else {
    bar.style.left = "50%";
    bar.style.width = `${value * 50}%`;
    bar.style.backgroundColor = "green";
  }

  // 創建數值顯示
  // const valueDisplay = document.createElement("div");
  // valueDisplay.textContent = value.toFixed(2);
  // valueDisplay.style.position = "absolute";
  // valueDisplay.style.top = "50%";
  // valueDisplay.style.left = "50%";
  // valueDisplay.style.transform = "translate(-50%, -50%)";
  // valueDisplay.style.color = "black";
  // valueDisplay.style.fontWeight = "bold";

  // 添加元素到容器
  container.innerHTML = "";
  container.appendChild(bar);
  // container.appendChild(valueDisplay);
  return container;
}

function value_to_string(value) {
  if (value >= 1) {
    return "超慢";
  } else if (value < 1 && value >= 0.5) {
    return "很慢";
  } else if (value < 0.5 && value > 0) {
    return "慢";
  } else if (value == 0) {
    return "正常";
  } else if (value < 0 && value > -0.5) {
    return "快";
  } else if (value <= -0.5 && value > -1) {
    return "很快";
  } else if (value <= -1) {
    return "超快";
  }
}
