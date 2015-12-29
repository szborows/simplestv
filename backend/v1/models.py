from django.db import models

class Choice(models.Model):
    value = models.CharField(max_length=255)

class Ballot(models.Model):
    datetime_created = models.DateTimeField(auto_now=True)
    question = models.TextField()
    choices = models.ManyToManyField(Choice)

class VotingHash(models.Model):
    value = models.CharField(max_length=255)

class Poll(models.Model):
    hash_id = models.CharField(max_length=255)
    ballot = models.ForeignKey(Ballot)
    allowed_hashes = models.ManyToManyField(VotingHash, blank=True)

class Vote(models.Model):
    poll = models.ForeignKey(Poll)
    author = models.ForeignKey(VotingHash)
