# SimpleStV

![voting in SimpleSTV animation](https://raw.githubusercontent.com/szborows/simplestv/master/voting.gif)

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

1. Go to docker-files
2. Edit `example.conf` to match your needs (see below)
3. Build your image: `docker build -t local/simplestv -f Dockerfile.production .`
4. Create volume for SimpleSTV data: `docker volume create --name simplestv_data`
5. Put SSL certificate and key to `certs/` folder (you can generate self-signed ones with this command: `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/simplestv.key -out certs/simplestv.crt`)
6. Start your container with SIMPLESTV_URL environment variable set to the final address of the service. E.g.
   if the service will be available under the domain `stv.example.com` then command should look like this: `docker run -d -p 443:443 -v simplestv_data:/data -v $PWD/certs:/ssl:ro -e SIMPLESTV_URL="http://stv.example.com/"`
7. Your instance of SimpleSTV should be up and running!

### Configuration options

    [server]
    ssl = True | False

    [email]
    backend = Django Email backend
    host = email host
    port = email port
    default_from_email = default email of the sender

## Considerations

### Scalability
The system is currently not designed to be highly available and it does not scale horizontally. However, it's
all about changing database from relative to non-relative and putting some HAProxy solution in front of the
backend.

### Security
SimpleSTV production Dockerfile uses TLS by default. Because email addresses are transferred through wire,
          plain HTTP server is discouraged.
