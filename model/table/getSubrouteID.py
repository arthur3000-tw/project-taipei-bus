def getSubrouteIDTable(data):
    subrouteIDTable = {}
    for element in data:
        subrouteIDTable.update({element["SubRouteID"]: element["RouteID"]})
    return subrouteIDTable
