package com.ideasync.ideasyncbackend.vectorstore;

import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Talks to Pinecone's data-plane REST API directly instead of the gRPC client bundled in
 * spring-ai-pinecone-store, which predates Pinecone serverless indexes and fails to
 * authenticate against them (UNAUTHENTICATED over gRPC even with a valid, REST-verified key).
 */
public class PineconeRestVectorStore implements VectorStore {

    private static final String CONTENT_METADATA_KEY = "content";

    private final RestClient restClient;
    private final EmbeddingModel embeddingModel;

    public PineconeRestVectorStore(RestClient.Builder restClientBuilder, EmbeddingModel embeddingModel,
                                    String apiKey, String host) {
        this.embeddingModel = embeddingModel;
        this.restClient = restClientBuilder
                .baseUrl("https://" + host)
                .defaultHeader("Api-Key", apiKey)
                .defaultHeader("X-Pinecone-Api-Version", "2024-07")
                .build();
    }

    @Override
    public void add(List<Document> documents) {
        List<Map<String, Object>> vectors = new ArrayList<>();
        for (Document document : documents) {
            Map<String, Object> metadata = new HashMap<>(document.getMetadata());
            metadata.put(CONTENT_METADATA_KEY, document.getContent());

            Map<String, Object> vector = new HashMap<>();
            vector.put("id", document.getId());
            vector.put("values", embeddingModel.embed(document.getContent()));
            vector.put("metadata", metadata);
            vectors.add(vector);
        }

        restClient.post()
                .uri("/vectors/upsert")
                .body(Map.of("vectors", vectors))
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public Optional<Boolean> delete(List<String> idList) {
        restClient.post()
                .uri("/vectors/delete")
                .body(Map.of("ids", idList))
                .retrieve()
                .toBodilessEntity();
        return Optional.of(true);
    }

    @Override
    public List<Document> similaritySearch(SearchRequest request) {
        String query = request.getQuery() != null ? request.getQuery() : "";

        Map<String, Object> body = new HashMap<>();
        body.put("vector", embeddingModel.embed(query));
        body.put("topK", request.getTopK());
        body.put("includeMetadata", true);
        if (request.hasFilterExpression()) {
            body.put("filter", toPineconeFilter(request.getFilterExpression()));
        }

        Map<String, Object> response = restClient.post()
                .uri("/query")
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {
                });

        List<Document> documents = new ArrayList<>();
        if (response == null || !(response.get("matches") instanceof List<?> matches)) {
            return documents;
        }

        double threshold = request.getSimilarityThreshold();
        for (Object matchObj : matches) {
            Map<?, ?> match = (Map<?, ?>) matchObj;
            double score = match.get("score") instanceof Number n ? n.doubleValue() : 0.0;
            if (score < threshold) {
                continue;
            }

            String id = (String) match.get("id");
            Map<String, Object> metadata = match.get("metadata") instanceof Map<?, ?> m
                    ? new HashMap<>((Map<String, Object>) m)
                    : new HashMap<>();
            String content = (String) metadata.remove(CONTENT_METADATA_KEY);
            documents.add(new Document(id, content != null ? content : "", metadata));
        }
        return documents;
    }

    private Map<String, Object> toPineconeFilter(Filter.Expression expression) {
        return switch (expression.type()) {
            case EQ -> Map.of(key(expression.left()), Map.of("$eq", value(expression.right())));
            case NE -> Map.of(key(expression.left()), Map.of("$ne", value(expression.right())));
            case GT -> Map.of(key(expression.left()), Map.of("$gt", value(expression.right())));
            case GTE -> Map.of(key(expression.left()), Map.of("$gte", value(expression.right())));
            case LT -> Map.of(key(expression.left()), Map.of("$lt", value(expression.right())));
            case LTE -> Map.of(key(expression.left()), Map.of("$lte", value(expression.right())));
            case IN -> Map.of(key(expression.left()), Map.of("$in", value(expression.right())));
            case NIN -> Map.of(key(expression.left()), Map.of("$nin", value(expression.right())));
            case AND -> Map.of("$and", List.of(
                    toPineconeFilter((Filter.Expression) expression.left()),
                    toPineconeFilter((Filter.Expression) expression.right())));
            case OR -> Map.of("$or", List.of(
                    toPineconeFilter((Filter.Expression) expression.left()),
                    toPineconeFilter((Filter.Expression) expression.right())));
            default -> throw new UnsupportedOperationException(
                    "Unsupported Pinecone filter expression type: " + expression.type());
        };
    }

    private String key(Filter.Operand operand) {
        return ((Filter.Key) operand).key();
    }

    private Object value(Filter.Operand operand) {
        return ((Filter.Value) operand).value();
    }
}
