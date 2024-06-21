import Services from '@services';
import { SetAuthStorage } from '@security/authStorage.js';
import AuthNotification from '@views/notification/authNotification.js';

export default function initialize(wrapper) {
    const render = () => {
        return `
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 470px; height: auto;">
                <div class="row align-items-center d-flex flex-column p-4">
                    <img src="/img/home/logo.png" style="width: 100px; height: 70px;">
                </div>
                <div class="row align-items-center d-flex flex-column p-3 h6">
                    <div class="text-center" key="create_accout"></div>
                </div>
                <div class="row align-items-center d-flex flex-column display-notif-auth"></div>
                <div class="row align-items-center d-flex flex-column" style="">
                    <div class="input-group">
                        <input id="email-input" class="form-control border-dark border-end-0 p-3" style="outline: none;" placeholder="Email" disabled>
                        <span class="input-group-text bg-transparent border-dark border-start-0 rounded-end" id="toggle-email-modifier">
                            <i class="bi bi-pencil-square fs-5"></i>
                        </span>
                        <div class="invalid-feedback" style="font-size: 8px;" id="email-required-error" key="required"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-length-error" key="too_long"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-invalid-characters" key="invalid_email"></div>
                    </div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%; margin-top: 20px;">
                    <select id="country-select" class="form rounded border border-dark p-3" style="outline: none;">
                        <option value="" disabled selected>Country</option>
                        <option value="France">France</option>
                        <option value="Germany">Allemagne</option>
                        <option value="England">Angleterre</option>
                        <option value="Spain">Espagne</option>
                    </select>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%; margin-top: 20px;">
                    <input id="login-input" class="form rounded border border-dark p-3" style="outline: none;" placeholder="Login">
                    <div class="invalid-feedback" style="font-size: 8px;" id="login-required-error" key="required"></div>
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="login-length-error" key="too_long"></div>
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="login-invalid-characters" key="invalid_char"></div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="margin-top: 20px">
                    <div class="input-group">
                        <input type="password" id="password-input" class="form-control border-dark border-end-0 p-3" placeholder="Password" style="-webkit-box-shadow: none !important;">
                        <span class="input-group-text bg-transparent border-dark border-start-0 rounded-end" id="toggle-password-visibility">
                            <i class="bi bi-eye-slash fs-5"></i>
                        </span>
                        <div class="invalid-feedback" style="font-size: 8px;" id="password-required-error" key="required"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password-length-error" key="too_long"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password-invalid-characters" key="invalid_char"></div>
                    </div>
                </div>
                <div class="d-flex justify-content-center form-check" style="margin-top: 25px;">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label" style="margin-left: 10px; font-size: 13px;" for="flexCheckDefault" key="read_accept"></label>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <button id="continue-button" class="btn btn-lg btn-primary p-4" style="font-size: 12px; margin-top: 25px;" key='continue' disabled></button>
                </div>
                <div class="row justify-content-center">
                    <button class="text-center" style="font-size: 14px; margin-top: 20px; background: none; border: none; padding: 0; text-decoration: underline; cursor: pointer;" key="privacy" id="display_conf"></button>
                    <button class="text-center" style="font-size: 14px; margin-top: 20px; background: none; border: none; padding: 0; text-decoration: underline; cursor: pointer;" key="back_auth" id="back_auth"></button>
                </div>
            </div>
        `;
    };

    wrapper.innerHTML = render();

    const emailRequiredError = document.getElementById("email-required-error");
    const loginRequiredError = document.getElementById("login-required-error");
    const passwordRequiredError = document.getElementById("password-required-error");
    const emailLengthError = document.getElementById("email-length-error");
    const emailInvalidCharactersError = document.getElementById("email-invalid-characters");
    const loginLengthError = document.getElementById("login-length-error");
    const loginInvalidCharactersError = document.getElementById("login-invalid-characters");
    const passwordLengthError = document.getElementById("password-length-error");
    const passwordInvalidCharactersError = document.getElementById("password-invalid-characters");

    const submitButton = document.getElementById("continue-button");
    const emailInput = document.getElementById("email-input");
    const countrySelect = document.getElementById("country-select");
    const loginInput = document.getElementById("login-input");
    const passwordInput = document.getElementById("password-input");
    const togglePasswordVisibility = document.getElementById("toggle-password-visibility");
    const checkbox = document.getElementById("flexCheckDefault");

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

    const validateLoginCharacters = (input) => {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
        for (let char of input)
            if (!allowedCharacters.includes(char))
                return false;
        return true;
    };

    const checkInputs = () => {
        const email = emailInput.value.trim();
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isEmailLengthValid = email.length <= 100;
        const areEmailAllowedCharactersValid = validateEmailAllowedCharacters(email);

        const isCountrySelected = countrySelect.value !== "";

        const isLoginValid = login !== "";
        const isLoginLengthValid = login.length <= 16;
        const areLoginAllowedCharactersValid = validateLoginCharacters(login);

        const isPasswordValid = password !== "";
        const isPasswordLengthValid = password.length <= 256;
        const arePasswordAllowedCharactersValid = validatePasswordAllowedCharacters(password);

        const isCheckboxChecked = checkbox.checked;

        emailLengthError.style.display = isEmailLengthValid ? 'none' : 'block';
        emailInvalidCharactersError.style.display = areEmailAllowedCharactersValid ? 'none' : 'block';

        loginLengthError.style.display = isLoginLengthValid ? 'none' : 'block';
        loginInvalidCharactersError.style.display = areLoginAllowedCharactersValid ? 'none' : 'block';

        passwordLengthError.style.display = isPasswordLengthValid ? 'none' : 'block';
        passwordInvalidCharactersError.style.display = arePasswordAllowedCharactersValid ? 'none' : 'block';

        submitButton.disabled = !(isEmailValid && isEmailLengthValid && areEmailAllowedCharactersValid && isCountrySelected && isLoginValid && isLoginLengthValid && areLoginAllowedCharactersValid && isPasswordValid && isPasswordLengthValid && arePasswordAllowedCharactersValid && isCheckboxChecked);

        return isEmailValid && isEmailLengthValid && areEmailAllowedCharactersValid && isCountrySelected && isLoginValid && isLoginLengthValid && areLoginAllowedCharactersValid && isPasswordValid && isPasswordLengthValid && arePasswordAllowedCharactersValid && isCheckboxChecked;
    };

    [emailInput, countrySelect, loginInput, passwordInput, checkbox].forEach(input => input.addEventListener("input", checkInputs));
    checkbox.addEventListener("change", checkInputs); 
    
    togglePasswordVisibility.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordVisibility.innerHTML = '<i class="bi bi-eye fs-5"></i>';
        } else {
            passwordInput.type = "password";
            togglePasswordVisibility.innerHTML = '<i class="bi bi-eye-slash fs-5"></i>';
        }
    });

    submitButton.addEventListener("click", async () => {
        if (!checkInputs()) return;
        
        const email = emailInput.value;
        const country = countrySelect.value;
        const login = loginInput.value;
        const password = passwordInput.value;
        
        if (email === "" || country === "" || login === "" || password === "") return;

        const response = await Services.Authentication.set({
            method: 'register',
            email: email, country: country, 
            username: login, password: password 
        });

        const data = await response.json();
        (response.ok)
            ? SetAuthStorage(data)
            : AuthNotification(data.message || "error_occurred");
    });

    const toggleEmailModifier = document.getElementById("toggle-email-modifier");
    const displayConf = document.getElementById("display_conf");
    const backToAuth = document.getElementById("back_auth");

    toggleEmailModifier.addEventListener("click", () => {
        window.route.loadView('/auth');
    });
    
    displayConf.addEventListener("click", () => {
        window.route.loadView('/privacy');
    });
    
    backToAuth.addEventListener("click", () => {
        window.route.loadView('/auth');
    });
    
    emailInput.addEventListener("blur", () => {
        const emailValue = emailInput.value.trim();
        emailRequiredError.style.display = emailValue === "" ? "block" : "none";
    });

    loginInput.addEventListener("blur", () => {
        const loginValue = loginInput.value.trim();
        loginRequiredError.style.display = loginValue === "" ? "block" : "none";
    });

    passwordInput.addEventListener("blur", () => {
        const passwordValue = passwordInput.value.trim();
        passwordRequiredError.style.display = passwordValue === "" ? "block" : "none";
    });
}
