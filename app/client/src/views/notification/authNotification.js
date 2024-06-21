
export default function initialize(message) {
    const currentNotif = document.querySelector('.display-notif-auth');

    if (currentNotif && message) {
        currentNotif.innerHTML = '';
        const notifAuth = document.createElement('notif-auth');
        notifAuth.setAttribute('message', window.route.getLocaleValue(message) || 'An error occurred');
        currentNotif.appendChild(notifAuth);
    }
}
