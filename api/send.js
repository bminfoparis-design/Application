async function submitResendForm(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('leadForm');
    const successDiv = document.getElementById('formSuccess');
    const slugProfile = document.getElementById('db-slug').innerText; // Récupère "PROFIL : RH" ou "MARKETING" dynamiquement

    // Changement d'état du bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin mr-2"></i>Envoi en cours...';

    // Collecte des données du formulaire
    const payload = {
        nom: document.getElementById('form-nom').value,
        email: document.getElementById('form-email').value,
        offre: slugProfile, // Envoie automatiquement l'offre/métier sélectionné sur le dashboard
        message: document.getElementById('form-message').value
    };

    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Affichage du succès
            form.classList.add('hidden');
            successDiv.classList.remove('hidden');
            
            // Réinitialisation après 5 secondes
            setTimeout(() => {
                form.reset();
                form.classList.remove('hidden');
                successDiv.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Envoyer ma demande <i class="fa-solid fa-paper-plane ml-1.5 text-[10px]"></i>';
                closeAudit(); // Ferme la pop-up automatiquement
            }, 5000);
        } else {
            alert("Erreur lors de l'envoi : " + (result.error || "Une erreur est survenue."));
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Envoyer ma demande <i class="fa-solid fa-paper-plane ml-1.5 text-[10px]"></i>';
        }
    } catch (error) {
        console.error("Erreur technique:", error);
        alert("Impossible de joindre le serveur d'envoi.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer ma demande <i class="fa-solid fa-paper-plane ml-1.5 text-[10px]"></i>';
    }
}
