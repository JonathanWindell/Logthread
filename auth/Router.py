import boto3
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import uvicorn

app = FastAPI()

CLIENT_ID = '59dqniop3rslpov6lm5hti8tl'
REGION = 'eu-north-1'
JWT_SECRET = ''

cognito_client = boto3.client('cognito-idp', region_name=REGION)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    confirmation_code: Optional[str] = None
    
class Token(BaseModel):
    access_token: str
    token_type: str


def create_jwt_token(username: str):
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours = 1)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def decode_jwt_token(token: str):
    try: 
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/signup", response_model = dict)
def signup(user: User):
    try:
        response = cognito_client.sign_up(
            ClientId = CLIENT_ID,
            Username = user.username,
            Password = user.password,
            UserAttributes = [
                {
                    "Name": "email",
                    "Value": user.email
                }
            ]
        )
        return response
    except cognitio_client_exceptions.UsernameExistsException:
        raise HTTPException(status_code=400, detail="Username already exists")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/confirm", response_model = dict)
def confirm(user: User):
    try:
        response = cognito_client.confirm_sign_up(
            ClientId = CLIENT_ID,
            Username = user.username,
            ConfirmationCode = user.confirmation_code
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/signin", response_model = Token)
def signin(user: User):
    try:
        response = cognito_client.initiate_auth(
            AuthFlow = "USER_SRP_AUTH",
            AuthParameters = {
                "USERNAME": user.username,
                "PASSWORD": user.password
            },
            ClientId = CLIENT_ID
        )
        token = create_jwt_token(user.username)
        return {"access_token": token, "token_type": "Bearer"}
    except cognitio_client_exceptions.NotAuthorizedException:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/logout", response_model = dict)
def logout(token: str = Depends(oauth2_scheme)):
    try:
        decoded_token = decode_jwt_token(token)
        username = decoded_token["sub"]
        response = cognito_client.global_sign_out(
            AccessToken = token
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload = True)























