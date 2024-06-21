FROM debian:latest

# Set environment variables
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nginx \
    openssl \
    supervisor \
    cron \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=FR/ST=RHONE/L=LYON/O=42/OU=42Lyon/CN=localhost"

COPY conf/cron.conf /etc/cron.d/cron.conf
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY utils/ /home/transcendence/conf/

ENV		PYTHONUNBUFFERED 1
WORKDIR	/home/transcendence/

RUN mkdir -p logs

# Create virtual environment and install dependencies
RUN python3 -m venv venv
RUN . venv/bin/activate
RUN venv/bin/pip3 install -r conf/requirements.txt

EXPOSE	443

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
