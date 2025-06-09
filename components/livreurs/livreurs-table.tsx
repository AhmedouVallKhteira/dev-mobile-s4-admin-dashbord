"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Check, X, Trash2, CreditCard } from "lucide-react"
import { DetteModal } from "./dette-modal"
import { useToast } from "@/components/ui/use-toast"

interface Livreur {
  id: string
  nom: string
  telephone: string
  vehicule: string
  statut: "Approuvé" | "En attente"
  solde: number
}

export function LivreursTable() {
  const [livreurs, setLivreurs] = useState<Livreur[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLivreur, setSelectedLivreur] = useState<Livreur | null>(null)
  const [detteModalOpen, setDetteModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLivreurs()
  }, [])

  const fetchLivreurs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/livreurs")
      const data = await response.json()
      setLivreurs(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les livreurs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/livreurs/${id}/approve`, {
        method: "POST",
      })
      toast({
        title: "Succès",
        description: "Livreur approuvé avec succès",
      })
      fetchLivreurs()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le livreur",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/livreurs/${id}/reject`, {
        method: "POST",
      })
      toast({
        title: "Succès",
        description: "Livreur rejeté avec succès",
      })
      fetchLivreurs()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le livreur",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedLivreur) return

    try {
      await fetch(`/api/admin/livreurs/${selectedLivreur.id}`, {
        method: "DELETE",
      })
      toast({
        title: "Succès",
        description: "Livreur supprimé avec succès",
      })
      setDeleteDialogOpen(false)
      fetchLivreurs()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le livreur",
        variant: "destructive",
      })
    }
  }

  const openDetteModal = (livreur: Livreur) => {
    setSelectedLivreur(livreur)
    setDetteModalOpen(true)
  }

  const handleDetteUpdate = () => {
    fetchLivreurs()
    setDetteModalOpen(false)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des livreurs...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Solde</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {livreurs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Aucun livreur trouvé
              </TableCell>
            </TableRow>
          ) : (
            livreurs.map((livreur) => (
              <TableRow key={livreur.id}>
                <TableCell>{livreur.nom}</TableCell>
                <TableCell>{livreur.telephone}</TableCell>
                <TableCell>{livreur.vehicule}</TableCell>
                <TableCell>
                  <Badge variant={livreur.statut === "Approuvé" ? "default" : "outline"}>{livreur.statut}</Badge>
                </TableCell>
                <TableCell className={livreur.solde < 0 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                  {livreur.solde.toLocaleString()} FCFA
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {livreur.statut === "En attente" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(livreur.id)}>
                        <Check className="h-4 w-4 mr-1" /> Approuver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(livreur.id)}>
                        <X className="h-4 w-4 mr-1" /> Rejeter
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openDetteModal(livreur)}>
                    <CreditCard className="h-4 w-4 mr-1" /> Dettes
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedLivreur(livreur)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le livreur
              {selectedLivreur && ` ${selectedLivreur.nom}`} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedLivreur && (
        <DetteModal
          open={detteModalOpen}
          onOpenChange={setDetteModalOpen}
          livreur={selectedLivreur}
          onUpdate={handleDetteUpdate}
        />
      )}
    </div>
  )
}
