const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const content = document.querySelector(".content");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  if (hamburger.classList.value === "hamburger active") {
    content.style.zIndex = "-1";
  } else {
    content.style.zIndex = "0";
  }
}
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
  content.style.zIndex = "0";
}

function render_title(title){
  // 改變標題
  let nav_title = document.querySelector(".nav-title");
  let new_nav_title = nav_title.cloneNode(true);
  nav_title.parentNode.replaceChild(new_nav_title, nav_title);
  new_nav_title.textContent = title;
  // Disable title href
  new_nav_title.setAttribute("href", "javascript: void(0)");
  new_nav_title.addEventListener("click", () =>
    click_title_route(last_page_operator_name)
  );
}