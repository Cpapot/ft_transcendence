FROM debian:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
	nginx \
	openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=FR/ST=RHONE/L=LYON/O=42/OU=42Lyon/CN=localhost"

COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
