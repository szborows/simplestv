import hashlib
import random

def hash_email(email):
    return hashlib.sha256(email.encode('utf-8')).hexdigest()

def secret():
    r = map(str, [random.randint(1, 10**4) for _ in range(10)])
    h = hashlib.sha256()
    for x in r:
        h.update(x.encode('ascii'))
    return h.hexdigest()

