import Toastify from "toastify-js";

export class Toast{
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }

    static error = (message) => {
        return new Toast('error', message);
    }

    show = () => {
        Toastify({
            text: `<div><h3>Sauce for TCG Collector</h3><span>${this.message}</span></div>`,
            className: this.type,
            duration: 10000,
            destination: "#",
            newWindow: false,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            escapeMarkup: false
        }).showToast();
    }


}