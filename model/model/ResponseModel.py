from pydantic import BaseModel
from typing import List
from enum import Enum

class StatusEnum(str,Enum):
    ok = "ok"
    error = "error"

class MyResponse(BaseModel):
    status: StatusEnum
    message: str = None
    data: List = None

