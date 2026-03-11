package com.topsinoty.reservationSystem.config;

import com.topsinoty.reservationSystem.dto.ApiResult;
import com.topsinoty.reservationSystem.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalApiExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResult<Void>> handleNotFound(ApiException ex) {
        return ResponseEntity
                .status(ex.status())
                .body(ApiResult.failure(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResult<Void>> handleGeneric(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResult.failure("Internal server error"));
    }
}
