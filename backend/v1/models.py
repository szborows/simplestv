from django.db import models
from datetime import datetime

class Choice(models.Model):
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value[:16]

    def text(self):
        return self.value

class VotingHash(models.Model):
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value

class Poll(models.Model):
    hash_id = models.CharField(max_length=255)
    secret = models.CharField(max_length=255)

    question = models.TextField()
    description = models.TextField()
    choices = models.ManyToManyField(Choice, related_name='choices')
    num_seats = models.IntegerField()
    author_email = models.EmailField()

    datetime_created = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField()
    num_invited = models.IntegerField()
    recipients_json = models.TextField()
    allowed_hashes = models.ManyToManyField(VotingHash, blank=True)

    sent_emails_json = models.TextField()
    output = models.TextField()
    winners = models.ManyToManyField(Choice, blank=True, related_name='winners')

    def __str__(self):
        return 'Poll {0} ({1})'.format(self.hash_id, self.question)

    def json_dict(self):
        return {
            'id': self.hash_id,
            'datetime_created': self.datetime_created,
            'question': self.question,
            'choices': [{'text': ch.text(), 'id': ch.id} for ch in self.choices.all()],
            'description': self.description,
            'num_seats': self.num_seats,
            'deadline': datetime.strftime(self.deadline, '%Y-%m-%d'),
            'num_invited': self.num_invited,
            'output': self.output,
            'winners': [{'value': w.text(), 'id': w.id} for w in self.winners.all()],
        }

class Vote(models.Model):
    poll = models.ForeignKey(Poll)
    author = models.ForeignKey(VotingHash)
    choices_json = models.TextField()
