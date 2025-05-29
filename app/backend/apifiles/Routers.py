from fastapi import APIRouter, HTTPException
from app.backend.apifiles.LoggerAPI import get_item_by_id, get_all_items, query_items_by_user, send_log, get_logs_by_level
from datetime import datetime, timezone
import uuid

router = APIRouter()

#Specific log
@router.get("/logs/{log_id}")
def get_log(log_id: str):
    log = get_item_by_id(log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

#All logs
@router.get("/logs")
def get_all_logs():
    logs = get_all_items()
    return {"logs": logs, "count": len(logs)}

#Log level
@router.get("/logs/level/{level}") 
def get_level_logs(level: str):
    logs = get_logs_by_level(level) 
    return {"logs": logs, "count": len(logs), "level": level.upper()}
    
#Get logs based on user. Will you use this?
@router.get("/users/{user_id}/logs")
def get_user_logs(user_id: str):
    logs = query_items_by_user(user_id)
    return {"logs": logs, "count": len(logs)}



#Post logs to dynamoDB
@router.post("/logs")
def create_log(message: str, level: str = "INFO", user_id: str = None):
    """Skapa en ny log"""
    try:
        log_item = {
            'log_id': str(uuid.uuid4()),
            'message': message,
            'level': level,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        #Add userID if exists
        if user_id:
            log_item['user_id'] = user_id
            
        send_log(log_item)
        return {"status": "success", "log": log_item}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create log: {str(e)}")


@router.get("/")
def logs_root():
    return {"message": "Logs API is working!"}