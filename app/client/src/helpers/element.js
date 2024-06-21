
export default function createElement(tag, attributes) {
    const element = document.createElement(tag);
    for (const key in attributes)
        element.setAttribute(key, attributes[key]);

    return (element);
}

