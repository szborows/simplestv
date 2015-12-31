from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import http.client as http
import json
import hashlib
import random

from backend.hashids import Hashids
from v1.models import *

def hash_email(email):
    return hashlib.sha256(email.encode('utf-8')).hexdigest()

def secret():
    r = map(str, [random.randint(1, 10**4) for _ in range(10)])
    h = hashlib.sha256()
    for x in r:
        h.update(x.encode('ascii'))
    return h.hexdigest()

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

def create(request):
    if request.method != 'POST':
        return HttpResponse('', status=http.BAD_REQUEST)
    try:
        # PARANOID: is this safe?
        data = json.loads(request.body.decode('utf-8'))
        question = str(data['question'])
        choices = list(map(str, data['choices']))
        recipients = list(map(str, data['recipients']))
    except (TypeError, ValueError, KeyError):
        return HttpResponse('', status=http.BAD_REQUEST)

    ballot = Ballot()
    ballot.question = question
    ballot.save()

    for choice_text in choices:
        choice = Choice()
        choice.value = choice_text
        choice.save()
        ballot.choices.add(choice)

    ballot.save()

    poll = Poll()
    poll.ballot = ballot
    poll.recipients_json = json.dumps(recipients)
    poll.save()

    for recipient_text in recipients:
        recipient = VotingHash()
        recipient.value = hash_email(recipient_text)
        recipient.save()
        poll.allowed_hashes.add(recipient)

    poll.hash_id = Hashids().encode(poll.id)
    poll.secret = secret()
    poll.save()

    return JsonResponse({'id': poll.hash_id, 'secret': poll.secret})

def results(request, secret):
    try:
        poll = Poll.objects.get(secret=secret)
    except Poll.DoesNotExist:
        return HttpResponse('', status=http.NOT_FOUND)

    results = {
        'num_recipients': len(json.loads(poll.recipients_json)),
        'total_votes': len(Vote.objects.filter(poll=poll))
    }

    return JsonResponse({'poll': poll.json_dict(), 'results': results})
