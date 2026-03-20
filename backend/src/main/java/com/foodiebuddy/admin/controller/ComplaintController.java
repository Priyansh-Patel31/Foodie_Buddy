package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.dto.ComplaintDTO;
import com.foodiebuddy.admin.entity.enums.ComplaintStatus;
import com.foodiebuddy.admin.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaint Management", description = "Complaint Management APIs")
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    @Operation(summary = "List complaints")
    public ResponseEntity<ApiResponse<Page<ComplaintDTO>>> getAll(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ComplaintDTO> result;
        if (status != null && !status.isBlank()) {
            result = complaintService.getByStatus(ComplaintStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            result = complaintService.getAllComplaints(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update complaint status")
    public ResponseEntity<ApiResponse<ComplaintDTO>> updateStatus(
            @PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Complaint updated",
                complaintService.updateStatus(id, ComplaintStatus.valueOf(status.toUpperCase()))));
    }
}
