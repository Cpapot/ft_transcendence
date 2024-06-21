import datetime

class Console:
    @staticmethod
    def info(message):
        Console._print_colored("[INFO]", message, color="green")

    @staticmethod
    def error(message):
        Console._print_colored("[ERROR]", message, color="red")

    @staticmethod
    def success(message):
        Console._print_colored("[SUCCESS]", message, color="green")

    @staticmethod
    def debug(message):
        Console._print_colored("[DEBUG]", message, color="blue")

    @staticmethod
    def _print_colored(level, message, color):
        colors = {
            "green": "\033[92m",
            "red": "\033[91m",
            "blue": "\033[94m"
        }
        reset_color = "\033[0m"
        current_time = datetime.datetime.now().strftime("%H:%M:%S")
        print(f"{colors[color]}{level} : {current_time}{reset_color} {message}")
