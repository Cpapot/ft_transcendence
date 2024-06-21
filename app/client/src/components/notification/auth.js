import Component from '@components/Component.js';

export default class NotifAuth extends Component {
    constructor() {
        super();

        this.name = 'notif-auth';
    }

    render() {
        return (`
            <div class="align-items-center d-flex flex-row border border-dark rounded" style="width: 389px; height: 70px; background-color: #e9ecef; margin-bottom: 20px;">
                <div class="d-flex align-items-center justify-content-center" style="width: 20%;">
                    <i class="bi bi-x-circle-fill fs-5 text-danger"></i>
                </div>
                <div class="d-flex align-items-center justify-content-start" style="width: 80%;">
                    <p class="mb-0 text-danger">${this.getAttribute('message')}</p>
                </div>
            </div>
        `)
    }
}