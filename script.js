let touchesActives = {}; // Stocke les touches actives
let circles = []; // Liste des cercles créés
let hasWinnerBeenChosen = false; // Empêche de choisir plusieurs gagnants
let timeoutId = null; // Stocke l'ID du setTimeout pour l'annuler si besoin

const colors = [
    "#FF6B6B", // Rouge corail
    "#F7B801", // Jaune safran
    "#6A0572", // Violet profond
    "#00B4D8", // Bleu turquoise
    "#8338EC", // Violet électrique
    "#FF006E", // Rose vif
    "#06D6A0", // Vert menthe
    "#118AB2", // Bleu océan
    "#FFD166", // Jaune doux
    "#EF476F", // Rose framboise
    "#073B4C", // Bleu nuit
    "#1B9AAA", // Bleu canard
    "#A28089", // Mauve élégant
    "#FF5E5B", // Rouge chaud
    "#FB8B24", // Orange moderne
    "#3A86FF", // Bleu vibrant
    "#FFBE0B", // Jaune punchy
    "#9B5DE5", // Mauve lumineux
    "#E63946", // Rouge intense
    "#457B9D", // Bleu doux
    "#264653", // Bleu pétrole
    "#D81159", // Rose magenta
    "#8AC926", // Vert pomme
    "#FF924C", // Orange doux
    "#A29BFE", // Lavande moderne
    "#FDCB58", // Or lumineux
    "#C14953", // Rouge brique
    "#2A9D8F", // Vert émeraude
    "#E76F51", // Terre cuite
    "#3D348B", // Bleu indigo
    "#F15BB5", // Rose bubblegum
    "#9C6644", // Brun chocolat
    "#D4A373", // Beige caramel
    "#5E60CE", // Bleu lavande
    "#8D99AE", // Gris bleuté
    "#EF233C", // Rouge dynamique
    "#06A77D", // Vert tropical
    "#7B2CBF", // Violet royal
    "#ED9B40"  // Orange safran 
];


let canvas = document.getElementById('mycanvas');
let heightRatio = 2;
canvas.height = canvas.width * heightRatio;

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".circle1").style.animation = "rotateLeft 3s infinite ease-in-out";
        document.querySelector(".circle2").style.animation = "rotateRight 5s infinite ease-in-out";
    }, 0.5); // Petit délai pour stabiliser la mise en page
});

// gestion changement de couleur
document.querySelector(".spinner").addEventListener("click", () => {
    const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector(".spinner").style.setProperty("--first-clr", randomColor1);
    document.querySelector(".spinner").style.setProperty("--second-clr", randomColor2);
    let mixColor = mixColors(randomColor1, randomColor2);

    document.documentElement.style.setProperty("--color1", randomColor1);
    document.documentElement.style.setProperty("--color2", mixColor);
    document.documentElement.style.setProperty("--color3", randomColor2);

    document.getElementById("myText").style.setProperty("color", randomColor1);
});

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
function hexToRgb(hex) {
    let bigint = parseInt(hex.substring(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function mixColors(color1, color2) {
    let rgb1 = hexToRgb(color1);
    let rgb2 = hexToRgb(color2);

    let mixedColor = {
        r: Math.floor((rgb1.r + rgb2.r) / 2),
        g: Math.floor((rgb1.g + rgb2.g) / 2),
        b: Math.floor((rgb1.b + rgb2.b) / 2),
    };

    return rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b);
}
// Fonction pour choisir un gagnant et relancer une nouvelle partie
// function chooseRandomWinner() {
//     if (circles.length === 0 ) return;  

//     let randomIndex = Math.floor(Math.random() * circles.length);
//     let winner = circles[randomIndex];

//     winner.classList.add("winner");
//     winner.style.border = "0px";
//     winner.style.backgroundColor = "red";

//     // Faire disparaître les autres cercles avec une animation
//     circles.forEach(circle => {
//         if (circle !== winner) {
//             circle.remove()
//         }
//     });

//     // Réinitialiser pour permettre une nouvelle partie
//     setTimeout(() => {
//         hasWinnerBeenChosen = false; // Permet de relancer une nouvelle partie
//         circles = []; // Vide la liste des cercles
//     }, 500);
// }
function chooseRandomWinner() {
    if (circles.length === 0) return;

    // Vérifie si le switch est activé
    const switchInput = document.querySelector(".switch input");
    const numberOfWinners = switchInput.checked ? 2 : 1;

    let winners = [];
    let availableCircles = [...circles]; // Copie de la liste des cercles

    for (let i = 0; i < numberOfWinners; i++) {
        if (availableCircles.length === 0) break; // Sécurité si moins de cercles
        let randomIndex = Math.floor(Math.random() * availableCircles.length);
        let winner = availableCircles[randomIndex];
        winners.push(winner);
        availableCircles.splice(randomIndex, 1); // Supprime le gagnant de la liste
    }

    winners.forEach(winner => {
        winner.classList.add("winner");
        winner.style.border = "0px";
        winner.style.backgroundColor = "red";
    });

    // Faire disparaître les autres cercles avec une animation
    circles.forEach(circle => {
        if (!winners.includes(circle)) {
            circle.remove();
        }
    });

    // Réinitialisation pour permettre une nouvelle partie
    setTimeout(() => {
        hasWinnerBeenChosen = false;
        circles = [];
    }, 1000);
}


// off-line config
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("Service Worker enregistré !"))
    .catch(err => console.log("Erreur Service Worker :", err));
}