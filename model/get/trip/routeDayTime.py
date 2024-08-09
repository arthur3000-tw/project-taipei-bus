from model.model.ResponseModel import MyResponse

# 資料描述：「公車路線」平均每趟時間（去程、返程）
# 資料區間：「日期時間」期間中的資料（可輸入「日期」或「日期＋時間」）
def route_datetime(myDB,route_name,start_datetime,end_datetime):
    # DB 指令
    sql = "SELECT RouteName, Direction, AVG(TripTime), STDDEV(TripTime) FROM route_time_records \
        WHERE RouteName=%s AND \
        TripStartTime BETWEEN %s AND %s \
        GROUP BY RouteName, Direction"
    val = (route_name,start_datetime,end_datetime)
    # 執行查詢
    result = myDB.query(sql,val)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error",message="查無資料")
    # 回傳資料
    return MyResponse(status="ok",data=result)