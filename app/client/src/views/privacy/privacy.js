import createElement from '@helpers/element.js';

export default function initialize(wrapper) {

    let tbl_text = [
        { text: 'privacy', isTitle: true },
        { text: 'privacy_msg', isTitle: false },
        { text: 'info_collected', isTitle: true },
        { text: 'info_collected_msg', isTitle: false },
        { text: 'info_shared', isTitle: true },
        { text: 'info_shared_msg', isTitle: false },
        { text: 'data_security', isTitle: true },
        { text: 'data_security_msg', isTitle: false },
        { text: 'third_party_links', isTitle: true },
        { text: 'third_party_links_msg', isTitle: false },
        { text: 'privacy_changes', isTitle: true },
        { text: 'privacy_changes_msg', isTitle: false },
    ];

    const privacyContainer = createElement('div', {
        class: 'w-50 d-flex flex-column justify-content-center align-items-center',
        style: 'margin: 11vh;'
    });

    tbl_text.forEach(data => {
        const text = createElement('p', {
            class: 'text-white text-center ' + (data.isTitle ? 'fs-1' : 'fs-3'),
            'key': data.text
        });
        privacyContainer.appendChild(text);
    });

    wrapper.appendChild(privacyContainer);
}
