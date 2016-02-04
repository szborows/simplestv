# TODO

- add method option in `/p/create`
- security hardening
- production Dockerfile
- save future Celery tasks somewhere so it can survive reset
- define & implement behavior when deadline is reached but there were no votes at all
- send mails to all voters with results of the poll (should poll creator decide?)
- fix this annying 'Error during election bug'. perhaps it's because of some react cached state
- anti DDoS?
- production: DEBUG=False !!
- add option: allowed email domains ?
- i18n, l10n in email templates
- inglr vs plural in email templates
- admin: list of polls
- check that doing restart doesn't hurt too much
