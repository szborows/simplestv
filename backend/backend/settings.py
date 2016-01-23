"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 1.8.3.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '+yd+m!b3@(yg28jj56-plvau8!wprrm4a28hz643eqf0y65t53'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

try:
    SIMPLESTV_URL = os.environ['SIMPLESTV_URL']
except KeyError:
    raise RuntimeError('Please set SIMPLESTV_URL environment variable!')

try:
    SIMPLESTV_CONFIG_PATH = os.environ['SIMPLESTV_CONFIG_PATH']
except KeyError:
    raise RuntimeError('Please set SIMPLESTV_CONFIG_PAth environment variable!')

# Application definition

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'v1',
    'djcelery',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # TODO: temporarily disabled
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
                os.path.join(BASE_DIR, 'templates')
            ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'simplestv',
        'USER': 'docker',
        'PASSWORD': 'docker',
        'HOST': 'localhost',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

EMAIL_HOST = None
EMAIL_PORT = None
DEFAULT_FROM_EMAIL = None
EMAIL_BACKEND = None
EMAIL_FILE_PATH = None

import configparser
config = configparser.ConfigParser()
config.read(SIMPLESTV_CONFIG_PATH)

if 'email' in config.sections():
    if 'backend' in config['email']:
        EMAIL_BACKEND = config['email']['backend']
    if 'filebackend_file_path' in config['email']:
        EMAIL_FILE_PATH = config['email']['filebackend_file_path']
    if 'host' in config['email']:
        EMAIL_HOST = config['email']['host']
    if 'port' in config['email']:
        EMAIL_PORT = config['email']['port']
    if 'default_from_email' in config['email']:
        DEFAULT_FROM_EMAIL = config['email']['default_from_email']
