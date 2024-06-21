import Services from '@services';
import { SetAuthStorage } from '@security/authStorage.js';
import AuthNotification from '@views/notification/authNotification.js';

export default function initialize(wrapper) {
    const render = () => {
        return (`
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 470px; height: auto;">
                <div class="row align-items-center d-flex flex-column p-4">
                    <img src="/img/home/logo.png" style="width: 100px; height: 70px;">
                </div>
                <div class="row align-items-center d-flex flex-column p-3 h6">
                    <div class="text-center" key="sign_in_interface"></div>
                </div>
                <div class="row align-items-center d-flex flex-column display-notif-auth"></div>
                <div class="row align-items-center d-flex flex-column">
                    <div class="input-group">
                        <input id="email-input" class="form-control border-dark border-end-0 p-4" style="outline: none;" placeholder="Email" disabled>
                        <span class="input-group-text bg-transparent border-dark border-start-0 rounded-end" id="toggle-email-modifier">
                            <i class="bi bi-pencil-square fs-5"></i>
                        </span>
                        <div class="invalid-feedback" style="font-size: 8px;" id="email-required-error" key="required" style="display: none;"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-length-error" key="too_long"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-invalid-characters" key="invalid_email"></div>
                    </div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="margin-top: 30px">
                    <div class="input-group">
                        <input type="password" id="password-input" class="form-control border-dark border-end-0 p-4" placeholder="Password" style="-webkit-box-shadow: none !important;">
                        <span class="input-group-text bg-transparent border-dark border-start-0 rounded-end" id="toggle-password-visibility">
                            <i class="bi bi-eye-slash fs-5"></i>
                        </span>
                        <div class="invalid-feedback" style="font-size: 8px;" id="password-required-error" style="display: none;" key="required"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password-length-error" key="too_long"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password-invalid-characters" key="invalid_char"></div>
                    </div>
                </div>
                <div class="row align-items-center p-3">
                    <div class="btn btn-link p-0 m-0" style="font-size: 13px; color: inherit; margin-top: 20px;" key='forgot_password' id="forgot_password"></div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <button id="continue-button" class="btn btn-lg btn-primary p-4" style="font-size: 12px; margin-top: 20px;" key='connection' disabled></button>
                </div>
                <div class="row justify-content-center">
                    <button class="text-center" style="font-size: 14px; margin-top: 40px; background: none; border: none; padding: 0; text-decoration: underline; cursor: pointer;" key="back_auth" id="back_auth"></button>
                </div>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const passwordInput = document.getElementById("password-input");
    const toggleEmailModifier = document.getElementById("toggle-email-modifier");
    const toggleVisibility = document.getElementById("toggle-password-visibility");
    const forgotPassword = document.getElementById("forgot_password");
    const backToAuth = document.getElementById("back_auth");

    const passwordLengthError = document.getElementById("password-length-error");
    const passwordInvalidCharactersError = document.getElementById("password-invalid-characters");

    toggleEmailModifier.addEventListener("click", () => {
        window.route.loadView('/auth');
    });

    forgotPassword.addEventListener("click", () => {
        window.route.loadView('/forgot-password');
    });

    toggleVisibility.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleVisibility.innerHTML = '<i class="bi bi-eye fs-5"></i>';
        } else {
            passwordInput.type = "password";
            toggleVisibility.innerHTML = '<i class="bi bi-eye-slash fs-5"></i>';
        }
    });

    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.trim() === "")
            passwordInput.classList.add("is-invalid");
        else
            passwordInput.classList.remove("is-invalid");
    });

    backToAuth.addEventListener("click", () => {
        window.route.loadView('/auth');
    });

    const emailInput = document.getElementById("email-input");
    const emailLengthError = document.getElementById("email-length-error");
    const emailInvalidCharactersError = document.getElementById("email-invalid-characters");
    const submitButton = document.getElementById("continue-button");

    emailInput.value = localStorage.getItem('TEMPAuthEmail');

    const validateEmailAllowedCharacters = (input) => {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._@';
        for (let char of input)
            if (!allowedCharacters.includes(char))
                return false;
        return true;
    };

    const validatePasswordAllowedCharacters = (input) => {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:"<>?`-=[]\;\',./';
        for (let char of input)
            if (!allowedCharacters.includes(char))
                return false;
        return true;
    };

    const checkInputs = () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        const isEmailValid = email !== "";
        const isEmailLengthValid = email.length <= 100;
        const areEmailAllowedCharactersValid = validateEmailAllowedCharacters(email);
        
        const isPasswordValid = password !== "";
        const isPasswordLengthValid = password.length <= 256;
        const arePasswordAllowedCharactersValid = validatePasswordAllowedCharacters(password);

        document.getElementById("email-required-error").style.display = isEmailValid ? 'none' : 'block';
        emailLengthError.style.display = isEmailLengthValid ? 'none' : 'block';
        emailInvalidCharactersError.style.display = areEmailAllowedCharactersValid ? 'none' : 'block';

        document.getElementById("password-required-error").style.display = isPasswordValid ? 'none' : 'block';
        passwordLengthError.style.display = isPasswordLengthValid ? 'none' : 'block';
        passwordInvalidCharactersError.style.display = arePasswordAllowedCharactersValid ? 'none' : 'block';

        submitButton.disabled = !(isEmailValid && isEmailLengthValid && areEmailAllowedCharactersValid && isPasswordValid && isPasswordLengthValid && arePasswordAllowedCharactersValid);

        return isEmailValid && isEmailLengthValid && areEmailAllowedCharactersValid && isPasswordValid && isPasswordLengthValid && arePasswordAllowedCharactersValid;
    };

    [emailInput, passwordInput].forEach(input => input.addEventListener("input", checkInputs));

    submitButton.addEventListener("click", async () => {
        if (!checkInputs()) return;

        const email = emailInput.value;
        const password = passwordInput.value;
        if (email === "" || password === "") return;

        const response = await Services.Authentication.set({
            method: 'login',
            email: email, password: password 
        });

        const data = await response.json();
        (response.ok)
            ? SetAuthStorage(data)
            : AuthNotification(data.message || "error_occurred");
    });
}
