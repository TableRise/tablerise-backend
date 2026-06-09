# Message Encryption at Rest

## Overview

TableRise stores user-to-user inbox messages encrypted at rest. The API contract remains plaintext for clients:

-   clients send plaintext `title` and `content`
-   the backend encrypts both fields before persisting
-   the backend decrypts both fields before returning message payloads

This improves protection for database dumps and backups, but it is not end-to-end encryption. The backend still has the key and can decrypt stored messages.

## What Is Encrypted

The backend encrypts:

-   `title`
-   `content`

The backend keeps these fields in plaintext for application logic and indexing:

-   `messageId`
-   `userId`
-   `timestamp`
-   `status`
-   `keyVersion`
-   `algorithm`
-   `nonce`

## Implementation

The encrypt/decrypt logic lives in `src/domains/users/helpers/MessageCrypto.ts`.

Implementation details:

-   algorithm: `AES-256-GCM`
-   key source: `MESSAGE_ENCRYPTION_KEY`
-   key format: base64-encoded 32-byte key
-   nonce/IV: random per message, stored in the `nonce` field
-   key version: `1`

`encryptedTitle` and `encryptedContent` store both ciphertext and authentication tag in a single string using the format:

```text
<ciphertext-base64>:<auth-tag-base64>
```

The helper encrypts `title` and `content` independently while using a single message nonce and field-specific derived keys.

## Environment Variable

Add this variable to the backend environment:

```env
MESSAGE_ENCRYPTION_KEY=base64_encoded_32_byte_key
```

For v1, the value must decode to exactly 32 bytes.

## Limits

This model protects data at rest in the database, but it does not prevent the backend from reading messages. If the goal is to ensure only sender and receiver can read message content, the correct model is end-to-end encryption implemented with frontend key management.
