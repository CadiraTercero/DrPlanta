# API Contract: Plant Species Search

**Endpoint**: `GET /api/v1/plant-species/search`
**Authentication**: Not Required (Public endpoint)
**Purpose**: Search for plant species to link with user plants during creation/editing

## Request

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` or `query` | string | Yes | Search term (minimum 2 characters) |
| `limit` | integer | No | Maximum results to return (default: 10, max: 50) |

### Example Requests

```
GET /api/v1/plant-species/search?q=mons
GET /api/v1/plant-species/search?query=monstera&limit=5
GET /api/v1/plant-species/search?q=DELICIOSA
```

## Search Behavior

### Case Insensitivity
- Search MUST be case-insensitive
- "monstera", "MONSTERA", "Monstera" should all return the same results

### Partial Matching
- Search MUST support partial matches at the beginning or anywhere in the field
- "mons" should match "Monstera deliciosa"
- "deliciosa" should match "Monstera deliciosa"

### Multi-Field Search
- Search MUST search in BOTH fields simultaneously:
  - `commonName` - Common name in English (e.g., "Monstera", "Snake Plant")
  - `latinName` - Scientific/Latin name (e.g., "Monstera deliciosa", "Sansevieria trifasciata")

### Ordering
- Results SHOULD be ordered by relevance:
  1. Exact matches (case-insensitive) in commonName
  2. Starts-with matches in commonName
  3. Contains matches in commonName
  4. Exact matches in latinName
  5. Starts-with matches in latinName
  6. Contains matches in latinName

## Response

### Success Response (200 OK)

```json
{
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "commonName": "Monstera",
      "latinName": "Monstera deliciosa",
      "shortDescription": "Popular tropical plant with distinctive split leaves",
      "lightPreference": "MEDIUM",
      "waterPreference": "MEDIUM",
      "humidityPreference": "HIGH",
      "toxicity": "TOXIC_PETS_AND_HUMANS",
      "difficulty": "EASY",
      "recommendedIndoor": true,
      "tags": ["tropical", "climbing", "large-leaves"]
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "commonName": "Swiss Cheese Plant",
      "latinName": "Monstera adansonii",
      "shortDescription": "Compact monstera with smaller, more numerous holes",
      "lightPreference": "MEDIUM",
      "waterPreference": "MEDIUM",
      "humidityPreference": "MEDIUM",
      "toxicity": "TOXIC_PETS_AND_HUMANS",
      "difficulty": "EASY",
      "recommendedIndoor": true,
      "tags": ["tropical", "climbing", "compact"]
    }
  ],
  "count": 2,
  "query": "mons"
}
```

### No Results Response (200 OK)

```json
{
  "results": [],
  "count": 0,
  "query": "zyxwvutsrq"
}
```

### Validation Errors (400 Bad Request)

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Query parameter 'q' or 'query' is required"
}
```

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Query must be at least 2 characters long"
}
```

### ~Authentication Error (401 Unauthorized)~ REMOVED

**Note**: Authentication is no longer required for this endpoint. The endpoint is now public to allow users to search for plant species before creating an account or when adding plants.

## Implementation Notes

### Database Query Pattern (PostgreSQL/TypeORM)

```typescript
// Case-insensitive, partial match, multi-field search
const results = await plantSpeciesRepository
  .createQueryBuilder('species')
  .where(
    'LOWER(species.commonName) LIKE LOWER(:searchTerm) OR LOWER(species.latinName) LIKE LOWER(:searchTerm)',
    { searchTerm: `%${query}%` }
  )
  .orderBy('species.commonName', 'ASC')
  .limit(limit)
  .getMany();
```

### Performance Considerations

1. **Indexes**: Create database indexes on `commonName` and `latinName` columns for fast lookups
2. **Query Optimization**: Use LIKE with leading wildcard carefully (may not use index efficiently)
3. **Caching**: Consider caching common searches (optional for MVP)
4. **Rate Limiting**: Apply rate limiting to prevent abuse (optional for MVP)

### Future Enhancements (Post-MVP)

- Full-text search with ranking/scoring
- Fuzzy matching for typos
- Search history/autocomplete suggestions
- Filter by difficulty, light preference, toxicity
- Pagination for large result sets

## Testing Scenarios

### Functional Tests

1. Search with exact commonName match: `q=Monstera` → Returns Monstera species
2. Search with exact latinName match: `q=Monstera deliciosa` → Returns Monstera deliciosa
3. Search with partial match: `q=mons` → Returns all species with "mons" in commonName or latinName
4. Search case-insensitive: `q=MONSTERA` → Same results as `q=monstera`
5. Search with no results: `q=invalidplantname` → Returns empty array
6. Search with special characters: `q=d'or` → Handles quotes/special chars safely
7. Search with very short query: `q=m` → Returns validation error (< 2 chars)
8. ~~Search without authentication: → Returns 401 error~~ (Authentication no longer required)
9. Search with limit parameter: `q=plant&limit=3` → Returns max 3 results
10. Search with mixed case in multi-word query: `q=Swiss CHEESE` → Returns "Swiss Cheese Plant"

### Edge Cases

- Empty string query: `q=` → Validation error
- Whitespace-only query: `q=   ` → Validation error or trim and validate
- Very long query (>100 chars): Should work but may not match anything
- Query with SQL injection attempt: `q='; DROP TABLE plant_species; --` → Safely handled by parameterized queries
- Multiple simultaneous requests from same user: Should all succeed independently

## Success Criteria

- Search responds within 200ms for queries on database of up to 1000 species
- Search returns relevant results for 95% of common plant name queries
- No false positives (irrelevant results) for exact matches
- Search handles all edge cases gracefully without errors
