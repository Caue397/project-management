package dev.cauegallizzi.backend.util;

import java.text.Normalizer;

public class StringUtil {
    public static String slugify(String slug) {
        return Normalizer.normalize(slug, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("[\\s]+", "-");
    }
}
