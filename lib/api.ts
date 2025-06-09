// Fonctions d'API pour interagir avec les endpoints

// Livreurs
export async function getLivreurs() {
  const response = await fetch("/api/livreurs")
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des livreurs")
  }
  return response.json()
}

export async function approveLivreur(id: string) {
  const response = await fetch(`/api/livreurs/${id}/approve`, {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error("Erreur lors de l'approbation du livreur")
  }
  return response.json()
}

export async function rejectLivreur(id: string) {
  const response = await fetch(`/api/livreurs/${id}/reject`, {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error("Erreur lors du rejet du livreur")
  }
  return response.json()
}

export async function deleteLivreur(id: string) {
  const response = await fetch(`/api/admin/livreurs/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du livreur")
  }
  return response.json()
}

export async function ajouterDette(id: string, montant: number) {
  const response = await fetch(`/api/livreurs/${id}/dette/ajouter?montant=${montant}`, {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout de la dette")
  }
  return response.json()
}

export async function payerDette(id: string, montant: number) {
  const response = await fetch(`/api/livreurs/${id}/dette/payer?montant=${montant}`, {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error("Erreur lors du paiement de la dette")
  }
  return response.json()
}

// Commandes
export async function getCommandes() {
  const response = await fetch("/api/commandes")
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des commandes")
  }
  return response.json()
}

export async function deleteCommande(id: string) {
  const response = await fetch(`/api/admin/commandes/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la commande")
  }
  return response.json()
}

// Paramètres
export async function getParametres() {
  const response = await fetch("/api/admin/parametres")
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des paramètres")
  }
  return response.json()
}

export async function updateParametres(parametres: {
  prixFixe: number
  prixParKm: number
  tauxCommission: number
}) {
  const response = await fetch("/api/admin/parametres", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametres),
  })
  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour des paramètres")
  }
  return response.json()
}

// Statistiques
export async function getStatistiques() {
  const response = await fetch("/api/admin/statistiques")
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des statistiques")
  }
  return response.json()
}
