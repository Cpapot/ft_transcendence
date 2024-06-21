
from ..api.services.user_history_service import UserHistoryService
from ..api.logger import Console

def main():
    try:
        UserHistoryService.delete_inactive_users()
        Console.success('Inactive users cleaned successfully')
    except Exception as e:
        Console.error(f'An error occurred: {e}')

if __name__ == '__main__':
    main()
