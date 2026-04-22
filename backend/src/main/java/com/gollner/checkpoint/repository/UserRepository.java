package com.gollner.checkpoint.repository;

import com.gollner.checkpoint.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
