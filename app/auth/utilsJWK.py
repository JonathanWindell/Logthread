import requests 
from jose import jwt, jwk
from jose.utils import base64url_decode
from fastapi import HTTPException, status
from app.config import JWK_URL, USER_POOL_ID

_jwk_cache = {}

def get_jwk():
    global _jwk_cache
    if not _jwk_cache:
        response = requests.get(JWK_URL)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Could not fetch JWKS")
        _jwk_cache = {key['kid']: key for key in response.json()['keys']}
    return _jwk_cache

def decode_token(token: str):
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    keys = get_jwk()

    if kid not in keys:
        raise HTTPException(status_code=401, detail="Invalid token")

    key = keys[kid]
    public_key = jwk.construct(key)
    message, encoded_signature = str(token).rsplit('.', 1)
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    if not public_key.verify(message.encode("utf-8"), decoded_signature):
        raise HTTPException(status_code=401, detail="Token signature is invalid")

    claims = jwt.get_unverified_claims(token)
    if claims["iss"] != f"https://cognito-idp.{USER_POOL_ID.split('_')[0]}.amazonaws.com/{USER_POOL_ID}":
        raise HTTPException(status_code=401, detail="Invalid issuer")

    return claims