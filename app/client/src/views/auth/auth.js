import Services from '@services';

export default function initialize(wrapper) {
    const render = () => {
        return (`
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 470px; height: auto;">
                <div class="row align-items-center d-flex flex-column p-5">
                    <img src="/img/home/logo.png" style="width: 100px; height: 70px;">
                </div>
                <div class="row align-items-center d-flex flex-column p-3 h6">
                    <div class="text-center" key="signin_or_signup"></div>
                </div>
                <div class="row align-items-center d-flex flex-column display-notif-auth"></div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <input id="email-input" class="form rounded border border-dark p-4" style="outline: none;" placeholder="Email">
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-error" key="required"></div>
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-length-error" key="too_long"></div>
                    <div class="invalid-feedback" style="font-size: 8px; display: none;" id="email-invalid-characters" key="invalid_email"></div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <button id="continue-button" class="btn btn-lg btn-primary p-4" style="font-size: 12px; margin-top: 40px;" key="continue" disabled></button>
                </div>
                <div class="row align-items-center p-4 d-flex flex-row" style="font-size: 11px; margin-top: 20px;">
                    <div class="col-4 border-bottom border-dark"></div>
                    <div class="col-4 text-center" key="continue_with"></div>
                    <div class="col-4 border-bottom border-dark"></div>
                </div>
                <div class="row align-items-center d-flex flex-column">
                    <button class="btn btn-lg btn-dark p-4 intra-button" style="width: 94%; font-size: 18px; margin-top: 20px;" key="sign_in_intra"></button>
                </div>
                <div class="row justify-content-center">
                    <p class="text-center" style="font-size: 14px; margin-top: 40px;" key="privacy_auth" id="privacy_text"></p>
                </div>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const emailInput = document.getElementById("email-input");
    const emailError = document.getElementById("email-error");
    const emailLengthError = document.getElementById("email-length-error");
    const emailInvalidCharactersError = document.getElementById("email-invalid-characters");
    const submitButton = document.getElementById("continue-button");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
        const check = checkInputs();
        if (!check) return;
        const email = emailInput.value;
        if (email === "") return;

        const response = await Services.Authentication.verify_user({ email: email });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('TEMPAuthEmail', email);

            const link = data.exist ? '/auth/login' : '/auth/register';
            window.route.loadView(link);
        } else {
            emailError.style.display = 'block';
            emailError.textContent = data.message || "Une erreur est survenue";
        }
    });

    const submitIntra = document.querySelector(".intra-button");

    submitIntra.addEventListener("click", () => {
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUrl = "https://localhost:8080/oauth";
        const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;

        const popupOptions = 'width=400,height=600,scrollbars=yes,resizable=yes,toolbar=no,location=no';
        window.open(authUrl, 'popup', popupOptions);
    });
}
