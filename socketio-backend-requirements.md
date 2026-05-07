# Socket.IO Backend Requirements For TableRise Match

## Goal

This document is the frontend "order sheet" for the backend Socket.IO layer.

The objective is to make TableRise playable in real time between different computers, with one shared campaign/match state instead of each browser keeping its own local version.

The frontend already has most of the UI and REST flows. What we need from the backend is:

1. a real-time campaign room connection
2. an authoritative shared match state
3. broadcast events after important mutations
4. a few new real-time-only interactions for live match behavior

The frontend can continue using REST for persistence where it already exists, as long as the backend also emits Socket.IO events after successful writes.

---

## Recommended Connection Contract

### Namespace / room model

-   Use one Socket.IO namespace for campaign gameplay, for example: `/campaigns`
-   Each connected client joins one room per campaign: `campaign:{campaignId}`
-   Optional extra room if useful: `match:{campaignId}`

### Authentication

-   Reuse the current authenticated session/cookie flow if possible
-   On connection, backend must identify:
    -   `userId`
    -   `campaignId`
    -   `role` (`dungeon_master`, `player`, `admin_player`, etc.)

### Minimum handshake response

After the client joins the room, backend should send one canonical snapshot event so a late-joining client can hydrate the current live state immediately.

Suggested event:

-   `campaign:sync`

Suggested payload:

```json
{
    "campaignId": "string",
    "serverTime": "ISO date",
    "presence": {
        "connectedUsers": [],
        "confirmedPlayers": []
    },
    "match": {
        "activeMap": "string | null",
        "gridVisible": true,
        "activeEffect": "dark | light | rain | null",
        "playingMusicId": "string | null",
        "visibleCharacterIds": [],
        "tokens": [],
        "highlightedJournalPost": null
    }
}
```

### Delivery expectations

-   All mutation events should return an ack with success or failure
-   After a successful mutation, backend should broadcast the canonical updated state or a specific update event to the room
-   Include `updatedBy`, `updatedAt`, and stable ids when possible
-   Backend should be authoritative for shared match state

---

## Required Real-Time Features

## 1. Room Presence And Match Presence

### Why

Players need to know who is online and who confirmed presence for the session.

### Current frontend behavior

-   Lobby already uses REST for `confirmPlayerPresence`
-   Match page determines role from campaign data

### Backend needs

-   Emit when a user connects/disconnects from the campaign room
-   Emit when a player confirms or cancels match presence

### Suggested events

-   `presence:user_joined`
-   `presence:user_left`
-   `presence:confirmed_players_updated`

### Existing REST source

-   `POST /campaigns/{campaignId}/update/match/player-presence`

---

## 2. Shared Match View State

This is the minimum state all players must see consistently during a live session.

### 2.1 Active map

### Why

When the DM changes the current map in the media modal, everyone must see the same map.

### Current frontend behavior

-   `MatchMediaModal` lets the DM choose a map
-   This is local state today

### Backend needs

-   Store the current active map for the match
-   Broadcast when the active map changes

### Suggested event

-   `match:map_changed`

### Suggested payload

```json
{
    "campaignId": "string",
    "activeMap": "https://..."
}
```

### 2.2 Grid visibility

### Why

Grid toggle must stay consistent for all users.

### Current frontend behavior

-   `gridVisible` is local in the match page

### Backend needs

-   Store current grid visibility
-   Broadcast toggle changes

### Suggested event

-   `match:grid_changed`

### 2.3 Active visual effect

### Why

Fog/light/rain effects are scene-wide and should match for everyone.

### Current frontend behavior

-   `activeEffect` is local in the match page

### Backend needs

-   Store current effect
-   Broadcast changes

### Suggested event

-   `match:effect_changed`

### Payload

```json
{
    "activeEffect": "dark"
}
```

### 2.4 Active music playback

### Why

If the DM starts/stops a track, all connected users should receive the same playback command.

### Current frontend behavior

-   `playingMusicId` is local
-   Track ids already exist in campaign music data

### Backend needs

-   Store current playing music id or `null`
-   Broadcast play/pause changes

### Suggested event

-   `match:music_changed`

### Payload

```json
{
    "playingMusicId": "youtubeVideoId | null"
}
```

---

## 3. Shared Map Tokens

This is the most important real-time requirement for an online RPG battle map.

### 3.1 Visible base characters on the map

### Why

If the DM shows/hides avatars through avatar selection, all players must see the same visible token set.

### Current frontend behavior

-   `visibleMapCharacterIds` is local
-   Avatar selection modal already exists

### Backend needs

-   Store visible base character ids
-   Broadcast visibility changes

### Suggested event

-   `match:visible_characters_changed`

### Payload

```json
{
    "visibleCharacterIds": ["characterId1", "characterId2"]
}
```

### 3.2 Token position and size

### Why

Dragging/resizing tokens is core battle-map gameplay. All connected clients must see the same movement.

### Current frontend behavior

-   Token layout is currently tracked as local `mapTokenLayoutById`
-   Drag and resize are client-side only today

### Backend needs

-   Store token layout per token id
-   Broadcast drag/resize updates
-   Prefer throttled updates while dragging and one final authoritative commit on pointer end

### Suggested events

-   `token:updated`
-   `token:batch_updated`

### Suggested payload

```json
{
    "tokenId": "string",
    "characterId": "string",
    "xPct": 12.4,
    "yPct": 48.1,
    "widthPct": 6.2,
    "isClone": false,
    "updatedBy": "userId"
}
```

### 3.3 Clone tokens

### Why

The frontend now supports avatar duplication. For multiplayer play, clones must be shared, not browser-local.

### Current frontend behavior

-   Clone mode exists
-   Clones currently live only in frontend state

### Backend needs

-   Introduce shared token instance ids for clones
-   Support create/update/delete for clone tokens
-   Include clone tokens in initial `campaign:sync`

### Suggested events

-   `token:clone_created`
-   `token:deleted`
-   `token:updated`

### Suggested payload for clone creation

```json
{
    "tokenId": "clone:...",
    "characterId": "string",
    "isClone": true,
    "xPct": 20,
    "yPct": 55,
    "widthPct": 4.5,
    "createdBy": "userId"
}
```

### Important note

For the final multiplayer result, the backend should treat base tokens and clone tokens as one unified shared token collection.

---

## 4. Dice Rolls

### Why

Dice outcomes must be visible to all players or at least broadcast as shared results. A solo local roll breaks trust in online play.

### Current frontend behavior

-   Match page uses `@3d-dice/dice-box-threejs`
-   Rolls are rendered locally
-   Result overlay is local

### Backend needs

At minimum:

-   receive roll intent
-   broadcast roll result to room
-   identify roller
-   preserve notation and individual die results

Optional stronger version:

-   backend generates the authoritative result
-   frontend only renders what backend approves

### Suggested events

-   `dice:roll_requested`
-   `dice:roll_resolved`

### Suggested payload

```json
{
    "rollId": "uuid",
    "campaignId": "string",
    "userId": "string",
    "characterId": "string | null",
    "notation": "2d6",
    "label": "2D6",
    "rolls": [4, 2],
    "total": 6,
    "visibility": "room"
}
```

### Frontend expectation

If deterministic physics sync is too expensive, semantic sync is enough for v1:

-   all clients receive the same notation/result
-   each client renders its own local 3D animation or a simplified result overlay

---

## 5. Character Data Updates

### Why

Character sheets can be edited in `CharacterDetailModal`, and token summaries display HP and level. Other connected clients need fresh data after edits.

### Current frontend behavior

-   Character details are fetched by REST
-   Character edits use:
    -   `PUT /characters/{characterId}/update`
-   Token summary depends on character HP and level

### Backend needs

-   After a character update, emit a room event so all open match/lobby clients can refresh or patch local character data

### Suggested events

-   `character:updated`
-   optional `character:summary_updated`

### Suggested payload

```json
{
    "characterId": "string",
    "campaignId": "string",
    "updatedFields": ["stats.hitPoints", "profile.level"],
    "summary": {
        "currentHitPoints": 23,
        "level": 5
    }
}
```

### Recommendation

For performance, a summary payload is enough for token bars/cards, but full detail refresh support is still useful when a sheet modal is open.

---

## 6. Journal Realtime

### 6.1 Highlighted journal post

### Why

The DM can now highlight one journal post for all players. That should update instantly.

### Current frontend behavior

-   Top-right DM bookmark selects highlighted post
-   Bottom-left bookmark opens highlighted post for everyone
-   Current REST endpoints:
    -   `GET /campaigns/{campaignId}/journal/highlight`
    -   `PATCH /campaigns/{campaignId}/journal/highlight`

### Backend needs

-   Broadcast current highlight whenever it changes
-   Include current highlighted post in initial sync

### Suggested event

-   `journal:highlight_changed`

### Payload

```json
{
    "highlightedJournalPost": {
        "title": "string",
        "content": "string",
        "author": "string",
        "timestamp": "ISO date",
        "category": "string"
    }
}
```

### 6.2 New journal post created

### Why

If a post is created in the lobby by the DM/admin, the rest of the connected users should see the journal list update without refresh.

### Current frontend behavior

-   Lobby creates posts by REST
-   Journal list is fetched by REST

### Backend needs

-   Emit when a new journal post is created

### Suggested event

-   `journal:post_created`

---

## 7. Lobby Realtime That Supports Match Readiness

These are not battle-map actions, but they matter for a playable online campaign flow.

### 7.1 Confirmed players list

-   Broadcast after `confirmPlayerPresence`
-   Update lobby confirmation cards for everyone

### 7.2 Campaign roster changes

-   player joined campaign
-   player left campaign
-   DM role transferred

Suggested events:

-   `campaign:player_joined`
-   `campaign:player_left`
-   `campaign:dungeon_master_transferred`

### 7.3 Campaign media/settings changes

If the DM edits campaign maps, music list, next session, or similar settings, lobby and match clients should eventually update live.

Suggested events:

-   `campaign:maps_updated`
-   `campaign:musics_updated`
-   `campaign:settings_updated`

This is medium priority compared to token sync and match sync.

---

## 8. Recommended Shared Match State Shape

To keep frontend integration simple, the backend should have one canonical match state object, even if it is persisted across several collections/tables internally.

Suggested shape:

```json
{
    "campaignId": "string",
    "activeMap": "string | null",
    "gridVisible": true,
    "activeEffect": "dark | light | rain | null",
    "playingMusicId": "string | null",
    "visibleCharacterIds": [],
    "tokens": [
        {
            "tokenId": "base:characterId",
            "characterId": "characterId",
            "isClone": false,
            "xPct": 14.2,
            "yPct": 52.4,
            "widthPct": 5.5
        }
    ],
    "highlightedJournalPost": null
}
```

This snapshot should be available:

-   on room join
-   on reconnect
-   optionally by a REST endpoint too

---

## 9. Priority Order

If backend needs an implementation order, this is the frontend priority:

### P0 - Required for real playable match

-   room join/auth/sync
-   online presence
-   shared active map
-   shared grid state
-   shared map effect
-   shared visible characters
-   shared token position/resize
-   shared clone tokens
-   shared dice result broadcast
-   shared highlighted journal post
-   character summary updates after edits

### P1 - Strongly recommended

-   shared music play/pause
-   live lobby presence confirmation
-   journal post creation broadcast
-   campaign roster updates

### P2 - Nice to have later

-   typing/preview states
-   deterministic shared dice animation seeds
-   cursor presence on map
-   fog-of-war / drawing tools if added later

---

## 10. Frontend Features That Do Not Need Room-Wide Socket Sync Right Now

These can remain local or REST-only for now:

-   private campaign notes in `MatchNotesModal`
-   local open/close state of modals
-   local tab state inside modals
-   local dice tray/picker UI state before roll submission
-   local character sheet editing form state before save

---

## 11. What Backend Should Confirm Back To Frontend

When backend reviews this file, the frontend needs answers for these items:

1. Which namespace and room naming convention will be used?
2. Will backend broadcast after REST writes, or should frontend migrate writes to socket emits?
3. What will be the canonical match-state storage shape?
4. Will dice totals be backend-authoritative or frontend-generated then relayed?
5. How will clone tokens be persisted/shared?
6. Will character updates emit full objects, summaries, or both?
7. What auth/session strategy will Socket.IO use?
8. Is there already an event versioning or message envelope standard we should follow?

---

## 12. Final Backend Checklist

-   [ ] Real-time campaign room connection
-   [ ] Authenticated room join by campaign id
-   [ ] Initial canonical campaign/match sync event
-   [ ] Online presence events
-   [ ] Confirmed player presence broadcast
-   [ ] Shared active map state
-   [ ] Shared grid toggle state
-   [ ] Shared active effect state
-   [ ] Shared active music state
-   [ ] Shared visible character ids
-   [ ] Shared token layout updates
-   [ ] Shared clone token lifecycle
-   [ ] Shared dice roll result broadcast
-   [ ] Character update broadcasts
-   [ ] Highlighted journal post broadcast
-   [ ] Journal post creation broadcast
-   [ ] Campaign roster update broadcasts
-   [ ] Reconnect resync support

If the backend delivers the items above, the frontend can move from isolated local match state to a real shared online tabletop session.
