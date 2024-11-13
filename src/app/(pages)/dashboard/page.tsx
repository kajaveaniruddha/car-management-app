"use client"
import { useState } from 'react'
import { Menu, Plus, Car } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserDetails from "@/components/custom/user-details"
import AddCar from "@/components/custom/add-car"
import CarList from "@/components/custom/car-list"

export default function CarsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-64 flex-col bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Car Manager</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <UserDetails />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Car Manager</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <UserDetails />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="md:hidden mb-6">
            <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>

          <Tabs defaultValue="cars" className="space-y-6">
            <TabsList>
              <TabsTrigger value="cars">
                <Car className="h-4 w-4 mr-2" />
                Cars
              </TabsTrigger>
              <TabsTrigger value="add">
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Your Cars</h2>
              <CarList />
            </TabsContent>

            <TabsContent value="add" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Add a New Car</h2>
              <AddCar />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}