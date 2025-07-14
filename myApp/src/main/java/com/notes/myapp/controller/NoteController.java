package com.notes.myapp.controller;


import com.notes.myapp.model.Note;
import com.notes.myapp.model.User;
import com.notes.myapp.repository.NoteRepository;
import com.notes.myapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Note createNote(@RequestBody Note note, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        note.setUser(user);
        return noteRepository.save(note);
    }

    @GetMapping
    public List<Note> getNotes(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return noteRepository.findByUserId(user.getId());
    }

    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Long id, Authentication auth) {
        Note note = noteRepository.findById(id).orElseThrow();
        if (!note.getUser().getEmail().equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized!");
        }
        noteRepository.delete(note);
        return "Deleted!";
    }
    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note updatedNote, Authentication auth) {
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existingNote.getUser().getEmail().equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized!");
        }

        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());

        return noteRepository.save(existingNote);
    }

}
