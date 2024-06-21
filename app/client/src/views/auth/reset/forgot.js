import Services from '@services';
import AuthNotification from '@views/notification/authNotification.js';

export default function initialize(wrapper) {
    const render = () => {
        return (`
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 470px; height: auto;">
                <div class="row align-items-center d-flex flex-column p-5">
                    <img src="/img/home/logo.png" style="width: 100px; height: 70px;">
                </div>
                <div class="row align-items-center d-flex flex-column h6">
                    <div class="text-center" key="forgot_password"></div>
                </div>
                <div class="row align-items-center d-flex flex-column p-3" style="font-size: 13px;">
                    <div key="forgot_text"></div>
                </div>
                <div class="row align-items-center d-flex flex-column display-notif-auth"></div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <input id="email-input" class="form rounded border border-dark p-4" style="outline: none;" placeholder="Email">
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-error" key="required"></div>
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-length-error" key="too_long"></div>
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-invalid-characters" key="invalid_email"></div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <button id="continue-button" class="btn btn-lg btn-primary p-4" style="font-size: 12px; margin-top: 40px;" key="send_email" disabled></button>
                </div>
                <div class="row justify-content-center">
                    <button class="text-center" style="font-size: 14px; margin-top: 40px; background: none; border: none; padding: 0; text-decoration: underline; cursor: pointer;" key="back_auth" id="back_auth"></button>
                </div>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const emailInput = document.getElementById("email-input");
    const emailError = document.getElementById("email-error");
    const emailLengthError = document.getElementById("email-length-error");
    const emailInvalidCharactersError = document.getElementById("email-invalid-characters");
    const emailFeedback = document.getElementById("email-feedback");
    const submitButton = document.getElementById("continue-button");

    emailInput.value = localStorage.getItem("TEMPAuthEmail");

    const validateEmail = (email) => {
        return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    };

    const validateEmailAllowedCharacters = (email) => {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._@';
        for (let char of email)
            if (!allowedCharacters.includes(char))
                return false;
        return true;
    };

    const checkInputs = () => {
        const email = emailInput.value.trim();
        const isEmailValid = validateEmail(email);
        const isEmailLengthValid = email.length <= 100;
        const areAllowedCharactersValid = validateEmailAllowedCharacters(email);

        submitButton.disabled = !(isEmailValid && isEmailLengthValid && areAllowedCharactersValid);

        emailLengthError.style.display = isEmailLengthValid ? 'none' : 'block';
        emailInvalidCharactersError.style.display = areAllowedCharactersValid ? 'none' : 'block';

        return isEmailValid && isEmailLengthValid && areAllowedCharactersValid;
    };

    checkInputs();

    emailInput.addEventListener("input", () => {
        emailError.style.display = 'none';
        emailLengthError.style.display = 'none';
        emailInvalidCharactersError.style.display = 'none';
        checkInputs();
    });

    emailInput.addEventListener("blur", () => {
        const email = emailInput.value.trim();
        if (email === "" || !validateEmail(email)) {
            emailError.style.display = 'block';
        } else if (email.length > 100) {
            emailLengthError.style.display = 'block';
        } else if (!validateEmailAllowedCharacters(email)) {
            emailInvalidCharactersError.style.display = 'block';
        } else {
            emailError.style.display = 'none';
            emailLengthError.style.display = 'none';
            emailInvalidCharactersError.style.display = 'none';
        }
    });

    submitButton.addEventListener("click", async () => {
        const email = emailInput.value;
        if (!checkInputs() || email === "") 
            return;

        const response = await Services.Authentication.resetPassword({ 
            email: email 
        });
        (response.ok)
            ? window.route.loadView('/send-email')
            : AuthNotification(await response.json().message || "error_occurred");
    });

    const backToAuth = document.getElementById("back_auth");
    backToAuth.addEventListener("click", () => {
        window.route.loadView('/auth');
    });
}
