DOCKER_COMPOSE_NAME = docker-compose.yml
DOCKER_COMPOSE = docker compose -f $(DOCKER_COMPOSE_NAME)

CLIENT_DIST_VOLUME = app/client/dist
DATABASE_VOLUME = app/database/data

VOLUMES =	\
	$(CLIENT_DIST_VOLUME) \
	$(DATABASE_VOLUME)

RM = rm -rf

all:
	${MAKE} up

up:
	mkdir -p $(VOLUMES)
	$(DOCKER_COMPOSE) --env-file .env build
	$(DOCKER_COMPOSE) --env-file .env up

down:
	$(DOCKER_COMPOSE) down

restart:
	$(DOCKER_COMPOSE) --env-file .env build --no-cache

clean:
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans

fclean: clean
	$(RM) $(VOLUMES)

re: fclean
	$(MAKE) all

.PHONY: all up down restart clean fclean re
