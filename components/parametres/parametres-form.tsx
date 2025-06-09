"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Parametres {
  prixFixe: number
  prixParKm: number
  tauxCommission: number
}

export function ParametresForm() {
  const [parametres, setParametres] = useState<Parametres>({
    prixFixe: 0,
    prixParKm: 0,
    tauxCommission: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchParametres()
  }, [])

  const fetchParametres = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/parametres")
      const data = await response.json()
      setParametres(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Pour le taux de commission, convertir en décimal (0.1 pour 10%)
    if (name === "tauxCommission") {
      setParametres({
        ...parametres,
        [name]: Number.parseFloat(value) / 100,
      })
    } else {
      setParametres({
        ...parametres,
        [name]: Number.parseFloat(value),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      await fetch("/api/admin/parametres", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parametres),
      })
      toast({
        title: "Succès",
        description: "Paramètres mis à jour avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des paramètres...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de l'Application</CardTitle>
        <CardDescription>Configurez les paramètres de tarification et de commission</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prixFixe">Prix Fixe (FCFA)</Label>
            <Input
              id="prixFixe"
              name="prixFixe"
              type="number"
              value={parametres.prixFixe}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">Prix de base pour chaque livraison</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prixParKm">Prix par Kilomètre (FCFA)</Label>
            <Input
              id="prixParKm"
              name="prixParKm"
              type="number"
              value={parametres.prixParKm}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">Tarif additionnel par kilomètre parcouru</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tauxCommission">Taux de Commission (%)</Label>
            <Input
              id="tauxCommission"
              name="tauxCommission"
              type="number"
              value={parametres.tauxCommission * 100}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.1"
            />
            <p className="text-sm text-muted-foreground">Pourcentage prélevé sur chaque livraison</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
