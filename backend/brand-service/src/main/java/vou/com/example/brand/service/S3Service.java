//package vou.com.example.brand.service;
//
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.net.URL;
//import java.util.Date;
//import java.util.UUID;
//
//@Service
//public class S3Service {
//    private final AmazonS3 s3Client;
//
//    @Value("${aws.bucketName}")
//    private String bucketName;
//
//    public S3Service(AmazonS3 s3Client) {
//        this.s3Client = s3Client;
//    }
//
//    public String generateUploadURL() {
//        String imageName = UUID.randomUUID().toString().replace("-", "");
//
//        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, imageName)
//                .withMethod(com.amazonaws.HttpMethod.PUT)
//                .withExpiration(new Date(System.currentTimeMillis() + 60 * 1000)); // URL expires in 60 seconds
//
//        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
//        return url.toString();
//    }
//}
