fetch('tableaucouleurs.json')
    .then(response => response.json()) 
    .then(data => {
        colors = data; 
    })
.catch(error => console.error("Erreur de chargement du JSON", error));

let touchesActives = {}; // Stocke les touches actives
let circles = []; // Liste des cercles créés
let hasWinnerBeenChosen = false; // Empêche de choisir plusieurs gagnants
let timeoutId = null; // Stocke l'ID du setTimeout pour l'annuler si besoin

let canvas = document.getElementById('mycanvas');
let heightRatio = 2;
canvas.height = canvas.width * heightRatio;

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".circle1").style.animation = "rotateLeft 3s infinite ease-in-out";
        document.querySelector(".circle2").style.animation = "rotateRight 5s infinite ease-in-out";
    }, 0.5); // Petit délai pour stabiliser la mise en page
});

// gestion classement
document.querySelector(".texte").addEventListener("click", () => {
    document.getElementById("popup").classList.add("show");
    let listclassement = document.getElementById("popupList");
    listclassement.innerHTML = "";   
    for(let i = 0; i < localStorage.length; i++) {
        var li = document.createElement("li");
        const userKey = Object.keys(localStorage)[i]; // Récupération de la clé utilisateur
        let score = parseInt(localStorage.getItem(userKey)) || 0;
        const scoreText = document.createTextNode(userKey + " : " + score);
        // Bouton "-" à gauche
        const minusButton = document.createElement("button");
        minusButton.classList.add("button-minus");
        minusButton.textContent = "-";
        minusButton.setAttribute("data-index", i);
        // Bouton "+" à droite
        const plusButton = document.createElement("button");
        plusButton.classList.add("button-plus");
        plusButton.textContent = "+";
        plusButton.setAttribute("data-index", i);



        // Ajouter les éléments dans le <li>
        li.appendChild(minusButton);
        li.appendChild(scoreText);
        li.appendChild(plusButton);
        // Ajout des événements de clic
        minusButton.addEventListener("click", function () {
            //console.log("Bouton - cliqué pour :", Object.keys(localStorage)[i]);
            let moins = parseInt(Object.values(localStorage)[i]);
            let user = Object.keys(localStorage)[i];
            moins -= 1;
            localStorage.setItem(user, moins.toString());
            scoreText.nodeValue = userKey + " : " + moins;
        });

        plusButton.addEventListener("click", function () {
            //console.log("Bouton + cliqué pour :", Object.keys(localStorage)[i]);
            let plus = parseInt(Object.values(localStorage)[i]);
            let user = Object.keys(localStorage)[i];
            plus += 1;
            localStorage.setItem(user, plus.toString());
            scoreText.nodeValue = userKey + " : " + plus;
        });
        listclassement.appendChild(li); 
    }
    
    document.getElementById("popup").style.display = "flex";
});

document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("popup").classList.remove("show");
    document.getElementById("popup").style.display = "none";
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

    localStorage.clear()
    localStorage.setItem('Matisse', '1');
    localStorage.setItem('Pierre', '2');
    localStorage.setItem('Yolan', '2');
    localStorage.setItem('Alexis', '2');
    localStorage.setItem('Justine', '2');
    localStorage.setItem('Axel', '2');

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