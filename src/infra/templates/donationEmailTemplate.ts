interface DonationEmailTemplatePayload {
    nickname: string;
    userId: string;
    value: number;
    timestamp: string;
}

export default function donationEmailTemplate({
    nickname,
    userId,
    value,
    timestamp,
}: DonationEmailTemplatePayload): string {
    return `
        <section>
            <h1>Donation Validation Request</h1>
            <p><strong>Nickname:</strong> ${nickname}</p>
            <p><strong>User ID:</strong> ${userId}</p>
            <p><strong>Value:</strong> ${value.toFixed(2)}</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
        </section>
    `;
}
