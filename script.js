let touchesActives = {}; // Stocke les touches actives
let circles = []; // Liste des cercles créés
let hasWinnerBeenChosen = false; // Empêche de choisir plusieurs gagnants
let timeoutId = null; // Stocke l'ID du setTimeout pour l'annuler si besoin

let canvas = document.getElementById('mycanvas');
let heightRatio = 2;
canvas.height = canvas.width * heightRatio;

canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    
    for (let touch of event.changedTouches) {
        let circle = document.createElement("div");
        circle.classList.add("circle");
        circle.style.left = `${touch.clientX}px`;
        circle.style.top = `${touch.clientY}px`; 
        circle.dataset.touchId = touch.identifier;
        document.body.appendChild(circle);
        touchesActives[touch.identifier] = circle;
        circles.push(circle);
    }

    // Si c'est le dernier participant qui touche l'écran, on démarre le timer
    clearTimeout(timeoutId); // Annule un timer précédent 
    timeoutId = setTimeout(chooseRandomWinner, 4000);
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    for (let touch of event.changedTouches) {
        let circle = touchesActives[touch.identifier];
        if (circle) {
            circle.style.left = `${touch.clientX}px`;
            circle.style.top = `${touch.clientY}px`;
        }
    }
}, { passive: false });

canvas.addEventListener("touchend", (event) => {
    for (let touch of event.changedTouches) {
        let circle = touchesActives[touch.identifier];
        if (circle) {
            circle.remove();
            delete touchesActives[touch.identifier];
        }
    }
});

// Fonction pour choisir un gagnant et relancer une nouvelle partie
function chooseRandomWinner() {
    if (circles.length === 0 ) return;  

    let randomIndex = Math.floor(Math.random() * circles.length);
    let winner = circles[randomIndex];



    winner.classList.add("winner");
    winner.style.border = "0px";
    winner.style.backgroundColor = "red";

    // Faire disparaître les autres cercles avec une animation
    circles.forEach(circle => {
        if (circle !== winner) {
            circle.remove()
        }
    });

    // Réinitialiser pour permettre une nouvelle partie
    setTimeout(() => {
        hasWinnerBeenChosen = false; // Permet de relancer une nouvelle partie
        circles = []; // Vide la liste des cercles
    }, 1000);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("Service Worker enregistré !"))
    .catch(err => console.log("Erreur Service Worker :", err));
}