import Services from '@services';

export default function initialize(wrapper) {
    const render = () => {
        return (`
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 470px; height: auto;">
                <div class="row align-items-center d-flex flex-column p-5">
                    <img src="/img/home/logo.png" style="width: 100px; height: 70px;">
                </div>
                <div class="row align-items-center d-flex flex-column h5">
                    <div class="text-center" key="reset_password"></div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="margin-top: 30px">
                    <div class="input-group">
                        <input type="password" id="password-input1" class="form-control border-dark border-end-0 p-3" placeholder="Password" style="-webkit-box-shadow: none !important;">
                        <span class="input-group-text bg-transparent border-dark border-start-0 rounded-end" id="toggle-password-visibility1">
                            <i class="bi bi-eye-slash fs-5"></i>
                        </span>
                        <div class="invalid-feedback" style="font-size: 8px;" id="password1-required-error" key="required"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password1-length-error" key="too_long"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password1-invalid-characters" key="invalid_char"></div>
                    </div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="margin-top: 20px">
                    <div class="input-group">
                        <input type="password" id="password-input2" class="form-control border-dark border-end-0 p-3" placeholder="Confirm Password" style="-webkit-box-shadow: none !important;">
                        <span class="input-group-text bg-transparent border-dark border-start-0 rounded-end" id="toggle-password-visibility2">
                            <i class="bi bi-eye-slash fs-5"></i>
                        </span>
                        <div class="invalid-feedback" style="font-size: 8px;" id="password2-required-error" key="required"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password-mismatch-error" key="not_same"></div>
                        <div class="invalid-feedback" style="font-size: 8px; display: none;" id="password2-invalid-characters" key="invalid_char"></div>
                    </div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <button id="continue-button" class="btn btn-lg btn-primary p-3" style="font-size: 12px; margin-top: 40px;" key="reset_password_button" disabled></button>
                </div>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const currentInput = document.getElementById("password-input1");
    const newInput = document.getElementById("password-input2");
    const toggleVisibility1 = document.getElementById("toggle-password-visibility1");
    const toggleVisibility2 = document.getElementById("toggle-password-visibility2");
    const submitButton = document.getElementById("continue-button");

    const togglePasswordVisibility = (inputElement, toggleElement) => {
        if (inputElement.type === "password") {
            inputElement.type = "text";
            toggleElement.innerHTML = '<i class="bi bi-eye fs-5"></i>';
        } else {
            inputElement.type = "password";
            toggleElement.innerHTML = '<i class="bi bi-eye-slash fs-5"></i>';
        }
    };

    toggleVisibility1.addEventListener("click", () => {
        togglePasswordVisibility(currentInput, toggleVisibility1);
    });

    toggleVisibility2.addEventListener("click", () => {
        togglePasswordVisibility(newInput, toggleVisibility2);
    });

    const validatePasswordAllowedCharacters = (input) => {
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:"<>?`-=[]\;\',./';
        for (let char of input)
            if (!allowedCharacters.includes(char))
                return false;
        return true;
    };

    const checkInputs = () => {
        const newPassword = currentInput.value.trim();
        const confirmPassword = newInput.value.trim();

        const isPasswordValid = newPassword !== "" && confirmPassword !== "" && newPassword === confirmPassword && newPassword.length <= 256 && confirmPassword.length <= 256 && validateEmailAllowedCharacters(newPassword);
        const isConfirmPasswordValid = confirmPassword !== "" && validatePasswordAllowedCharacters(confirmPassword);

        document.getElementById("password1-required-error").style.display = newPassword === "" ? 'block' : 'none';
        document.getElementById("password1-length-error").style.display = newPassword.length <= 256 ? 'none' : 'block';
        document.getElementById("password1-invalid-characters").style.display = validatePasswordAllowedCharacters(newPassword) ? 'none' : 'block';

        document.getElementById("password2-required-error").style.display = confirmPassword === "" ? 'block' : 'none';
        document.getElementById("password-mismatch-error").style.display = isPasswordValid ? 'none' : 'block';
        document.getElementById("password2-invalid-characters").style.display = validatePasswordAllowedCharacters(confirmPassword) ? 'none' : 'block';

        submitButton.disabled = !isPasswordValid || !isConfirmPasswordValid;
    };

    currentInput.addEventListener("input", checkInputs);
    newInput.addEventListener("input", checkInputs);

    currentInput.addEventListener("focusout", () => {
        document.getElementById("password1-required-error").style.display = currentInput.value.trim() === "" ? 'block' : 'none';
    });

    newInput.addEventListener("focusout", () => {
        document.getElementById("password2-required-error").style.display = newInput.value.trim() === "" ? 'block' : 'none';
    });

    submitButton.addEventListener("click", async () => {
        const newPassword = currentInput.value.trim();
        const confirmPassword = newInput.value.trim();
        if (newPassword === "" || confirmPassword === "" || newPassword !== confirmPassword) return;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('reset_code');
        
        await Services.Account.changePassword({
            code: code,
            new_password: newPassword,
            confirm_new_password: confirmPassword,
        });

        window.route.loadView("/auth/login");
    });
}
