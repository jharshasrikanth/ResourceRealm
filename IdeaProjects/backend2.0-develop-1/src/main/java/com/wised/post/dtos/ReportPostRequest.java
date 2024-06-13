package com.wised.post.dtos;

import com.wised.people.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReportPostRequest {
    private Integer reportedPostId;
    private ReportReason reportReason;
    private String reportDescription;
}
