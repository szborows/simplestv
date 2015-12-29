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
    try:
        key = request.GET['key']
    except KeyError:
        return HttpResponse('', status=http.BAD_REQUEST)

    try:
        poll.allowed_hashes.get(value=key)
    except VotingHash.DoesNotExist:
        return HttpResponse('', status=http.UNAUTHORIZED)

    return JsonResponse(poll.json_dict())
