from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

import http.client as http

from v1.models import *

def poll(request, poll_id):
    try:
        poll = Poll.objects.get(hash_id=poll_id)
        # PARANOID: possible fuckup - more than one object returned
    except Poll.DoesNotExist:
        return HttpResponse('', status=http.NOT_FOUND)
    return JsonResponse({})
