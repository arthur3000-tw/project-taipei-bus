function update_estimate_time(data) {
  for (element of data) {
    update_estimate_div = document.querySelector(
      ".estimate-time-" + element.StopID
    );
    // 公車不在路線上有的站牌
    if (update_estimate_div === null) {
      continue;
    }
    update_estimate_div.style.textAlign = "center";
    update_estimate_div.style.color = "black";
    update_estimate_div.style.backgroundColor = "lightgrey";
    update_estimate_div.style.borderRadius = "25px";
    let status;
    switch (element.EstimateTime) {
      case "-1":
        status = "尚未發車";
        break;
      case "-2":
        status = "交管不停靠";
        break;
      case "-3":
        status = "末班車已過";
        break;
      case "-4":
        status = "今日未營運";
        break;
      default:
        status = element.EstimateTime;
    }
    if (status >= 0) {
      status = Math.floor(status / 60);
      if (status > 0 && status < 3) {
        status = status.toString() + "分";
        update_estimate_div.style.color = "red";
        update_estimate_div.style.backgroundColor = "pink";
      } else if (status >= 3) {
        status = status.toString() + "分";
      } else {
        status = "即將進站";
        update_estimate_div.style.color = "white";
        update_estimate_div.style.backgroundColor = "red";
      }
    }
    try {
      update_estimate_div.textContent = status;
      isSuccess = true;
    } catch (e) {
      console.log(e);
      console.log(element);
    }
  }
}

function update_bus_event(data) {
  document.querySelectorAll(".bus-plate").forEach((e) => e.remove());
  for (element of data) {
    // 排除非營運狀態公車
    if (element.DutyStatus !== "1" || element.BusStatus !== "0") {
      continue;
    }
    //
    let update_bus_plates_div = document.querySelector(
      ".bus-plates-" + element.StopID
    );
    if (update_bus_plates_div === null) {
      continue;
    }
    //
    let bus_plate_div = document.querySelector(".bus-plate-" + element.BusID);
    if (bus_plate_div === null) {
      bus_plate_div = document.createElement("div");
      bus_plate_div.className = "bus-plate-" + element.BusID;
      bus_plate_div.classList.add("bus-plate");
      bus_plate_div.style.display = "flex";
      bus_plate_div.style.flexWrap = "wrap";
      bus_plate_div.style.justifyContent = "center";
      bus_plate_div.style.alignItems = "center";
    }
    // 顯示車種
    let bus_type = document.createElement("span");
    bus_type.className = "material-symbols-outlined";
    bus_type.style.fontSize = "30px";
    if (element.CarType === "1") {
      bus_type.textContent = "accessible";
    } else if (element.CarType === "0") {
      bus_type.textContent = "directions_bus";
    } else if (element.CarType === "3") {
      bus_type.textContent = "pets";
    }
    // 顯示車牌
    let plate_numb = document.createElement("div");
    plate_numb.style.fontSize = "30px";
    plate_numb.textContent = element.BusID;

    // 顯示七日數據
    let plate_week_data = document.createElement("div");
    plate_week_data.style.fontSize = "30px";
    plate_week_data.style.border = "solid 2px black";
    plate_week_data.style.margin = "5px 10px";
    try {
      plate_week_data.textContent = value_to_string(
        plate_trip_last_week[element.BusID]["CompareResult"]
      );
    } catch (e) {
      console.log(e);
      console.log(element);
      plate_week_data.textContent = "無";
    }
    //
    let plate_week_data_title = document.createElement("span");
    plate_week_data_title.textContent = "7";
    plate_week_data_title.style.fontSize = "20px";
    plate_week_data.append(plate_week_data_title);

    // 顯示三十日數據
    let plate_month_data = document.createElement("div");
    plate_month_data.style.fontSize = "30px";
    plate_month_data.style.border = "solid 2px black";
    plate_month_data.style.margin = "5px 10px";
    try {
      plate_month_data.textContent = value_to_string(
        plate_trip_last_month[element.BusID]["CompareResult"]
      );
    } catch (e) {
      console.log(e);
      console.log(element);
      plate_month_data.textContent = "無";
    }
    //
    let plate_month_data_title = document.createElement("span");
    plate_month_data_title.textContent = "30";
    plate_month_data_title.style.fontSize = "20px";
    plate_month_data.append(plate_month_data_title);

    bus_plate_div.appendChild(bus_type);
    bus_plate_div.appendChild(plate_numb);

    bus_plate_div.appendChild(plate_week_data);
    bus_plate_div.appendChild(plate_month_data);
    try {
      update_bus_plates_div.appendChild(bus_plate_div);
    } catch (e) {
      console.log(element);
      console.log(e);
    }
  }
}

function update_map(data) {
  // 清除 map 中的公車 icon
  for (bus of bus_go) {
    map.removeLayer(bus);
  }
  for (bus of bus_back) {
    map.removeLayer(bus);
  }
  // 清除公車資訊
  bus_go = [];
  bus_back = [];
  //
  let popupOptions = { maxWidth: "500", className: "popup" };
  for (element of data) {
    // 排除非營運狀態公車
    if (element.DutyStatus !== "1" || element.BusStatus !== "0") {
      continue;
    }
    // 取得數據
    let last_week_data;
    try {
      last_week_data = value_to_string(
        plate_trip_last_week[element.BusID]["CompareResult"]
      );
    } catch {
      last_week_data = "無";
    }
    let last_month_data;
    try {
      last_month_data = value_to_string(
        plate_trip_last_month[element.BusID]["CompareResult"]
      );
    } catch {
      last_month_data = "無";
    }
    //
    if (element["GoBack"] == "0") {
      marker = new L.marker([element["Latitude"], element["Longitude"]], {
        icon: bus_icon_go,
      })
        .bindPopup(
          `<b>${element["BusID"]}</b>
            <br>
            近七天-${last_week_data}
            <br>
            近三十天-${last_month_data}`,
          popupOptions
        )
        .addTo(map);
      bus_go.push(marker);
    } else if (element["GoBack"] == "1") {
      marker = new L.marker([element["Latitude"], element["Longitude"]], {
        icon: bus_icon_back,
      })
        .bindPopup(
          `<b>${element["BusID"]}</b>
          <br>
          近七天-${last_week_data}
          <br>
          近三十天-${last_month_data}`,
          popupOptions
        )
        .addTo(map);
      bus_back.push(marker);
    }
  }
}


