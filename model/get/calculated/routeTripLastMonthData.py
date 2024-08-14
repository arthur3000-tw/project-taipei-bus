from model.model.ResponseModel import MyResponse


# 資料描述：「公車路線」近三十天平均每趟時間（去程、返程）
def route_trip_last_month_data(myDB, route_name):
    # DB 指令
    sql = "SELECT * FROM routes_last_30_days_trip_data WHERE RouteName=%s"
    val = (route_name,)
    # 執行查詢
    result = myDB.query(sql, val)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error", message="查無資料")
    # 回傳資料
    return MyResponse(status="ok", data=result)