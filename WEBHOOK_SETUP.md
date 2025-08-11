# Flutterwave Webhook Setup Guide

This guide explains how to set up and configure Flutterwave webhooks for your WB Merch application.

## Overview

The webhook endpoint automatically processes payment notifications from Flutterwave and updates your order data when payments are successful. This eliminates the need for manual payment verification and ensures real-time order updates.

## Webhook Endpoint

**URL**: `/api/webhook/flutterwave`

**Method**: POST

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
FLW_WEBHOOK_SECRET_HASH=your_random_secret_hash_here
```

**Important**: Generate a random, secure string for this value. This will be used to verify that webhook requests are actually from Flutterwave.

## Flutterwave Dashboard Configuration

1. Log in to your Flutterwave dashboard
2. Go to **Settings** → **Webhooks**
3. Add your webhook URL: `https://yourdomain.com/api/webhook/flutterwave`
4. **Check all the boxes** for the events you want to receive
5. Set your **Secret Hash** to match the `FLW_WEBHOOK_SECRET_HASH` environment variable
6. Save your settings

## Supported Webhook Events

The webhook endpoint handles the following events:

### Payment Events

- `charge.completed` - Payment successful
- `charge.failed` - Payment failed

### Transfer Events

- `transfer.completed` - Transfer successful
- `transfer.failed` - Transfer failed

### Subscription Events (if applicable)

- `subscription.activated` - Subscription activated
- `subscription.cancelled` - Subscription cancelled

### Refund Events

- `refund.processed` - Refund processed

## How It Works

### 1. Payment Success (`charge.completed`)

When a payment is successful:

1. **Signature Verification**: Verifies the webhook signature using your secret hash
2. **Order Lookup**: Finds the order using the `tx_ref` (transaction reference)
3. **Transaction Verification**: Double-checks the payment with Flutterwave's API
4. **Order Update**: Updates the order with:
   - `isPaid: true`
   - `transactionId` (from Flutterwave)
   - `status: "confirmed"`
   - `confirmedAt` (current timestamp)
5. **Inventory Update**: Reduces product stock and increases sold count
6. **Response**: Returns 200 status to acknowledge receipt

### 2. Security Features

- **Signature Verification**: Uses `verif-hash` header to verify webhook authenticity
- **Transaction Verification**: Re-verifies payment details with Flutterwave API
- **Amount Validation**: Ensures payment amount matches order amount
- **Currency Validation**: Ensures payment currency matches order currency
- **Duplicate Prevention**: Checks if order is already paid before processing

### 3. Error Handling

- **Invalid Signatures**: Returns 401 Unauthorized
- **Missing Orders**: Returns 404 Not Found
- **Verification Failures**: Returns 400 Bad Request
- **Server Errors**: Returns 500 Internal Server Error

## Testing

### Using webhook.site

1. Visit [webhook.site](https://webhook.site)
2. Copy the generated webhook URL
3. Use this URL temporarily in your Flutterwave dashboard
4. Make a test payment to see the webhook payload
5. Replace with your actual webhook URL when ready

### Local Testing

For local development, you can use tools like:

- [ngrok](https://ngrok.com/) to expose your local server
- [localtunnel](https://github.com/localtunnel/localtunnel)

## Monitoring and Logging

The webhook logs important events to the console:

- Webhook receipt with event type and transaction reference
- Payment confirmations
- Errors and verification failures
- Inventory updates

**Production Note**: Replace console.log with proper logging service in production.

## Best Practices

1. **Always verify webhook signatures** - Never disable signature verification
2. **Re-verify transactions** - Use Flutterwave's API to double-check payment details
3. **Handle duplicates** - Check if orders are already processed
4. **Respond quickly** - Webhooks timeout after 60 seconds
5. **Log everything** - Keep detailed logs for debugging
6. **Test thoroughly** - Test with small amounts before going live

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**

   - Check if webhook URL is accessible
   - Verify webhook is enabled in Flutterwave dashboard
   - Check server logs for errors

2. **Signature verification failing**

   - Ensure `FLW_WEBHOOK_SECRET_HASH` matches dashboard setting
   - Check if `verif-hash` header is present

3. **Orders not updating**

   - Verify transaction reference matches order reference
   - Check if order exists in database
   - Ensure webhook has proper database permissions

4. **Timeout errors**
   - Optimize webhook processing time
   - Move heavy operations to background jobs
   - Ensure database operations are efficient

## Support

If you encounter issues:

1. Check the webhook logs in your server console
2. Verify Flutterwave dashboard configuration
3. Test with webhook.site to isolate issues
4. Check Flutterwave's webhook documentation for updates

## Security Considerations

- **Never expose your secret hash** in client-side code
- **Use HTTPS** for your webhook endpoint
- **Validate all incoming data** before processing
- **Implement rate limiting** if needed
- **Monitor for suspicious activity** in webhook logs
