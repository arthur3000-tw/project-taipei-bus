from pydantic import BaseModel, Json
from enum import Enum

class StatusEnum(str,Enum):
    ok = "ok"
    error = "error"

class Response(BaseModel):
    status: StatusEnum
    message: str = None
    data: Json = None

