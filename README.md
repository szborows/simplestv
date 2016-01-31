# SimpleStV

![voting in SimpleSTV animatino](https://raw.github.com/szborows/simplestv/voting.webm)
![test](https://zippy.gfycat.com/SociableRigidIvorybilledwoodpecker.webm)

## Overview

SimpleSTV is browser-based application used to conduct STV elections.

>The single transferable vote (STV) is a voting system designed to achieve proportional representation through 
>ranked voting in multi-seat constituencies (voting districts).[1] Under STV, an elector (voter) has a single 
>vote that is initially allocated to their most preferred candidate and, as the count proceeds and candidates 
>are either elected or eliminated, is transferred to other candidates according to the voter's stated 
>preferences, in proportion to any surplus or discarded votes. The exact method of reapportioning votes 
>can vary (see Counting methods).

source: [Wikipedia](https://en.wikipedia.org/wiki/Single_transferable_vote)

Please take note that this software isn't mature so far. I've been developing internal search engine at Nokia and
wanted to know which features are most preferred by users. So I decided to quickly write another tool that
would help me with that. Then I thought that this can be actually open-sourced.
P.S. This software does represent my JavaScript skills (I suck at it), but it doesn't reflect my Python skills
(I'm believed to produce good Python code, but unfortunately day consists of only 24 hours).

## Stack

Frontend: `react-js` with numerous extensions

Backend: `Django` (with extensions), `Celery`

Nginx is used as a reverse proxy.

In the future I want to actually use some NoSQL solution. Currently, for the sake of simplicity, SQLite is
used.

## Installation & start

Installation procedure is a bit weird now. And this is semi-development-semi-production installation. But it
works.

1. Go to fronend dir and execute `npm install` command
2. After everything's installed, go to ../docker-scripts directory
3. Create file `../backend/backend/email_settings.py` and fill it with Django email settings
4. Execute `docker build -t simplestv/dev:001 .`
5. Start SimpleSTV by executing `docker run -it --rm --name simplestv -v $PWD/backend:/app -v $PWD/frontend:/frontend -e SIMPLESTV_URL="http://localhost:80" -p 9999:80 -p 8096:8096 simplestv/dev:001`
6. Go to `http://localhost`

## Considerations

### Scalability
The system is currently not designed to be highly available and it does not scale horizontally. However, it's
all about changing database from relative to non-relative and putting some HAProxy solution in front of the
backend.

### Security
Definitely SimpleSTV should work via HTTPS _only_. Mainly because email addresses are transferred on the wire!
