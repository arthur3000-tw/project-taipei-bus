from model.db import DB
from model.get.operators import getOperators
from model.get.routesByOperator import getRoutes
from model.get.calculated.routeTripLastWeekData import route_trip_last_week_data
from model.get.calculated.routeTripLastMonthData import route_trip_last_month_data
from datetime import datetime, timedelta
import time

start_time = time.time()

# DB 實體化
myDB = DB.DB(host="localhost", database="taipei_bus")
# myDB = DB.DB(host=os.environ.get("DB_HOST"),database="taipei_bus")
myDB.initialize()

# 取得業者名稱
operators = getOperators(myDB).data

# 計算最近七天數據
end_day = datetime.fromisoformat("2024-08-04")
start_day = end_day + timedelta(days=-7)

# 清空 table
sql = "TRUNCATE TABLE plates_last_7_days_trip_data"
myDB.insert(sql)


for operator in operators:
    # 取得路線名稱
    result = getRoutes(myDB, operator["OperatorName"]).data
    for route in result:
        # 取得路線數據
        route_trip_times = route_trip_last_week_data(
            myDB, route["RouteName"]).data
        if route_trip_times is None:
            continue
        # 計算 subroute 數據
        for subroute_trip_time in route_trip_times:
            # DB 指令，取得 subroute 下營運的車牌數據
            sql = "SELECT route_time_records.PlateNumb, route_time_records.Direction, routes_info.DepartureStopName, \
                          routes_info.DestinationStopName, AVG(route_time_records.TripTime) as AVG, \
                          STDDEV(route_time_records.TripTime) as STD, \
                          COUNT(DISTINCT route_time_records.id) as Count \
                   FROM route_time_records \
                   JOIN routes_info ON routes_info.SubRouteName=route_time_records.SubRouteName \
                   WHERE route_time_records.SubRouteName=%s \
                     AND route_time_records.Direction=%s \
                     AND route_time_records.TripStartTime BETWEEN %s AND %s \
                   GROUP BY route_time_records.PlateNumb, route_time_records.Direction, \
                            routes_info.DepartureStopName, routes_info.DestinationStopName \
                   ORDER BY route_time_records.PlateNumb"
            val = (subroute_trip_time["SubRouteName"],
                   subroute_trip_time["Direction"], start_day, end_day)
            plate_trip_results = myDB.query(sql, val)
            # 若無資料
            if len(plate_trip_results) == 0:
                continue
            for plate_trip_result in plate_trip_results:
                # 準備寫入 DB
                operator_name = operator["OperatorName"]
                route_name = subroute_trip_time["RouteName"]
                subroute_name = subroute_trip_time["SubRouteName"]
                plate_numb = plate_trip_result["PlateNumb"]
                direction = subroute_trip_time["Direction"]
                departure_stop_name = plate_trip_result["DepartureStopName"]
                destination_stop_name = plate_trip_result["DestinationStopName"]
                avg_trip_time = plate_trip_result["AVG"]
                std_trip_time = plate_trip_result["STD"]
                count = plate_trip_result["Count"]
                try:
                    compare_result = ((float(plate_trip_result["AVG"]) - subroute_trip_time["AVG_TripTime"])
                                      / subroute_trip_time["STD_TripTime"])
                except ZeroDivisionError:
                    compare_result = 0
                # DB 指令
                sql = "INSERT INTO plates_last_7_days_trip_data \
                       (OperatorName, RouteName, SubRouteName, PlateNumb, Direction, \
                        DepartureStopName, DestinationStopName, AVG_TripTime, STD_TripTime, \
                        DataCount, CompareResult) \
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                val = (operator_name, route_name, subroute_name, plate_numb,
                       direction, departure_stop_name, destination_stop_name,
                       avg_trip_time, std_trip_time, count, compare_result)
                insert_result = myDB.insert(sql, val)

print("--- %s seconds ---" % (time.time() - start_time))

start_time = time.time()

# 計算最近三十天數據
end_day = datetime.fromisoformat("2024-08-04")
start_day = end_day + timedelta(days=-30)

# 清空 table
sql = "TRUNCATE TABLE plates_last_30_days_trip_data"
myDB.insert(sql)


for operator in operators:
    # 取得路線名稱
    result = getRoutes(myDB, operator["OperatorName"]).data
    for route in result:
        # 取得路線數據
        route_trip_times = route_trip_last_month_data(
            myDB, route["RouteName"]).data
        if route_trip_times is None:
            continue
        # 計算 subroute 數據
        for subroute_trip_time in route_trip_times:
            # DB 指令，取得 subroute 下營運的車牌數據
            sql = "SELECT route_time_records.PlateNumb, route_time_records.Direction, routes_info.DepartureStopName, \
                          routes_info.DestinationStopName, AVG(route_time_records.TripTime) as AVG, \
                          STDDEV(route_time_records.TripTime) as STD, \
                          COUNT(DISTINCT route_time_records.id) as Count \
                   FROM route_time_records \
                   JOIN routes_info ON routes_info.SubRouteName=route_time_records.SubRouteName \
                   WHERE route_time_records.SubRouteName=%s \
                     AND route_time_records.Direction=%s \
                     AND route_time_records.TripStartTime BETWEEN %s AND %s \
                   GROUP BY route_time_records.PlateNumb, route_time_records.Direction, \
                            routes_info.DepartureStopName, routes_info.DestinationStopName \
                   ORDER BY route_time_records.PlateNumb"
            val = (subroute_trip_time["SubRouteName"],
                   subroute_trip_time["Direction"], start_day, end_day)
            plate_trip_results = myDB.query(sql, val)
            # 若無資料
            if len(plate_trip_results) == 0:
                continue
            for plate_trip_result in plate_trip_results:
                # 準備寫入 DB
                operator_name = operator["OperatorName"]
                route_name = subroute_trip_time["RouteName"]
                subroute_name = subroute_trip_time["SubRouteName"]
                plate_numb = plate_trip_result["PlateNumb"]
                direction = subroute_trip_time["Direction"]
                departure_stop_name = plate_trip_result["DepartureStopName"]
                destination_stop_name = plate_trip_result["DestinationStopName"]
                avg_trip_time = plate_trip_result["AVG"]
                std_trip_time = plate_trip_result["STD"]
                count = plate_trip_result["Count"]
                try:
                    compare_result = ((float(plate_trip_result["AVG"]) - subroute_trip_time["AVG_TripTime"])
                                      / subroute_trip_time["STD_TripTime"])
                except ZeroDivisionError:
                    compare_result = 0
                # DB 指令
                sql = "INSERT INTO plates_last_30_days_trip_data \
                       (OperatorName, RouteName, SubRouteName, PlateNumb, Direction, \
                        DepartureStopName, DestinationStopName, AVG_TripTime, STD_TripTime, \
                        DataCount, CompareResult) \
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                val = (operator_name, route_name, subroute_name, plate_numb,
                       direction, departure_stop_name, destination_stop_name,
                       avg_trip_time, std_trip_time, count, compare_result)
                insert_result = myDB.insert(sql, val)

print("--- %s seconds ---" % (time.time() - start_time))
