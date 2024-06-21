import createElement from '@helpers/element.js';
import Services from '@services';
import Cookies from '@src/Cookies.js';

function displayConfirmation(container) {
    const form = createElement('div', {
        class: "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark" });

    const confirmationText = createElement('div', {
        class: "form-control mb-3 border border-dark" });
    confirmationText.innerHTML = window.route.getLocaleValue("delete_confirmation");

    const buttonRow = createElement('div', {
        class: "row",
        style: "display: flex; justify-content: center;"
    });

    const noButton = createElement('button', {
        class: "btn btn-danger mb-3",
        style: "width: 70px; height: auto; margin-right: 1vw;",
    });
    noButton.innerHTML = window.route.getLocaleValue("no");
    noButton.addEventListener('click', () => {
        container.removeChild(form);
    });

    const yesButton = createElement('a', {
        class: "btn btn-primary mb-3",
        style: "width: 70px; height: auto;",
        href: "/"
    });
    yesButton.innerHTML = window.route.getLocaleValue("yes");
    yesButton.addEventListener('click', async function(event) {
        event.preventDefault();

        const response = await Services.Account.delete();
        if (response.ok) {
            localStorage.clear();
            Cookies.removeAll();
            window.location.href = '/';
        }
    });

    form.appendChild(confirmationText);
    buttonRow.appendChild(noButton);
    buttonRow.appendChild(yesButton);
    form.appendChild(buttonRow);

    container.appendChild(form);
}

export default async function initialize(wrapper) {
    const render = () => {
        const userData = localStorage.getItem('PRODProfile');
        const userObj = JSON.parse(userData);
        
        return (`
            <div class="justify-content-start align-items-center border rounded p-3" style="background-color: white; border-radius: 2px; width: 470px; height: 630px;">
                <div class="row align-items-center p-3 border-bottom" style="display: flex; justify-content: center; margin-bottom: 30px;">
                    <img class="rounded-circle img-fluid" style="width: 250px; height: auto;" src="${userObj.avatar}" alt="Avatar">
                    <div class="row align-items-center" style="display: flex; flex-direction: row; flex-wrap: nowrap; margin-top: 15px;">
                        <div class="h3 text-black" style="display: flex; justify-content: center;">
                            ${userObj.login}
                            <a class="bi bi-trash-fill text-danger cursor-pointer" style="cursor: pointer; font-size: 20px; margin-top: 6px;" id="delete-profile"></a>
                        </div>
                    </div>
                </div>
                <div class="align-items-center" style="margin-left: 20px;">
                    <div class="form-check form-switch d-flex align-items-center justify-content-center p-3" style="margin-left: 10px;">
                        <label class="form-check-label text-dark" for="cookies-switch", key='cookies_accept'></label>
                        <input class="form-check-input ms-2" type="checkbox" role="switch" id="cookies-switch">
                    </div>
                    <div class="form-check form-switch d-flex align-items-center justify-content-center p-3" style="margin-left: 10px;">
                        <label class="form-check-label text-dark" for="2fa-switch" key='multi_factor_authentication'></label>
                        <input class="form-check-input ms-2" type="checkbox" role="switch" id="2fa-switch">
                    </div>
                </div>
                <div class="row justify-content-center p-3">
                    <button class="btn btn-danger" style="width: 360px; height: 60px; margin-bottom: 1.5vh;" id="logout-button" key='log_out_button'></button>
                </div>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const deleteIcon = document.getElementById("delete-profile");
    const cookiesSwitch = document.getElementById("cookies-switch");
    const twofaSwitch = document.getElementById("2fa-switch");
    const logOutButton = document.getElementById("logout-button");

    cookiesSwitch.checked = Cookies.get("cookieStatus") === "true";

    cookiesSwitch.addEventListener("change", (event) => {
        Cookies.set("cookieStatus", event.target.checked ? "true" : "false");
    });

    const response = await Services.Account.verifyTwoFa("GET");
    if (response.ok) {
        const data = await response.json();
        twofaSwitch.checked = data.two_fa_status;
    }

    twofaSwitch.addEventListener("change", async (event) => {
        event.preventDefault();
        const response = await Services.Account.changeTwoFa();
        if (response.ok) {
            const data = await response.json();
            if (data.otp_url) {
                localStorage.setItem('TEMPOtp', data.otp_url);
                window.route.loadView('/two_factor_authentication');
            } else
                twofaSwitch.checked = false;
        }
    });

    logOutButton.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = '/';
    });

    deleteIcon.addEventListener("click", () => {
        displayConfirmation(wrapper);
    });
}
