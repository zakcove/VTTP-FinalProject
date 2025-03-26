package vttp.project.snacked.dtos;

import java.util.List;

import vttp.project.snacked.models.Snack;

public class SnackResponse {
    private List<Snack> content;
    private long totalElements;
    private int totalPages;
    private int size;
    private int number;

    public SnackResponse(List<Snack> content, long totalElements, int totalPages, int size, int number) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.size = size;
        this.number = number;
    }

    public SnackResponse() {}

    public List<Snack> getContent() {
        return content;
    }

    public void setContent(List<Snack> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
} 