import Services from '@services';
import { SetUserStorage } from '@security/authStorage';

export default async function initialize(wrapper) {
    const render = () => {
        return (`
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 425px; height: auto;">
                <div class="row align-items-center p-2" style="font-size: 20px;" key="multi_factor_authentication"></div>
                <div class="row align-items-center p-3 border-top" style="font-size: 12px; margin-top: 20px;" key="manual_code_text"></div>
                <div class="row d-flex justify-content-center align-items-center" style="margin-top: 20px;">
                    <input class="col-2 form-control text-center rounded border-dark" type="text" maxlength="1" style="width: 40px; height: 55px; margin-right: 10px; font-size: 23px; font-family: Inter, sans-serif"></input>
                    <input class="col-2 form-control text-center rounded border-dark" type="text" maxlength="1" style="width: 40px; height: 55px; margin-right: 10px; font-size: 23px; font-family: Inter, sans-serif"></input>
                    <input class="col-2 form-control text-center rounded border-dark" type="text" maxlength="1" style="width: 40px; height: 55px; margin-right: 10px; font-size: 23px; font-family: Inter, sans-serif"></input>
                    <input class="col-2 form-control text-center rounded border-dark" type="text" maxlength="1" style="width: 40px; height: 55px; margin-right: 10px; font-size: 23px; font-family: Inter, sans-serif"></input>
                    <input class="col-2 form-control text-center rounded border-dark" type="text" maxlength="1" style="width: 40px; height: 55px; margin-right: 10px; font-size: 23px; font-family: Inter, sans-serif"></input>
                    <input class="col-2 form-control text-center rounded border-dark" type="text" maxlength="1" style="width: 40px; height: 55px; margin-right: 10px; font-size: 23px; font-family: Inter, sans-serif"></input>
                </div>
                <button class="row btn btn-primary d-flex justify-content-around align-items-center" style="margin-top: 35px; font-size: 13px; width: 360px; height: 50px;" key="submit_button" disabled></button>
                <button class="row btn d-flex justify-content-around align-items-center" style="margin-top: 15px; font-size: 13px; width: 360px; height: 50px; background-color: #D3D3D3;" key="cancel_button"></button>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const cancelButton = wrapper.querySelector('[key="cancel_button"]');
    const submitButton = wrapper.querySelector('[key="submit_button"]');
    const inputs = wrapper.querySelectorAll('input');

    cancelButton.addEventListener('click', () => {
        localStorage.clear();
        window.route.loadView("/");
    });

    inputs.forEach(input => {
        input.addEventListener("keypress", (e) => {
            const charCode = e.which ? e.which : e.keyCode;
            if ((charCode < 48 || charCode > 57) || (e.target.value.length >= 1)) {
                e.preventDefault();
            }
            checkInputs();
        });

        input.addEventListener("input", (e) => {
            if (e.target.value.length === 1) {
                const nextInput = e.target.nextElementSibling;
                if (nextInput)
                    nextInput.focus();
                checkInputs();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                if (e.target.value === "") {
                    const prevInput = e.target.previousElementSibling;
                    if (prevInput)
                        prevInput.focus();
                }
                checkInputs(true);
            } else if (e.key === "ArrowRight") {
                const nextInput = e.target.nextElementSibling;
                if (nextInput) {
                    e.preventDefault();
                    nextInput.focus();
                }
            } else if (e.key === "ArrowLeft") {
                const prevInput = e.target.previousElementSibling;
                if (prevInput) {
                    e.preventDefault();
                    prevInput.focus();
                }
            }
        });
    });

    function checkInputs(backspace) {
        const allFilled = Array.from(inputs).every(input => input.value.length === 1);
        if (allFilled && !backspace)
            submitButton.disabled = false;
        else
            submitButton.disabled = true;
    }

    submitButton.addEventListener('click', async () => {
        const values = [];
        inputs.forEach(input => {
            values.push(input.value);
        });
        const code = values.join("");
        if (code.length === 6) {
            const response = await Services.Account.verifyTwoFa("POST", { code });
            if (response.ok) {
                const data = await response.json();
                SetUserStorage(data);
            }
        }
    });
}
