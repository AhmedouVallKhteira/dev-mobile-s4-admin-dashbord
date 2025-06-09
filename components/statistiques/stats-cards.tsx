"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, DollarSign, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Statistiques {
  totalLivreurs: number
  totalCommandes: number
  commissionTotale: number
  dettesTotales: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Statistiques>({
    totalLivreurs: 0,
    totalCommandes: 0,
    commissionTotale: 0,
    dettesTotales: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/statistiques")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des statistiques...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Livreurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLivreurs}</div>
          <p className="text-xs text-muted-foreground">Livreurs enregistrés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCommandes}</div>
          <p className="text-xs text-muted-foreground">Commandes traitées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commission Totale</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.commissionTotale.toLocaleString()} FCFA</div>
          <p className="text-xs text-muted-foreground">Revenus générés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dettes Totales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.dettesTotales.toLocaleString()} FCFA</div>
          <p className="text-xs text-muted-foreground">Montant à recouvrer</p>
        </CardContent>
      </Card>
    </div>
  )
}
