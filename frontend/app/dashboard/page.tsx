"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Grid3X3,
  List,
  UserIcon,
  LogOut,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Filter,
  Star,
  Heart,
  Bell,
  Settings,
  Bookmark,
} from "lucide-react"
import NoteEditor from "@/components/notes/note-editor"
import NoteSkeleton from "@/components/notes/note-skeleton"

interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface UserData {
  id: number
  name: string
  email: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showEditor, setShowEditor] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [favoriteNotes, setFavoriteNotes] = useState<Set<number>>(new Set())
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredNotes(filtered)
    } else {
      setFilteredNotes(notes)
    }
  }, [searchQuery, notes])

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        await fetchNotes()
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:8080/notes", {
        credentials: "include",
      })
      if (response.ok) {
        const notesData = await response.json()
        setNotes(notesData)
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId))
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  const handleNoteCreated = (newNote: Note) => {
    setNotes([newNote, ...notes])
    setShowEditor(false)
  }

  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
    setShowEditor(false)
    setEditingNote(null)
  }

  const toggleFavorite = (noteId: number) => {
    const newFavorites = new Set(favoriteNotes)
    if (newFavorites.has(noteId)) {
      newFavorites.delete(noteId)
    } else {
      newFavorites.add(noteId)
    }
    setFavoriteNotes(newFavorites)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown Date"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Unknown Date"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return "Unknown Time"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Unknown Time"
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-purple-800 to-pink-700",
      "from-blue-800 to-cyan-700",
      "from-green-800 to-emerald-700",
      "from-orange-800 to-red-700",
      "from-indigo-800 to-purple-700",
      "from-teal-800 to-blue-700",
    ]
    return gradients[index % gradients.length]
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-white/10 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="h-12 flex-1 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 w-32 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <NoteSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10 top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Notes Dashboard
                  </h1>
                  <p className="text-sm text-white/60">Welcome back, {user?.name?.split(" ")[0]}!</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border border-purple-500/60 px-3 py-1 shadow-sm hover:shadow-md transition"
                >
                  <Bookmark className="w-3 h-3 mr-1" />
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                </Badge>
                <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white border border-purple-500/60 px-3 py-1 shadow-sm hover:shadow-md transition"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  {favoriteNotes.size} favorites
                </Badge>
              </div>



            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                      variant="ghost"
                      className="
        flex items-center space-x-3
        text-white
        px-4 py-2
        rounded-xl
        transition-all duration-300
        hover:bg-white/10
        hover:backdrop-blur-sm
        hover:text-white
        focus:outline-none
        ring-0 focus:ring-0
        w-full md:w-auto
      "
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-purple-500/50">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-sm text-white">{user?.name}</p>
                      <p className="text-xs text-white/70">{user?.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="bg-black/80 backdrop-blur-md border border-white/20 w-56 rounded-xl shadow-lg"
                >
                  <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white transition">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white transition">
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400 transition"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>


            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 h-5 w-5 text-white/50" />
            <Input
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300 text-base"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 h-12 w-12"
            >
              <Filter className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 h-12 w-12"
            >
              {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>

            <Button
              onClick={() => setShowEditor(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 h-12 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Note
            </Button>
          </div>
        </div>

        {/* Enhanced Notes Display */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Edit3 className="w-16 h-16 text-white/30" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              {searchQuery ? "No notes found" : "Your creative space awaits"}
            </h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or create a new note"
                : "Start capturing your thoughts and ideas. Every great story begins with a single note."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowEditor(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Note
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredNotes.map((note, index) => (
              <Card
                key={note.id}
                className={`bg-gradient-to-br ${getRandomGradient(index)} backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  setEditingNote(note)
                  setShowEditor(true)
                }}
              >
                {/*<div className="absolute inset-0 bg-black/30"></div>*/}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-lg font-semibold line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                      {note.title || "Untitled"}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(note.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white/60 hover:text-pink-400 hover:bg-white/10 w-8 h-8"
                      >
                        <Heart
                          className={`h-4 w-4 ${favoriteNotes.has(note.id) ? "fill-current text-pink-400" : ""}`}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white/60 hover:text-white hover:bg-white/10 w-8 h-8"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/20">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingNote(note)
                              setShowEditor(true)
                            }}
                            className="text-white hover:bg-white/10 focus:bg-white/10"
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNote(note.id)
                            }}
                            className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-white/70 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {note.content || "No content"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center space-x-2">
                      {/*<Calendar className="w-3 h-3" />*/}
                      {/*<span>{formatDate(note.updated_at)}</span>*/}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/*<Clock className="w-3 h-3" />*/}
                      {/*<span>{formatTime(note.updated_at)}</span>*/}
                    </div>
                  </div>
                  {favoriteNotes.has(note.id) && (
                    <div className="mt-2 flex justify-end">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal Note Editor */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={editingNote ? handleNoteUpdated : handleNoteCreated}
          onCancel={() => {
            setShowEditor(false)
            setEditingNote(null)
          }}
        />
      )}
    </div>
  )
}
