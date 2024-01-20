package com.rathnas.YtSkip.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("ytskip")
public class ClickMeController {
    @GetMapping("/click/{x}/{y}")
    public Integer clickMe(@PathVariable("x") Integer x, @PathVariable("y") Integer y) {
        log.info("x: " + x + ", y: " + y);
        Integer retInt = executeCommand("xdotool mousemove " + x + " " + y + " click 1 &");
        if (retInt != 0) {
            log.info("Retrying with Robot");
            try {
                System.setProperty("java.awt.headless", "false");
                Robot robot = new Robot();
                robot.mouseMove(x, y);
                robot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
                robot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
                Thread.sleep(500);
                robot.keyPress(KeyEvent.VK_SPACE);
                robot.keyRelease(KeyEvent.VK_SPACE);
                Thread.sleep(500);
                robot.keyPress(KeyEvent.VK_F);
                robot.keyRelease(KeyEvent.VK_F);
                return 0;
            } catch (AWTException | InterruptedException e) {
                log.error("Exception while executing command: " + e.getMessage(), e);
            }
        }
        return retInt;
    }

    public static Integer executeCommand(String command) {
        try {
            log.info("Executing command: " + command);
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                log.info(line);
            }
            int exitCode = process.waitFor();
            log.info("Command exited with code: " + exitCode);
            return exitCode;
        } catch (IOException | InterruptedException e) {
            log.error("Exception while executing command: " + command, e);
            return -1;
        }
    }
}
