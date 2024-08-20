from model.db import DB
from model.get.operators import getOperators
from model.get.routes import getRoutes
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
sql = "TRUNCATE TABLE routes_last_7_days_trip_data"
myDB.insert(sql)

for operator in operators:
    result = getRoutes(myDB, operator["OperatorName"]).data
    for route in result:
        # DB 指令，取得此路線的營運數據
        sql = "SELECT route_time_records.RouteName, route_time_records.SubRouteName, route_time_records.Direction, \
                      routes_info.DepartureStopName, routes_info.DestinationStopName, \
                      AVG(route_time_records.TripTime) AS AVG, \
                      STDDEV(route_time_records.TripTime) AS STD, \
                      COUNT(DISTINCT route_time_records.id) AS Count \
               FROM route_time_records \
               JOIN routes_info ON routes_info.SubRouteName=route_time_records.SubRouteName \
               WHERE route_time_records.RouteName=%s \
                 AND route_time_records.TripStartTime between %s and %s \
               GROUP BY route_time_records.RouteName, route_time_records.SubRouteName, route_time_records.Direction, \
                        routes_info.DepartureStopName, routes_info.DestinationStopName"
        val = (route["RouteName"], start_day, end_day)
        sql_results = myDB.query(sql, val)
        # 若沒有資料
        if len(sql_results) == 0:
            continue
        for sql_result in sql_results:
            # 準備寫入 DB
            operator_name = operator["OperatorName"]
            route_name = sql_result["RouteName"]
            subroute_name = sql_result["SubRouteName"]
            direction = sql_result["Direction"]
            departure_stop_name = sql_result["DepartureStopName"]
            destination_stop_name = sql_result["DestinationStopName"]
            avg_trip_time = sql_result["AVG"]
            std_trip_time = sql_result["STD"]
            count = sql_result["Count"]
            # DB 指令
            sql = "INSERT INTO routes_last_7_days_trip_data \
                   (OperatorName, RouteName, SubRouteName, Direction, DepartureStopName, DestinationStopName, \
                    AVG_TripTime, STD_TripTime, DataCount) \
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            val = (operator_name, route_name, subroute_name,
                   direction, departure_stop_name, destination_stop_name,
                   avg_trip_time, std_trip_time, count)
            insert_result = myDB.insert(sql, val)

print("--- %s seconds ---" % (time.time() - start_time))

start_time = time.time()

# 計算最近三十天數據
end_day = datetime.fromisoformat("2024-08-04")
start_day = end_day + timedelta(days=-30)

# 清空 table
sql = "TRUNCATE TABLE routes_last_30_days_trip_data"
myDB.insert(sql)

for operator in operators:
    result = getRoutes(myDB, operator["OperatorName"]).data
    for route in result:
        # DB 指令，取得此路線的營運數據
        sql = "SELECT route_time_records.RouteName, route_time_records.SubRouteName, route_time_records.Direction, \
                      routes_info.DepartureStopName, routes_info.DestinationStopName, \
                      AVG(route_time_records.TripTime) AS AVG, \
                      STDDEV(route_time_records.TripTime) AS STD, \
                      COUNT(DISTINCT route_time_records.id) AS Count \
               FROM route_time_records \
               JOIN routes_info ON routes_info.SubRouteName=route_time_records.SubRouteName \
               WHERE route_time_records.RouteName=%s \
                 AND route_time_records.TripStartTime between %s and %s \
               GROUP BY route_time_records.RouteName, route_time_records.SubRouteName, route_time_records.Direction, \
                        routes_info.DepartureStopName, routes_info.DestinationStopName"
        val = (route["RouteName"], start_day, end_day)
        sql_results = myDB.query(sql, val)
        # 若沒有資料
        if len(sql_results) == 0:
            continue
        for sql_result in sql_results:
            # 準備寫入 DB
            operator_name = operator["OperatorName"]
            route_name = sql_result["RouteName"]
            subroute_name = sql_result["SubRouteName"]
            direction = sql_result["Direction"]
            departure_stop_name = sql_result["DepartureStopName"]
            destination_stop_name = sql_result["DestinationStopName"]
            avg_trip_time = sql_result["AVG"]
            std_trip_time = sql_result["STD"]
            count = sql_result["Count"]
            # DB 指令
            sql = "INSERT INTO routes_last_30_days_trip_data \
                   (OperatorName, RouteName, SubRouteName, Direction, DepartureStopName, DestinationStopName, \
                    AVG_TripTime, STD_TripTime, DataCount) \
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            val = (operator_name, route_name, subroute_name,
                   direction, departure_stop_name, destination_stop_name,
                   avg_trip_time, std_trip_time, count)
            insert_result = myDB.insert(sql, val)

print("--- %s seconds ---" % (time.time() - start_time))
