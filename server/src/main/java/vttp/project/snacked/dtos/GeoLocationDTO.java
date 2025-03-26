package vttp.project.snacked.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GeoLocationDTO {
    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Accuracy is required")
    private Double accuracy;

    @NotBlank(message = "Location name is required")
    private String locationName;

    @NotNull(message = "Location privacy setting is required")
    private Boolean isPublic;

    public GeoLocationDTO(Double latitude, Double longitude, Double accuracy, String locationName, Boolean isPublic) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.locationName = locationName;
        this.isPublic = isPublic;
    }

    public GeoLocationDTO() {}

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
} 