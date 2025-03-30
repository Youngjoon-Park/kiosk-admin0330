package com.kiosk.kiosk_app.controller;

import com.kiosk.kiosk_app.domain.Menu;
import com.kiosk.kiosk_app.repository.MenuRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/menu")
public class MenuController {

    private final MenuRepository menuRepository;

    public MenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @PostMapping
    public Menu create(@RequestBody Menu menu) {
        return menuRepository.save(menu);
    }

    @GetMapping
    public List<Menu> list() {
        return menuRepository.findAll();
    }
}
