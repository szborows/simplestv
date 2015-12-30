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

def create(request):
    if request.method != 'POST':
        return HttpResponse('', status=http.BAD_REQUEST)
    try:
        # PARANOID: is this safe?
        data = json.loads(request.body)
        question = str(data['question'])
        choices = list(map(str, data['choices']))
        recipients = list(map(str, data['recipients']))
    except (TypeError, ValueError, KeyError):
        return HttpResponse('', status=http.BAD_REQUEST)

    ballot = Ballot()
    ballot.question = question

    for choice_text in choices:
        choice = Choice()
        choice.value = choice_text
        choice.save()
        ballot.choices.add(choice)

    ballot.save()

    poll = Poll()
    poll.ballot = ballot

    for recipient_text in recipients:
        recipient = VotingHash()
        recipient.value = hash_email(recipient_text)
        recipient.save()
        poll.allowed_hashes.add(recipient)

    poll.save()

    return HttpResponse('', status=http.OK)
