package com.kiosk.kiosk_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로
                .allowedOrigins("http://localhost:3000") // 프론트엔드 주소 허용
                .allowedMethods("*") // GET, POST 등 모든 메서드 허용
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키 포함 허용 시 필요
    }
}
