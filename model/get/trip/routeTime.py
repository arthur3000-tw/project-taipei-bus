from model.model.ResponseModel import MyResponse

# 資料描述：「公車路線」平均每趟時間（去程、返程）
# 資料區間：所有日期中的「時間」期間的資料
def route_time(myDB,route_name,start_time,end_time):
    # DB 指令
    sql = "SELECT RouteName, Direction, AVG(TripTime), STDDEV(TripTime) FROM route_time_records \
        WHERE RouteName=%s AND \
        Time(TripStartTime) BETWEEN %s AND %s \
        GROUP BY RouteName, Direction"
    val = (route_name,start_time,end_time)
    # 執行查詢
    result = myDB.query(sql,val)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error",message="查無資料")
    # 回傳資料
    return MyResponse(status="ok",data=result)