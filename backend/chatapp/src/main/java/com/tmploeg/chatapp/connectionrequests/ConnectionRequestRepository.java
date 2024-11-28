package com.tmploeg.chatapp.connectionrequests;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ConnectionRequestRepository
    extends JpaRepository<ConnectionRequest, UUID>, JpaSpecificationExecutor<ConnectionRequest> {}
