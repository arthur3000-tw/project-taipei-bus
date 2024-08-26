// search bar
let search_bar_data = [];

// real time page
let routes_data = {};

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
