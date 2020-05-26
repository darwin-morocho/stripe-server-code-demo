import express, { Application, Response, Request } from "express";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { userAuth } from "./middlewares";

dotenv.config();
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
const stripe = new Stripe("sk_test_IsY8pEagX6mbIUWQSzOiSr6p00zCza9VjQ", {
  apiVersion: "2020-03-02",
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello 🤪");
});

app.post(
  "/create-payment-intent",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const amount = req.body.amount as number;
      const intent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
        amount, // centavos
        currency: "usd",
        metadata: {
          userId: 12,
          productId: 1293,
        },
      });

      res.send({ id: intent.id, clientSecret: intent.client_secret });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

app.post(
  "/check-payment-status",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId as string;
      if (!paymentIntentId || paymentIntentId.trim().length == 0) {
        throw new Error("invalid param paymentIntentId");
      }

      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

      console.log("intent", intent);
      res.send({ status: intent.status });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("running " + PORT);
});
