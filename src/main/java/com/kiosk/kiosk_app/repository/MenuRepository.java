package com.kiosk.kiosk_app.repository;

import com.kiosk.kiosk_app.domain.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}
