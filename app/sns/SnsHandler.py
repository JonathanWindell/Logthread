from app.sns.SnsConfig import sns_wrapper

def send_critical_notification(message: str, subject: str = "CRITICAL LOG"):
    try:
        response = sns_wrapper.publish(subject=subject, message=message)
        print(f"Message sent. ID: {response['MessageId']}")
        return True
    except Exception as error:
        print(f"Could not send message: {error}")
        return False
