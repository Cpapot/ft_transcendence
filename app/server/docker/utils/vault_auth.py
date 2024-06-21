import os
import hvac

VAULT_URL = 'https://localhost:8000'
VAULT_TOKEN = os.getenv('VAULT_TOKEN')

client = hvac.Client(url=VAULT_URL, token=VAULT_TOKEN)

if client.is_authenticated():
    db_secrets = client.secrets.database.generate_credentials(name='transcendence', role='transcendence')
    db_username = db_secrets['data']['username']
    db_password = db_secrets['data']['password']
    db_host = db_secrets['data']['hostname']
    db_port = db_secrets['data']['port']

    os.environ['DB_USERNAME'] = db_username
    os.environ['DB_PASSWORD'] = db_password
    os.environ['DB_HOST'] = db_host
    os.environ['DB_PORT'] = db_port

    print("Vault authentication and secret retrieval successful.")
else:
    raise Exception("Vault authentication failed.")