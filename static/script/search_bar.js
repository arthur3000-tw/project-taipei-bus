const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");

// 模擬數據庫
const database = [
  "香蕉",
  "櫻桃",
  "蘋果",
  "葡萄",
  "西瓜",
  "柚子",
  "香水",
  "香皂",
  "西邊",
  "櫻花",
  "青蘋果",
  "肥皂盒",
  "水果",
  "小玉西瓜",
  "香水味",
];

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
    return database.filter((item) => item.includes(searchTerm));
  } else {
    // 對於兩個或更多字符，搜索包含這些連續字符的項目
    return database.filter((item) => item.includes(searchTerm));
  }
}

function clearResults() {
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }
}

function displayResults(suggestions) {
  if (suggestions.length === 0) {
    const noResultPara = document.createElement("p");
    noResultPara.textContent = "沒有找到匹配的結果";
    resultsDiv.appendChild(noResultPara);
    return;
  }

  suggestions.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.textContent = item;
    resultsDiv.appendChild(resultItem);
  });
}
