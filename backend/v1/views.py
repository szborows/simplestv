from django.shortcuts import render
from django.http import JsonResponse

from v1.models import *

def poll(request, poll_id):
    return JsonResponse({})
