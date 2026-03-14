package com.topsinoty.reservationSystem.dto;

public record ApiResult<T>(boolean success, String message, T data) {

    public static <T> ApiResult<T> success(String message, T data) {
        return new ApiResult<>(true, message, data);
    }

    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>(true, "Success", data);
    }

    public static <T> ApiResult<T> failure(String message) {
        return new ApiResult<>(false, message, null);
    }
}

