# TODO

- add method option in `/p/create`
- email addresses in poll should be unique!!
- run-election in frontend should wait if task didn't complete in time
- run-final-election task should be fired automatically when deadline is met
- security hardening
- production Dockerfile
- icons with question mark near each input (aka help)
- move email bodies to some kind of templates...
- save future Celery tasks somewhere so it can survive reset
- it should be possible to pass email configuration to the Docker image!
- define & implement behavior when deadline is reached but there were no votes at all
- send mails to all voters with results of the poll (should poll creator decide?)
- fix this annying 'Error during election bug'. perhaps it's because of some react cached state
