package com.wised.helpandsettings.dtos;

import com.wised.helpandsettings.enums.ReasonEnum;
import com.wised.helpandsettings.model.Reason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@Builder
@AllArgsConstructor
public class DeactivateOrDeleteRequest {

    @NotNull
    private ReasonEnum reasonEnum;
    private String description;
    @NotNull
    private String Password;

}
