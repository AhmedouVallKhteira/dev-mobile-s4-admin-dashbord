"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LivreursTable } from "@/components/livreurs/livreurs-table"
import { CommandesTable } from "@/components/commandes/commandes-table"
import { ParametresForm } from "@/components/parametres/parametres-form"
import { StatsCards } from "@/components/statistiques/stats-cards"
import { Toaster } from "@/components/ui/toaster"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("livreurs")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administrateur</h1>

      <Tabs defaultValue="livreurs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="livreurs">Livreurs</TabsTrigger>
          <TabsTrigger value="commandes">Commandes</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="livreurs" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Gestion des Livreurs</h2>
          <LivreursTable />
        </TabsContent>

        <TabsContent value="commandes" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Gestion des Commandes</h2>
          <CommandesTable />
        </TabsContent>

        <TabsContent value="parametres" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Paramètres de l'Application</h2>
          <ParametresForm />
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Statistiques</h2>
          <StatsCards />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
