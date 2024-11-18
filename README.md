# Yardstik Webhook Signature Demo

[Webhook Documentation](https://developer.yardstik.com/#section/Using-Webhooks)

This is a demo application to showcase the use of Webhook Signatures for securing endpoints.

*This is not production ready code.*

## Prerequisites

To run this demo you will need:

* [A Yardstik account](https://app.yardstik.com) (*[Talk to sales?](https://yardstik.com/talk-to-sales/)*)
* [An understanding of webhooks](https://developer.yardstik.com/#section/Using-Webhooks/Listen-for-Webhook-Events)
* [Node.js](https://nodejs.org/en/download)
* [ngrok](https://ngrok.com/)

## Setup
**Time**: *15 minutes*

1. Go to Yardstik Developer > [API Keys](https://app.yardstik.com/developer/api-keys)
2. Add a key with the name `WEBHOOK_SIGNATURE`
    *  *Name must be exact, Yardstik will use this key to sign all future webhooks*
    <img src="https://yardstik-assets.s3.us-east-1.amazonaws.com/images/demo/webhook_api_key.png" width="50%" height="50%" />

3. Export your signature key to your environment
    ```bash
    export WEBHOOK_SIGNATURE="***************************"
    ```

4. Install Dependencies
    ```bash
    npm install 
    ```

5. Start app
    ```bash
    npm start

    > start
    > node app.js
    ```

6. Start ngrok to get your publicly accessible endpoint
* **Warning**: Consult your security team before installing any new tools and starting public tunnels.  You should understand the risks to exposing ports on your workstation.
    ```bash
    ngrok http 3000
    ```

    ```bash
    ngrok                                                                                               (Ctrl+C to quit)

    Sign up to try new private endpoints https://ngrok.com/new-features-update?ref=private

    Session Status                online
    Account                       
    Version                       3.18.4
    Region                        United States (us)
    Latency                       49ms
    Web Interface                 http://127.0.0.1:4040
    Forwarding                    https://eba2-38-142-174-58.ngrok-free.app -> http://localhost:3000

    Connections                   ttl     opn     rt1     rt5     p50     p90
                                  7       0       0.00    0.00    90.05   90.12

    HTTP Requests
    -------------
    ```
6. Copy the https endpoint provided: `https://eba2-38-142-174-58.ngrok-free.app`

7. Go to Yardstik Developer > [Webhooks](https://app.yardstik-staging.com/developer/webhooks) and create a new webhook for `account.updated` and enter your endpoint address

    <img src="https://yardstik-assets.s3.us-east-1.amazonaws.com/images/demo/webhook_add.png" width="50%" height="50%" />

8. Go to [Account Settings](https://app.yardstik-staging.com/settings/account) scroll all the way to the bottom and select **UPDATE CONTACT INFO**. 
    * *No changes required here, just click update and the same settings will be applied*
    * A webhook will be sent to your application endpoint.  If the signature is set up correctly, you will see matching hashes printed and a 200 response code.  

    * When the signing key header is missing your app **should not** process the payload..
    * When the your hash is **different** from the `x-yardstik-webhook-signature` headers, your app **should not** process the payload.
    * If the `x-yardstik-webhook-signature` header and your calculated hash match, your app **should** process the webhook.

    <img src="https://yardstik-assets.s3.us-east-1.amazonaws.com/images/demo/webhook_signing.ngrok.png" width="50%" height="50%" />

    <img src="https://yardstik-assets.s3.us-east-1.amazonaws.com/images/demo/webhook_signing.demoapp.png" width="50%" height="50%" />

9. Copy the payload recieved and attempt to send it directly without the signature
    ```bash
    curl -X POST --header 'Content-Type: application/json' https://52c4-71-82-161-58.ngrok-free.app -d '{
    "id": "1c9c9a51-6589-468e-bd25-101e44a3f317",
    "event": "updated",
    "resource_id": "********************************",
    "account_id": "********************************",
    "account_name": "****************",
    "resource_type": "account",
    "resource_url": "https://api.yardstik-staging.com/accounts/********************************",
    "status": "credentialed",
    "timestamp": "2024-11-12T17:05:22.214Z"
    }'
    ```
    * The response you get back will be `Unauthorized` and the app should log `Missing x-yardstik-webhook-signature header`.
    * Add `--header 'x-yardstik-webhook-signature: someothergeneratedcode'` to see a mismatch error.
