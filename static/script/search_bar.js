const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");

// search_bar_data 為搜尋資料的來源

searchInput.addEventListener("input", handleInput);

function handleInput() {
  const searchTerm = searchInput.value.trim();
  clearResults();

  if (searchTerm.length === 0) {
    return;
  }

  const suggestions = fetchSuggestions(searchTerm);
  displayResults(suggestions);
}

function fetchSuggestions(searchTerm) {
  if (searchTerm.length === 1) {
    // 對於單個字符，搜索包含該字符的所有項目
    return search_bar_data.filter((item) => item.includes(searchTerm));
  } else {
    // 對於兩個或更多字符，搜索包含這些連續字符的項目
    return search_bar_data.filter((item) => item.includes(searchTerm));
  }
}

function clearResults() {
  // while (resultsDiv.firstChild) {
  //   resultsDiv.removeChild(resultsDiv.firstChild);
  // }
  clear_content()
}

function displayResults(suggestions) {

  let routes_div = document.createElement("div");
  
  if (suggestions.length === 0) {
    // const noResultPara = document.createElement("p");
    // noResultPara.textContent = "沒有找到匹配的結果";
    // resultsDiv.appendChild(noResultPara);
    let route_div = document.createElement("div")
    route_div.textContent = "沒有找到匹配的結果"
    routes_div.appendChild(route_div)
    content.appendChild(routes_div);
    return;
  }

  suggestions.forEach((item) => {
    // const resultItem = document.createElement("div");
    // resultItem.className = "result-item";
    // resultItem.textContent = item;
    // resultsDiv.appendChild(resultItem);
    //
    

    //
    let route_div = document.createElement("div");
    
    route_div.textContent = item + " " + routes_data[item].DepartureStopName + "-" + routes_data[item].DestinationStopName;

    routes_div.appendChild(route_div)
  });
  content.appendChild(routes_div);
}

function push_search_bar_data(data, attribute) {
  for (element of data) {
    search_bar_data.push(element[attribute]);
  }
}
