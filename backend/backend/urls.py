"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from v1 import views as v1_views

urlpatterns = [
    url(r'^api/v1/poll/create', v1_views.create),
    url(r'^api/v1/poll/results/(?P<secret>[a-zA-Z0-9]+)', v1_views.results),
    url(r'^api/v1/poll/(?P<poll_id>\w+)', v1_views.poll),
    url(r'^api/v1/vote/(?P<poll_id>\w+)', v1_views.vote),

    url(r'^admin/', include(admin.site.urls)),
]
