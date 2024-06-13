package com.wised.people.dtos;


import com.wised.people.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReportRequest {

    private String reportedUserName;
    private ReportReason reportReason;
    private String reportDescription;

}
