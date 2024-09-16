const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");

searchInput.addEventListener("input", handleInput);

function handleInput() {
  // 清除連線
  if (wsClient != null) {
    wsClient.disconnect();
  }

  const searchTerm = searchInput.value.trim();
  clearResults();

  if (searchTerm.length === 0) {
    return;
  }

  const suggestions = fetchSuggestions(searchTerm);
  displayResults(suggestions);
}

function fetchSuggestions(searchTerm) {
  // search_bar_data 為搜尋資料的來源
  return search_bar_data.filter((item) => item.includes(searchTerm));
}

function clearResults() {
  // while (resultsDiv.firstChild) {
  //   resultsDiv.removeChild(resultsDiv.firstChild);
  // }
  clear_content();
}

function displayResults(suggestions) {
  let routes_div = document.createElement("div");

  if (suggestions.length === 0) {
    // const noResultPara = document.createElement("p");
    // noResultPara.textContent = "沒有找到匹配的結果";
    // resultsDiv.appendChild(noResultPara);
    // let route_div = document.createElement("div");
    // route_div.textContent = "沒有找到匹配的結果";
    // route_div.style.fontSize = "30px"
    // route_div.style.margin = "20px"
    // routes_div.appendChild(route_div);
    // content.appendChild(routes_div);
    return;
  }
  suggestions.forEach((item) => {
    // const resultItem = document.createElement("div");
    // resultItem.className = "result-item";
    // resultItem.textContent = item;
    // resultsDiv.appendChild(resultItem);
    //
    item = item.split(" ")[0];
    // 搜尋結果產生
    let route_div = document.createElement("div");
    route_div.className = "result-item";
    route_div.style.fontSize = "30px";
    route_div.style.cursor = "pointer";
    route_div.style.whiteSpace = "pre";
    route_div.textContent =
      item +
      "    " +
      routes_data[item].DepartureStopName +
      " - " +
      routes_data[item].DestinationStopName;
    route_div.id = item;
    route_div.addEventListener("click", direct_to_page);

    routes_div.appendChild(route_div);
  });
  content.appendChild(routes_div);
}

function push_search_bar_data(data, attribute) {
  // 加入幹線原路線名稱，搜尋時用原路線可搜尋到
  switch (data[attribute]) {
    case "和平幹線":
      search_bar_data.push(data[attribute] + " 15");
      return;
    case "復興幹線":
      search_bar_data.push(data[attribute] + " 74");
      return;
    case "中山幹線":
      search_bar_data.push(data[attribute] + " 220");
      return;
    case "忠孝幹線":
      search_bar_data.push(data[attribute] + " 232副");
      return;
    case "羅斯福路幹線":
      search_bar_data.push(data[attribute] + " 236");
      return;
    case "仁愛幹線":
      search_bar_data.push(data[attribute] + " 263");
      return;
    case "承德幹線":
      search_bar_data.push(data[attribute] + " 266");
      return;
    case "敦化幹線":
      search_bar_data.push(data[attribute] + " 285");
      return;
    case "內湖幹線":
      search_bar_data.push(data[attribute] + " 287");
      return;
    case "民生幹線":
      search_bar_data.push(data[attribute] + " 518");
      return;
    case "信義幹線":
      search_bar_data.push(data[attribute] + " 588");
      return;
    case "重慶幹線":
      search_bar_data.push(data[attribute] + " 601");
      return;
    case "北環幹線":
      search_bar_data.push(data[attribute] + " 620");
      return;
    case "松江新生幹線":
      search_bar_data.push(data[attribute] + " 642");
      return;
    case "基隆路幹線":
      search_bar_data.push(data[attribute] + " 650");
      return;
    case "南京幹線":
      search_bar_data.push(data[attribute] + " 棕9");
      return;
    case "民權幹線":
      search_bar_data.push(data[attribute] + " 紅32");
      return;
    case "南環幹線":
      search_bar_data.push(data[attribute] + " 綠1");
      return;
    case "東環幹線":
      search_bar_data.push(data[attribute] + " 綠16");
      return;
  }
  search_bar_data.push(data[attribute]);
}

function direct_to_page() {
  window.location.href = "/realtime/" + this.id.split(" ")[0];
}
