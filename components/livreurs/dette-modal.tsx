"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface Livreur {
  id: string
  nom: string
  solde: number
}

interface DetteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  livreur: Livreur
  onUpdate: () => void
}

export function DetteModal({ open, onOpenChange, livreur, onUpdate }: DetteModalProps) {
  const [montant, setMontant] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAjouterDette = async () => {
    if (!montant || isNaN(Number(montant)) || Number(montant) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await fetch(`/api/livreurs/${livreur.id}/dette/ajouter?montant=${montant}`, {
        method: "POST",
      })
      toast({
        title: "Succès",
        description: `Dette de ${Number(montant).toLocaleString()} FCFA ajoutée`,
      })
      setMontant("")
      onUpdate()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la dette",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePayerDette = async () => {
    if (!montant || isNaN(Number(montant)) || Number(montant) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await fetch(`/api/livreurs/${livreur.id}/dette/payer?montant=${montant}`, {
        method: "POST",
      })
      toast({
        title: "Succès",
        description: `Paiement de ${Number(montant).toLocaleString()} FCFA enregistré`,
      })
      setMontant("")
      onUpdate()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestion des dettes - {livreur.nom}</DialogTitle>
          <DialogDescription>
            Solde actuel:{" "}
            <span className={livreur.solde < 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
              {livreur.solde.toLocaleString()} FCFA
            </span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ajouter" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="ajouter">Ajouter Dette</TabsTrigger>
            <TabsTrigger value="payer">Enregistrer Paiement</TabsTrigger>
          </TabsList>

          <TabsContent value="ajouter" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="montant-dette">Montant de la dette (FCFA)</Label>
              <Input
                id="montant-dette"
                type="number"
                placeholder="Ex: 5000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Ajoutez une dette (ex: commission à payer)</p>
            </div>
            <DialogFooter>
              <Button onClick={handleAjouterDette} disabled={loading}>
                {loading ? "Traitement..." : "Ajouter Dette"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="payer" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="montant-paiement">Montant du paiement (FCFA)</Label>
              <Input
                id="montant-paiement"
                type="number"
                placeholder="Ex: 3000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Enregistrez un paiement pour réduire la dette</p>
            </div>
            <DialogFooter>
              <Button onClick={handlePayerDette} disabled={loading}>
                {loading ? "Traitement..." : "Enregistrer Paiement"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
