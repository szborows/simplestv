from django.db import models
from datetime import datetime

class Choice(models.Model):
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value[:16]

    def text(self):
        return self.value

class Ballot(models.Model):
    datetime_created = models.DateTimeField(auto_now=True)
    question = models.TextField()
    choices = models.ManyToManyField(Choice)

    def __str__(self):
        return self.question[:16]

    def json_dict(self):
        return {
            'time': self.datetime_created,
            'question': self.question,
            'choices': [{'text': ch.text(), 'id': ch.id} for ch in self.choices.all()]
        }

class VotingHash(models.Model):
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value

class Poll(models.Model):
    hash_id = models.CharField(max_length=255)
    secret = models.CharField(max_length=255)
    ballot = models.ForeignKey(Ballot)
    recipients_json = models.TextField()
    sent_emails_json = models.TextField()
    allowed_hashes = models.ManyToManyField(VotingHash, blank=True)
    num_seats = models.IntegerField()
    deadline = models.DateTimeField()
    description = models.TextField()
    author_email = models.EmailField()
    output = models.TextField()
    winners = models.ManyToManyField(Choice, blank=True)

    def __str__(self):
        return 'Poll {0} ({1})'.format(self.hash_id, str(self.ballot))

    def json_dict(self):
        return {
            'id': self.hash_id,
            'description': self.description,
            'num_seats': self.num_seats,
            'deadline': datetime.strftime(self.deadline, '%Y-%m-%d'),
            'output': self.output,
            'winners': [{'value': w.text(), 'id': w.id} for w in self.winners.all()],
            'ballot': self.ballot.json_dict()
        }

class Vote(models.Model):
    poll = models.ForeignKey(Poll)
    author = models.ForeignKey(VotingHash)
    choices_json = models.TextField()
