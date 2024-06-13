package com.wised.bystream.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wised.auth.dtos.UserInterestResponse;
import com.wised.bystream.dtos.ContentDto;
import com.wised.bystream.service.ByStreamService;
import com.wised.post.model.Post;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/bystream")
public class ByStreamController {
    private final ByStreamService byStreamService;
    @GetMapping("/recommendation-new-user")
    public ResponseEntity<ContentDto> getRecommendationsForNewUser(
            @RequestParam String university,
            @RequestParam String stream,
            @RequestParam Integer sem) {
        ContentDto recommendations = byStreamService.getRecommendationsForNewUser(university, stream, sem);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendation-existing-user")
    public ResponseEntity<ContentDto> getRecommendationsForExistingUser(
            @RequestParam String university,
            @RequestParam String stream,
            @RequestParam Integer sem) {
        ContentDto recommendations = byStreamService.getRecommendationsForExistingUser(university, stream, sem);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Post>> getNotesByUniversity(
            @RequestParam String university,
            @RequestParam String stream,
            @RequestParam Integer semester) {
        List<Post> notes = byStreamService.getNotesByUniversity(university, stream, semester);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/question-papers")
    public ResponseEntity<Map<String, List<Post>>> getQuestionPapersByUniversity(
            @RequestParam String university,
            @RequestParam String stream,
            @RequestParam Integer semester) {

        Map<String, List<Post>> questionPapers = byStreamService.getQuestionPapersByUniversity(university, stream, semester);
        return ResponseEntity.ok(questionPapers);
    }


    @GetMapping("/write-ups")
    public ResponseEntity<List<Post>> getWriteUpsByUniversity(
            @RequestParam String university,
            @RequestParam String stream,
            @RequestParam Integer semester) {
        List<Post> writeUps = byStreamService.getWriteUpsByUniversity(university, stream, semester);
        return ResponseEntity.ok(writeUps);
    }

    @GetMapping("/exam/write-ups")
    public ResponseEntity<Map<String, List<Post>>> getWriteUpsByExam(
            @RequestParam String stream) {
        Map<String, List<Post>> writeUps = byStreamService.getWriteUpsByExam(stream);
        return ResponseEntity.ok(writeUps);
    }

    @GetMapping("/exam/question-papers")
    public ResponseEntity<Map<String, List<Post>>> getQuestionPapersByExam(
            @RequestParam String stream) {
        Map<String, List<Post>> questionPapers = byStreamService.getQuestionPapersByExam(stream);
        return ResponseEntity.ok(questionPapers);
    }

    @GetMapping("/exam/up-to-date-contents")
    public ResponseEntity<List<Post>> getUpToDateContentsByExam(
            @RequestParam String stream) {
        List<Post> upToDateContents = byStreamService.getUpToDateContentsByExam(stream);
        return ResponseEntity.ok(upToDateContents);
    }

    @GetMapping("/exam/notes")
    public ResponseEntity<List<Post>> getNotesByExam(
            @RequestParam String stream) {
        List<Post> notes = byStreamService.getNotesByExam(stream);
        return ResponseEntity.ok(notes);
    }
}
