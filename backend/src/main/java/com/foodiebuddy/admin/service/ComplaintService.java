package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.ComplaintDTO;
import com.foodiebuddy.admin.entity.Complaint;
import com.foodiebuddy.admin.entity.enums.ComplaintStatus;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public Page<ComplaintDTO> getAllComplaints(Pageable pageable) {
        return complaintRepository.findAll(pageable).map(this::toDTO);
    }

    public Page<ComplaintDTO> getByStatus(ComplaintStatus status, Pageable pageable) {
        return complaintRepository.findByStatus(status, pageable).map(this::toDTO);
    }

    @Transactional
    public ComplaintDTO updateStatus(String id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        complaint.setStatus(status);
        log.info("Complaint {} status updated to {}", id, status);
        return toDTO(complaintRepository.save(complaint));
    }

    private ComplaintDTO toDTO(Complaint c) {
        return ComplaintDTO.builder()
                .id(c.getId())
                .userId(c.getUser().getId())
                .userName(c.getUser().getName())
                .orderId(c.getOrder() != null ? c.getOrder().getId() : null)
                .description(c.getDescription())
                .status(c.getStatus().name())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
