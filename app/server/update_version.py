import subprocess
import pkg_resources

def check_update(dependency):
    installed_version = pkg_resources.get_distribution(dependency).version
    print(f"Version installée de {dependency}: {installed_version}")

    latest_version = subprocess.check_output(['pip', 'show', dependency]).decode('utf-8')
    latest_version = [line for line in latest_version.split('\n') if line.startswith('Version:')]
    latest_version = latest_version[0].split(': ')[1].strip() if latest_version else None
    print(f"Dernière version de {dependency}: {latest_version}")

    if latest_version and installed_version != latest_version:
        print(f"La version {latest_version} est disponible. Mise à jour en cours...")
        subprocess.check_call(['pip', 'install', '--upgrade', dependency])
        print("Mise à jour terminée.")
    elif latest_version:
        print("La version est à jour.")
    else:
        print("Impossible de trouver la dernière version.")

if __name__ == "__main__":
    dependency = 'nom_de_la_dependance'
    check_update(dependency)