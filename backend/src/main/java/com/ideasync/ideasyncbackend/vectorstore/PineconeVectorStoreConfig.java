package com.ideasync.ideasyncbackend.vectorstore;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class PineconeVectorStoreConfig {

    @Value("${spring.ai.vectorstore.pinecone.apiKey}")
    private String apiKey;

    @Value("${spring.ai.vectorstore.pinecone.environment}")
    private String environment;

    @Value("${spring.ai.vectorstore.pinecone.projectId}")
    private String projectId;

    @Value("${spring.ai.vectorstore.pinecone.index-name}")
    private String indexName;

    @Bean
    public PineconeRestVectorStore vectorStore(RestClient.Builder restClientBuilder, EmbeddingModel embeddingModel) {
        String host = "%s-%s.svc.%s.pinecone.io".formatted(indexName, projectId, environment);
        return new PineconeRestVectorStore(restClientBuilder, embeddingModel, apiKey, host);
    }
}
