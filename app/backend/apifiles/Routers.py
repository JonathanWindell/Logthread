from fastapi import APIRouter, HTTPException
from app.backend.apifiles.LoggerAPI import get_archived_log_count_s3
from app.backend.apifiles.LoggerAPI import get_item_by_id, get_all_items, query_items_by_user, send_log, get_logs_by_level, get_number_of_logs_per_level
from datetime import datetime, timezone
import uuid

router = APIRouter()

@router.get("/logs")
def get_all_logs():
    """
    Retrieves all log entries currently stored in the system.

    Returns:
        dict: A dictionary containing the list of 'logs' and the total 'count'.
    """
    logs = get_all_items()
    return {"logs": logs, "count": len(logs)}

@router.get("/logs/stats")
def get_log_stats():
    """
    Retrieves a summary of log counts categorized by severity level.

    Returns:
        dict: A dictionary containing the 'stats' mapping (e.g., INFO: 10, ERROR: 2).
    """
    stats = get_number_of_logs_per_level() 
    return {"stats": stats}

@router.get("/logs/level/{level}") 
def get_level_logs(level: str):
    """
    Retrieves all logs that match a specific severity level.

    Args:
        level (str): The log level to filter by (e.g., 'debug', 'info', 'error').

    Returns:
        dict: A dictionary containing the matching 'logs', their 'count', and the 'level' requested.
    """
    logs = get_logs_by_level(level) 
    return {"logs": logs, "count": len(logs), "level": level.upper()}

@router.get("/logs/{log_id}")
def get_log(log_id: str):
    """
    Retrieves a single log entry by its unique ID.

    Args:
        log_id (str): The unique UUID of the log entry.

    Returns:
        dict: The log entry data if found.

    Raises:
        HTTPException: 404 error if the log entry does not exist in DynamoDB.
    """
    log = get_item_by_id(log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

@router.get("/")
def logs_root():
    """
    Health check endpoint for the Logs API.

    Returns:
        dict: A simple message confirming the API is operational.
    """
    return {"message": "Logs API is working!"}

@router.post("/logs")
def create_log(message: str, level: str = "INFO", user_id: str = None):
    """
    Creates and stores a new log entry in DynamoDB.

    Args:
        message (str): The content of the log message.
        level (str, optional): The severity level of the log. Defaults to "INFO".
        user_id (str, optional): The ID of the user associated with this log. Defaults to None.

    Returns:
        dict: A success status and the full 'log' object including the generated UUID and timestamp.

    Raises:
        HTTPException: 500 error if the log creation or database write fails.
    """
    try:
        log_item = {
            'log_id': str(uuid.uuid4()),
            'message': message,
            'level': level,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        if user_id:
            log_item['user_id'] = user_id
            
        send_log(log_item)
        return {"status": "success", "log": log_item}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create log: {str(e)}")

@router.get("/archived/count")
def get_archived_log_count():
    """
    Retrieves the total count of logs currently archived in S3.

    Returns:
        dict: A dictionary containing the 'archived_log_count'.
    """
    count = get_archived_log_count_s3()
    return {"archived_log_count": count}

@router.get("/users/{user_id}/logs")
def get_user_logs(user_id: str):
    """
    Retrieves all logs associated with a specific user.

    Args:
        user_id (str): The unique identifier for the user.

    Returns:
        dict: A dictionary containing the list of 'logs' for that user and the 'count'.
    """
    logs = query_items_by_user(user_id)
    return {"logs": logs, "count": len(logs)}