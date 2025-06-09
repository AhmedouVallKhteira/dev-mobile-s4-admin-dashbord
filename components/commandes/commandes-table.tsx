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
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Commande {
  id: string
  from: string
  to: string
  statut: "en attente" | "livrée"
  livreur: string
}

export function CommandesTable() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCommandes()
  }, [])

  const fetchCommandes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/commandes")
      const data = await response.json()
      setCommandes(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCommande) return

    try {
      await fetch(`/api/admin/commandes/${selectedCommande.id}`, {
        method: "DELETE",
      })
      toast({
        title: "Succès",
        description: "Commande supprimée avec succès",
      })
      setDeleteDialogOpen(false)
      fetchCommandes()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des commandes...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>De</TableHead>
            <TableHead>À</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Livreur</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commandes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Aucune commande trouvée
              </TableCell>
            </TableRow>
          ) : (
            commandes.map((commande) => (
              <TableRow key={commande.id}>
                <TableCell className="font-medium">{commande.id}</TableCell>
                <TableCell>{commande.from}</TableCell>
                <TableCell>{commande.to}</TableCell>
                <TableCell>
                  <Badge variant={commande.statut === "livrée" ? "default" : "outline"}>
                    {commande.statut === "livrée" ? "Livrée" : "En attente"}
                  </Badge>
                </TableCell>
                <TableCell>{commande.livreur}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedCommande(commande)
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
              Cette action ne peut pas être annulée. Cela supprimera définitivement la commande
              {selectedCommande && ` ${selectedCommande.id}`} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
