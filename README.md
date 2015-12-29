# simplestv
simple browser-based stv voting app

## starting

### running reverse proxy using nginx
(assuming port 4242)
docker run -v "$PWD"/reverse_proxy.conf:/etc/nginx/nginx.conf:ro -p 4242:80 -it nginx
