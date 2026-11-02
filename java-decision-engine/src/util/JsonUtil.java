package util;

/**
 * Lightweight JSON parser utility for zero-dependency HTTP microservices in Java.
 */
public class JsonUtil {

    public static String extractString(String json, String key, String defaultValue) {
        if (json == null || key == null) return defaultValue;
        String search = "\"" + key + "\"";
        int keyIndex = json.indexOf(search);
        if (keyIndex == -1) return defaultValue;

        int colonIndex = json.indexOf(":", keyIndex + search.length());
        if (colonIndex == -1) return defaultValue;

        int quoteStart = json.indexOf("\"", colonIndex + 1);
        if (quoteStart == -1) return defaultValue;

        int quoteEnd = json.indexOf("\"", quoteStart + 1);
        if (quoteEnd == -1) return defaultValue;

        return json.substring(quoteStart + 1, quoteEnd).trim();
    }

    public static int extractInt(String json, String key, int defaultValue) {
        double d = extractDouble(json, key, defaultValue);
        return (int) Math.round(d);
    }

    public static double extractDouble(String json, String key, double defaultValue) {
        if (json == null || key == null) return defaultValue;
        String search = "\"" + key + "\"";
        int keyIndex = json.indexOf(search);
        if (keyIndex == -1) return defaultValue;

        int colonIndex = json.indexOf(":", keyIndex + search.length());
        if (colonIndex == -1) return defaultValue;

        int start = colonIndex + 1;
        // Skip whitespace
        while (start < json.length() && Character.isWhitespace(json.charAt(start))) {
            start++;
        }

        // Find end of number (comma, closing brace, or whitespace)
        int end = start;
        while (end < json.length()) {
            char c = json.charAt(end);
            if (c == ',' || c == '}' || c == ']' || Character.isWhitespace(c)) {
                break;
            }
            end++;
        }

        try {
            return Double.parseDouble(json.substring(start, end).trim());
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
