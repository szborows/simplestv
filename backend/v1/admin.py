from django.contrib import admin

from v1.models import *

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    pass

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    pass
