package com.josh.pros.BackEnd;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/notifications")
public class NotificationController {
    @GetMapping
    public String getNotifications() {
        return "Notifications data";
    }

}
