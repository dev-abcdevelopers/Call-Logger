import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Phone, MessageSquare } from "lucide-react"
import { favoriteContacts, allContacts } from "@/data/contacts-data"

export default function ContactsView() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Input
          placeholder="Search contacts..."
          className="pl-10 bg-white dark:bg-gray-900 border-none shadow-md rounded-xl"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Favorites */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Favorites</h2>
          <Button variant="ghost" className="text-sm text-purple-600 dark:text-purple-400">
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {favoriteContacts.map((contact, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-center font-medium text-gray-800 dark:text-gray-200">
                {contact.name.split(" ")[0]}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 mb-2 rounded-full border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent"
            >
              <Plus className="h-6 w-6 text-gray-400" />
            </Button>
            <span className="text-xs text-center font-medium text-gray-500 dark:text-gray-400">Add</span>
          </div>
        </div>
      </div>

      {/* All Contacts */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">All Contacts</h2>
          <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400">
            <Plus className="h-4 w-4 mr-1" /> Add New
          </Button>
        </div>

        <div className="space-y-2">
          {allContacts.map((contact, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{contact.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{contact.phone}</p>
                  </div>
                  <div className="flex">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
