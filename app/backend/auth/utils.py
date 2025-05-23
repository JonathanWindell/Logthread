# backend/utils.py
from jose import jwt, jwk
from jose.utils import base64url_decode
import requests
from fastapi import HTTPException
from Config import REGION, USER_POOL_ID, CLIENT_ID

JWK_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

def get_public_keys():
    jwks = requests.get(JWK_URL).json()
    return {key['kid']: key for key in jwks['keys']}

def verify_token(token: str):
    headers = jwt.get_unverified_headers(token)
    kid = headers['kid']
    public_keys = get_public_keys()

    if kid not in public_keys:
        raise HTTPException(status_code=401, detail="Invalid token")

    key = public_keys[kid]
    return jwt.decode(token, key, algorithms=['RS256'], audience=CLIENT_ID)
