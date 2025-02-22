let touchesActives = {};

document.addEventListener("touchstart", (event) => {
    for (let touch of event.changedTouches) {
        let circle = document.createElement("div");
        circle.classList.add("circle");
        circle.style.backgroundColor = getRandomColor();
        circle.style.left = `${touch.clientX}px`;
        circle.style.top = `${touch.clientY}px`;
        circle.dataset.touchId = touch.identifier; // Associer l'ID du toucher
        document.body.appendChild(circle);
        touchesActives[touch.identifier] = circle;
    }
});

document.addEventListener("touchmove", (event) => {
    for (let touch of event.changedTouches) {
        let circle = touchesActives[touch.identifier];
        if (circle) {
            circle.style.left = `${touch.clientX}px`;
            circle.style.top = `${touch.clientY}px`;
        }
    }
});

document.addEventListener("touchend", (event) => {
    for (let touch of event.changedTouches) {
        let circle = touchesActives[touch.identifier];
        if (circle) {
            circle.remove(); // Supprime le cercle quand le doigt se lève
            delete touchesActives[touch.identifier];
        }
    }
});

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`; // Couleur aléatoire vive
}

let mybutton = document.querySelector("button");
mybutton.addEventListener("click", () => {
    alert("Reset");
});