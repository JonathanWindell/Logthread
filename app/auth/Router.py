from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import boto3
from app.auth.models import User, Token
from app.auth.utilsJWK import decode_token
from app.Config import REGION, CLIENT_ID

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()

cognito_client = boto3.client("cognito-idp", region_name=REGION)

@router.post("/signup")
def signup(user: User):
    try:
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=user.username,
            Password=user.password,
            UserAttributes=[{"Name": "email", "Value": user.email}]
        )
        return response
    except cognito_client.exceptions.UsernameExistsException:
        raise HTTPException(status_code=400, detail="Username already exists")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/confirm")
def confirm(user: User):
    try:
        response = cognito_client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=user.username,
            ConfirmationCode=user.confirmation_code
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin", response_model=Token)
def signin(user: User):
    try:
        response = cognito_client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={"USERNAME": user.username, "PASSWORD": user.password},
            ClientId=CLIENT_ID
        )
        return {
            "access_token": response['AuthenticationResult']['AccessToken'],
            "token_type": "Bearer"
        }
    except cognito_client.exceptions.NotAuthorizedException:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    try:
        cognito_client.global_sign_out(AccessToken=token)
        return {"message": "User logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))