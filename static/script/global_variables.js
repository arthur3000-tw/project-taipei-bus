// search bar
let search_bar_data = [];

// real time page
let routes_data = {};
let plate_trip_last_month;
let plate_trip_last_week;

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