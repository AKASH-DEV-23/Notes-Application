"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, X, FileText, Calendar, Clock, Loader2, Sparkles, Heart, Star } from "lucide-react"

interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface NoteEditorProps {
  note?: Note | null
  onSave: (note: Note) => void
  onCancel: () => void
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [saving, setSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const chars = content.length
    const reading = Math.ceil(words / 200)
    setWordCount(words)
    setCharCount(chars)
    setReadingTime(reading)
  }, [content])

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return

    setSaving(true)
    try {
      const url = note ? `http://localhost:8080/notes/${note.id}` : "http://localhost:8080/notes"
      const method = note ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim() || "Untitled",
          content: content.trim(),
        }),
      })

      if (response.ok) {
        const savedNote = await response.json()
        onSave(savedNote)
      }
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-md border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <CardHeader className="border-b border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {note ? "Edit Note" : "Create New Note"}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Sparkles className="w-3 h-3" />
                  <span>Let your creativity flow</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {note && (
                <div className="hidden md:flex items-center space-x-4 text-sm text-white/60">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDate(note.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Modified {formatTime(note.updated_at)}</span>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <Input
                placeholder="Give your note a beautiful title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
        w-full
        text-9xl font-bold
        bg-transparent
        border-0 border-b-2
        focus:border-b-purple-500
        outline-none
        text-white placeholder:text-white/40
        transition duration-300
      "
            />
            <Textarea
                placeholder="Start writing your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="
        w-full
        min-h-[400px]
        text-7xl
        bg-transparent
        border-0 border-b-2 border-b-white/20
        focus:border-b-purple-500
        outline-none
        text-white placeholder:text-white/40
        leading-relaxed
        resize-none
        transition duration-300
      "
            />
          </div>
        </CardContent>



        {/* Footer */}
        <div className="border-t border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30 px-3 py-1">
                <Heart className="w-3 h-3 mr-1" />
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-500/30 px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                {charCount} {charCount === 1 ? "character" : "characters"}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/30 px-3 py-1">
                <Clock className="w-3 h-3 mr-1" />
                {readingTime} min read
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-white/50">
                <div
                  className={`w-2 h-2 rounded-full ${saving ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}
                ></div>
                <span>{saving ? "Saving..." : "Ready to save"}</span>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || (!title.trim() && !content.trim())}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
