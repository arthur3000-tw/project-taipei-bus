// search bar
let search_bar_data = [];

// real time page
let routes_data = {};
let plate_trip_last_month;
let plate_trip_last_week;

// map
let map;
let bus_go = [];
let bus_back = [];
// 取得 bus icon 存於 local
if (localStorage.getItem("bus_go") == null) {
  save_image_to_local_storage("../static/images/bus_go.png", "bus_go");
}
if (localStorage.getItem("bus_back") == null) {
  save_image_to_local_storage("../static/images/bus_back.png", "bus_back");
}
// 建立 map 中的 bus icon
let bus_icon_go;
let bus_icon_back;
try {
  bus_icon_go = L.icon({
    iconUrl: localStorage.getItem("bus_go"),
    iconSize: [50, 18.7],
  });
} catch (e) {
  console.log(e);
}
try {
  bus_icon_back = L.icon({
    iconUrl: localStorage.getItem("bus_back"),
    iconSize: [50, 18.7],
  });
} catch (e) {
  console.log(e);
}

// navbar
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// content div
const content = document.querySelector(".content");

// 清除 content
function clear_content() {
  content.replaceChildren();
}

// analytics page
let last_page_operator_name;

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

// websocket
let wsClient;

// 從後端獲取圖片並儲存到 localStorage
async function save_image_to_local_storage(image_url, image_name) {
  try {
    // 1. 從後端獲取圖片
    const response = await fetch(image_url);
    const blob = await response.blob();

    // 2. 將圖片轉換為 Base64 字串
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64data = reader.result;

      // 3. 將 Base64 字串儲存在 localStorage 中
      localStorage.setItem(image_name, base64data);
      console.log("圖片已成功儲存到 localStorage");
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("儲存圖片時發生錯誤:", error);
  }
}
