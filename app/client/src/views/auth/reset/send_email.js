export default function initialize(wrapper) {
    const render = () => {
        return (`
            <div class="row justify-content-start align-items-center border rounded p-3 bg-white flex-column" style="width: 470px; height: auto;">
                <div class="row align-items-center d-flex flex-column p-5">
                    <img src="/img/home/logo.png" style="width: 100px; height: 70px;">
                </div>
                <div class="row align-items-center d-flex flex-column h6">
                    <div class="text-center" key="email_sent"></div>
                </div>
                <div class="row align-items-center d-flex flex-column p-3" style="font-size: 13px;">
                    <div key="send_email_text"></div>
                </div>
                <div class="row align-items-center d-flex flex-column" style="width: 94%;">
                    <button id="continue-button" class="btn btn-lg btn-secondary p-4" style="font-size: 12px; margin-top: 40px;" key="connection"></button>
                </div>
            </div>
        `);
    };

    wrapper.innerHTML = render();

    const submitButton = document.getElementById("continue-button");
    submitButton.addEventListener("click", async () => {
        window.route.loadView('/auth/login');
    });
}
