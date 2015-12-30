from django.db import models

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
            'choices': [ch.text() for ch in self.choices.all()]
        }

class VotingHash(models.Model):
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value

class Poll(models.Model):
    hash_id = models.CharField(max_length=255)
    secret = models.CharField(max_length=255)
    ballot = models.ForeignKey(Ballot)
    allowed_hashes = models.ManyToManyField(VotingHash, blank=True)

    def __str__(self):
        return 'Poll {0} ({1})'.format(self.hash_id, str(self.ballot))

    def json_dict(self):
        return {
            'id': self.hash_id,
            'ballot': self.ballot.json_dict()
        }

class Vote(models.Model):
    poll = models.ForeignKey(Poll)
    author = models.ForeignKey(VotingHash)
