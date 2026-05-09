# Socket.IO Scalability Optimization

## What changed

The realtime layer now persists hot campaign state with partial Mongo updates instead of replacing the full campaign document on every frequent match mutation.

The `SocketIO` client now buffers hot writes behind a single debounced flush path per campaign. Token movement, clone/delete operations, dice log writes, and common DM state mutations update the in-memory campaign immediately, emit the same socket events as before, and persist a partial patch shortly after.

The socket connection also now attempts to initialize a Redis-backed Socket.IO adapter when a Redis client is available and the adapter package is installed. This keeps the current room and event contract intact while preparing the service for multi-instance fanout.

## Why it changed

Before this rollout, active play could trigger full-document campaign writes many times in quick succession. That increases database load, write contention, and the chance of staleness when multiple users are interacting with the same match state.

By narrowing persistence to just the dirty realtime sections and coalescing repeated writes into one scheduled flush, we reduce write amplification while keeping the client experience immediate.

## Expected benefits

-   Fewer Mongo writes during token dragging and other rapid interactions
-   Smaller update payloads for the hottest realtime paths
-   Better headroom for multiple active campaigns at once on a single instance
-   Cleaner upgrade path to horizontal Socket.IO scaling with Redis
-   Basic runtime observability through in-process socket metrics and flush counters

## Known limits

The campaign is still stored as a single Mongo document, so very large match payloads still cost more than a fully split realtime model would.

The Redis adapter initialization is defensive: the code is ready for it, but the runtime still needs the dependency installed and Redis configured correctly in the deployment environment.

This rollout keeps local in-memory campaign cache per process. Redis now helps event fanout, but the database remains the source of truth and reconnects may still rebuild local cache from persistence.
